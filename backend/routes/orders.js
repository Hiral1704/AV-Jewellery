
const router = require('express').Router();

const Order = require('../models/Order');
const Product = require('../models/Product');

const { protect, adminOnly } = require('../middleware/auth');

// Place new order
router.post('/', protect, async (req, res) => {
    try {
        const { customer, items } = req.body;

        if (
            !customer?.name ||
            !customer?.phone ||
            !customer?.address ||
            !Array.isArray(items) ||
            !items.length
        ) {
            return res.status(400).json({
                message: 'Please provide delivery details and cart items'
            });
        }

        const verified = [];
        let total = 0;

        for (const item of items) {
            const product = await Product.findById(
                item.productId || item.id
            );

            if (!product || !product.active) {
                return res.status(400).json({
                    message: 'A product in your cart is unavailable'
                });
            }

            const qty = Math.max(
                1,
                Math.floor(Number(item.qty) || 1)
            );

            if (product.stock < qty) {
                return res.status(400).json({
                    message: `Only ${product.stock} ${product.name} available`
                });
            }

            verified.push({ product, qty });
            total += product.price * qty;
        }

        // Update product stock
        for (const item of verified) {
            const result = await Product.updateOne(
                {
                    _id: item.product._id,
                    stock: { $gte: item.qty }
                },
                {
                    $inc: { stock: -item.qty }
                }
            );

            if (result.modifiedCount !== 1) {
                return res.status(409).json({
                    message: `Stock changed for ${item.product.name}. Please refresh your cart.`
                });
            }
        }

        // Create order
        const order = await Order.create({
            customer: {
                ...customer,
                userId: req.user._id
            },

            items: verified.map(({ product, qty }) => ({
                productId: String(product._id),
                name: product.name,
                price: product.price,
                qty,
                image: product.image
            })),

            total,
            status: 'Pending',
            paymentMethod: 'COD'
        });

        res.status(201).json(order);

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});

// Get orders of logged-in user
router.get('/mine', protect, async (req, res) => {
    res.json(
        await Order.find({
            'customer.userId': req.user._id
        }).sort({ createdAt: -1 })
    );
});

// Get all orders (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
    res.json(
        await Order.find().sort({ createdAt: -1 })
    );
});

// Update order status (Admin only)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const allowed = [
            'Pending',
            'Confirmed',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled'
        ];

        if (!allowed.includes(req.body.status)) {
            return res.status(400).json({
                message: 'Invalid order status'
            });
        }

        const o = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!o) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.json(o);

    } catch (e) {
        res.status(400).json({
            message: 'Invalid order id'
        });
    }
});

module.exports = router;

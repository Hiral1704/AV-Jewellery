
const router = require('express').Router();

const Product = require('../models/Product');

const { protect, adminOnly } = require('../middleware/auth');

// Get all products with filters and sorting
router.get('/', async (req, res) => {
    try {
        const {
            category,
            search,
            style,
            occasion,
            sort,
            featured
        } = req.query;

        let q = { active: true };

        if (category && category !== 'All')
            q.category = category;

        if (style && style !== 'All')
            q.style = style;

        if (occasion && occasion !== 'All')
            q.occasion = occasion;

        if (featured === 'true')
            q.featured = true;

        if (search)
            q.name = { $regex: search, $options: 'i' };

        const sortBy =
            sort === 'price-low'
                ? { price: 1 }
                : sort === 'price-high'
                    ? { price: -1 }
                    : { createdAt: -1 };

        res.json(await Product.find(q).sort(sortBy));

    } catch (e) {
        res.status(500).json({
            message: 'Unable to fetch products'
        });
    }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const p = await Product.findById(req.params.id);

        if (!p || !p.active)
            return res.status(404).json({
                message: 'Product not found'
            });

        res.json(p);

    } catch (e) {
        res.status(400).json({
            message: 'Invalid product id'
        });
    }
});

// Add new product (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const p = await Product.create(req.body);

        res.status(201).json(p);

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});

// Update product (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const p = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!p)
            return res.status(404).json({
                message: 'Product not found'
            });

        res.json(p);

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});

// Delete product (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const p = await Product.findByIdAndDelete(req.params.id);

        if (!p)
            return res.status(404).json({
                message: 'Product not found'
            });

        res.json({
            message: 'Product deleted'
        });

    } catch (e) {
        res.status(400).json({
            message: 'Invalid product id'
        });
    }
});

module.exports = router;

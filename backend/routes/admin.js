
const router = require('express').Router();

const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload Directory
const uploadDir = path.join(__dirname, '../public/uploads');

fs.mkdirSync(uploadDir, { recursive: true });

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),

    filename: (req, file, cb) =>
        cb(
            null,
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname).toLowerCase()
        )
});

// Image Upload Configuration
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) =>
        cb(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype))
});

// Admin Session Middleware
const adminSession = (req, res, next) => {
    if (!req.session.admin)
        return res.redirect('/admin/login');

    next();
};

// Admin Login Page
router.get('/login', (req, res) =>
    res.render('admin/login', { error: '' })
);

// Admin Login
router.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: (req.body.email || '').toLowerCase(),
        role: 'admin'
    });

    if (
        !user ||
        !await user.comparePassword(req.body.password || '')
    ) {
        return res.render('admin/login', {
            error: 'Invalid admin credentials'
        });
    }

    req.session.admin = {
        id: user._id,
        name: user.name,
        email: user.email
    };

    res.redirect('/admin');
});

// Admin Logout
router.post('/logout', (req, res) =>
    req.session.destroy(() => res.redirect('/admin/login'))
);

// Admin Dashboard
router.get('/', adminSession, async (req, res) => {
    try {
        const [products, orders, customers] = await Promise.all([
            Product.find().sort({ createdAt: -1 }),
            Order.find().sort({ createdAt: -1 }),
            User.find({ role: 'customer' }).select('-password')
        ]);

        res.render('admin/index', {
            products,
            orders,
            customers,
            admin: req.session.admin
        });

    } catch (e) {
        res.status(500).send('Dashboard error: ' + e.message);
    }
});

// Add Product
router.post(
    '/products',
    adminSession,
    upload.single('image'),
    async (req, res) => {
        try {
            const data = {
                ...req.body,
                price: Number(req.body.price),
                originalPrice: req.body.originalPrice
                    ? Number(req.body.originalPrice)
                    : undefined,
                stock: Number(req.body.stock || 0),
                featured: req.body.featured === 'on',
                active: req.body.active !== 'off'
            };

            if (req.file)
                data.image = '/uploads/' + req.file.filename;

            await Product.create(data);

            res.redirect('/admin#products');

        } catch (e) {
            res.status(400).send(
                'Product creation failed: ' + e.message
            );
        }
    }
);

// Delete Product
router.post(
    '/products/:id/delete',
    adminSession,
    async (req, res) => {
        await Product.findByIdAndDelete(req.params.id);

        res.redirect('/admin#products');
    }
);

// Update Product
router.post(
    '/products/:id/update',
    adminSession,
    upload.single('image'),
    async (req, res) => {
        try {
            const data = {
                ...req.body,
                price: Number(req.body.price),
                stock: Number(req.body.stock || 0),
                featured: req.body.featured === 'on',
                active: req.body.active === 'on'
            };

            if (req.file)
                data.image = '/uploads/' + req.file.filename;

            await Product.findByIdAndUpdate(
                req.params.id,
                data,
                { runValidators: true }
            );

            res.redirect('/admin#products');

        } catch (e) {
            res.status(400).send(
                'Update failed: ' + e.message
            );
        }
    }
);

// Update Order Status
router.post(
    '/orders/:id/status',
    adminSession,
    async (req, res) => {
        const valid = [
            'Pending',
            'Confirmed',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled'
        ];

        if (valid.includes(req.body.status)) {
            await Order.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status }
            );
        }

        res.redirect('/admin#orders');
    }
);

module.exports = router;

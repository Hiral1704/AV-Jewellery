require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'change-this-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/uploads', express.static(
    path.join(__dirname, 'public/uploads')
));

app.use(express.static(
    path.join(__dirname, 'public')
));

app.get('/', (req, res) => {
    res.json({
        message: 'A.V. Jewellery API is running',
        endpoints: [
            '/api/auth',
            '/api/products',
            '/api/orders',
            '/admin'
        ]
    });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

mongoose.connect(
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/av_jewellery'
)
    .then(() => {
        console.log('MongoDB connected');

        app.listen(PORT, () => {
            console.log(`A.V. backend: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });
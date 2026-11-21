
require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('./models/Product');

const items = [
    {
        name: 'Celeste Pearl Drops',
        category: 'Earrings',
        price: 1499,
        description: 'Soft pearl drops with a delicate golden finish.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
        stock: 12,
        style: 'Minimal',
        occasion: 'Daily Wear',
        featured: true
    },
    {
        name: 'Solitaire Glow Ring',
        category: 'Rings',
        price: 1899,
        description: 'A modern ring for everyday elegance.',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
        stock: 8,
        style: 'Modern',
        occasion: 'Party',
        featured: true
    },
    {
        name: 'Golden Hour Necklace',
        category: 'Necklaces',
        price: 2499,
        description: 'A fine chain with a timeless pendant.',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
        stock: 10,
        style: 'Minimal',
        occasion: 'Festive',
        featured: true
    },
    {
        name: 'Luna Bracelet',
        category: 'Bracelets',
        price: 1299,
        description: 'A graceful bracelet that layers beautifully.',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80',
        stock: 15,
        style: 'Modern',
        occasion: 'Daily Wear',
        featured: true
    }
];

(async () => {
    await mongoose.connect(
        process.env.MONGO_URI ||
        'mongodb://127.0.0.1:27017/av_jewellery'
    );

    if (await Product.countDocuments() === 0) {
        await Product.insertMany(items);
        console.log('Sample products inserted.');
    } else {
        console.log('Products already exist; seed skipped.');
    }

    await mongoose.disconnect();
})();

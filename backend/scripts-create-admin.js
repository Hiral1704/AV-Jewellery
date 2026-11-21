
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
    await mongoose.connect(
        process.env.MONGO_URI ||
        'mongodb://127.0.0.1:27017/av_jewellery'
    );

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        console.error(
            'Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env first.'
        );
        process.exit(1);
    }

    const email = process.env.ADMIN_EMAIL.toLowerCase();

    let u = await User.findOne({ email });

    if (u) {
        u.role = 'admin';
        u.password = process.env.ADMIN_PASSWORD;

        await u.save();

        console.log('Admin updated:', email);
    } else {
        u = await User.create({
            name: process.env.ADMIN_NAME || 'A.V. Jewellery Admin',
            email,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin'
        });

        console.log('Admin created:', email);
    }

    console.log('Change the default password after first login.');

    await mongoose.disconnect();
})();

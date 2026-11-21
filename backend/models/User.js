
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: String,

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer'
        },

        resetToken: String,

        resetTokenExpires: Date
    },
    {
        timestamps: true
    }
);

// Password Hashing Middleware
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

// Password Comparison Method
UserSchema.methods.comparePassword = function (p) {
    return bcrypt.compare(p, this.password);
};

module.exports = mongoose.model('User', UserSchema);

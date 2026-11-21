
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        originalPrice: {
            type: Number,
            min: 0
        },
        description: String,
        image: String,
        images: [String],
        stock: {
            type: Number,
            default: 0,
            min: 0
        },
        style: String,
        occasion: String,
        featured: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', ProductSchema);

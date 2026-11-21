const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        customer: {
            name: String,
            email: String,
            phone: String,
            address: String,
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        },

        items: [
            {
                productId: String,
                name: String,
                price: Number,
                qty: Number,
                image: String
            }
        ],

        total: Number,

        paymentMethod: {
            type: String,
            default: 'COD'
        },

        status: {
            type: String,
            enum: [
                'Pending',
                'Confirmed',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled'
            ],
            default: 'Pending'
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

module.exports = mongoose.model('Order', OrderSchema);
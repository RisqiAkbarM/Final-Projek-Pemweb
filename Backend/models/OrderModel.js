const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Menghubungkan pesanan dengan user yang membuatnya
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Referensi ke UserModel
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            imageUrl: { type: String, required: true },
            price: { type: Number, required: true },
            product: { // Referensi ke produk asli
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
        },
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'COD', // Kita set default COD untuk saat ini
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

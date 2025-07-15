const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    buyUrl: { type: String, required: true }
}, { timestamps: true });

// Pastikan model diekspor dengan benar
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
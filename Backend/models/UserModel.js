const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'customer',
    },
    shippingAddress: {
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String },
    },
}, { timestamps: true });

// Fungsi ini akan otomatis mengenkripsi password sebelum user disimpan
userSchema.pre('save', async function(next) {
    // Hanya hash password jika field password diubah
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// =======================================================
// FUNGSI PENTING YANG HILANG ADA DI SINI
// =======================================================
// Menambahkan metode 'matchPassword' ke skema pengguna
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

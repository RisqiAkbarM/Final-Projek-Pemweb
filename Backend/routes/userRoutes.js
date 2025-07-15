const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
// Impor 'admin' dari middleware
const { protect, admin } = require('../middleware/authMiddleware.js');

// Fungsi untuk membuat token login
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Rute: POST /api/users/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User dengan email ini sudah terdaftar' });
        }
        const user = await User.create({ name, email, password });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Data user tidak valid' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
});

// Rute: POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                shippingAddress: user.shippingAddress,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email atau password salah' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
});

// Rute: GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                shippingAddress: user.shippingAddress
            });
        } else {
            res.status(404).json({ message: 'User tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
});


// Rute: PUT /api/users/profile -> Mengupdate profil user
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            if (req.body.shippingAddress) {
                if (!user.shippingAddress) {
                    user.shippingAddress = {};
                }
                user.shippingAddress.address = req.body.shippingAddress.address || user.shippingAddress.address;
                user.shippingAddress.city = req.body.shippingAddress.city || user.shippingAddress.city;
                user.shippingAddress.postalCode = req.body.shippingAddress.postalCode || user.shippingAddress.postalCode;
                user.shippingAddress.country = req.body.shippingAddress.country || user.shippingAddress.country;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                shippingAddress: updatedUser.shippingAddress,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error saat update profil:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
});

// =======================================================
// RUTE BARU: GET /api/users -> Mendapatkan SEMUA user (Hanya Admin)
// =======================================================
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Ambil semua user tanpa passwordnya
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data pengguna', error: error.message });
    }
});

module.exports = router;

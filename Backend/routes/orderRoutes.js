const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const { protect, admin } = require('../middleware/authMiddleware.js');

// --- (Rute-rute Anda yang sudah ada: POST /, GET /myorders, GET /:id, GET /) ---
// Rute: POST /api/orders -> Membuat pesanan baru
router.post('/', protect, async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'Tidak ada item di keranjang' });
        }
        const order = new Order({
            orderItems: orderItems.map(item => ({ ...item, product: item._id })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: 'Gagal membuat pesanan', error: error.message });
    }
});

// Rute: GET /api/orders/myorders -> Mendapatkan riwayat pesanan user
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil riwayat pesanan', error: error.message });
    }
});

// Rute: GET /api/orders/:id -> Mendapatkan detail satu pesanan
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (order) {
            if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
                res.json(order);
            } else {
                return res.status(401).json({ message: 'Tidak terotorisasi' });
            }
        } else {
            res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data pesanan', error: error.message });
    }
});

// Rute: GET /api/orders -> Mendapatkan SEMUA pesanan (Hanya Admin)
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data pesanan', error: error.message });
    }
});


// =======================================================
// RUTE BARU UNTUK ADMIN MENGUBAH STATUS PESANAN
// =======================================================

// PUT /api/orders/:id/pay -> Menandai pesanan sudah dibayar
router.put('/:id/pay', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengupdate status pembayaran', error: error.message });
    }
});

// PUT /api/orders/:id/deliver -> Menandai pesanan sudah dikirim
router.put('/:id/deliver', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengupdate status pengiriman', error: error.message });
    }
});


module.exports = router;

const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');
const { protect, admin } = require('../middleware/authMiddleware.js');

// =======================================================
// RUTE GET SEMUA PRODUK (DIPERBARUI DENGAN FUNGSI PENCARIAN)
// =======================================================
router.get('/', async (req, res) => {
    try {
        // Cek apakah ada kata kunci pencarian di URL (contoh: /api/products?keyword=lipcream)
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword, // Cari nama produk yang mengandung kata kunci
                $options: 'i' // 'i' berarti pencarian tidak case-sensitive (besar/kecil huruf diabaikan)
            }
        } : {}; // Jika tidak ada keyword, object ini akan kosong

        // Temukan produk berdasarkan kata kunci (atau semua produk jika keyword kosong)
        const products = await Product.find({ ...keyword }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
});


// --- Rute-rute lain (tidak ada perubahan) ---

// GET /api/products/:id -> Mendapatkan satu produk berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
});

// POST /api/products -> Membuat produk baru (Hanya Admin)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, slug, description, price, imageUrl, buyUrl } = req.body;
        const product = new Product({
            name, slug, description, price, imageUrl, buyUrl
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Gagal membuat produk', error: error.message });
    }
});

// PUT /api/products/:id -> Mengupdate produk (Hanya Admin)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { name, slug, description, price, imageUrl, buyUrl } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name;
            product.slug = slug;
            product.description = description;
            product.price = price;
            product.imageUrl = imageUrl;
            product.buyUrl = buyUrl;
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Gagal mengupdate produk', error: error.message });
    }
});

// DELETE /api/products/:id -> Menghapus produk (Hanya Admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Produk berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus produk', error: error.message });
    }
});


module.exports = router;

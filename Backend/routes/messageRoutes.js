const express = require('express');
const router = express.Router();
const Message = require('../models/MessageModel');

// POST /api/messages -> Menerima dan menyimpan pesan baru
router.post('/', async (req, res) => {
    try {
        // Mengambil data (nama, email, pesan) dari form yang dikirim
        const { name, email, message } = req.body;

        // Membuat dokumen baru menggunakan MessageModel
        const newMessage = new Message({
            name,
            email,
            message
        });

        // Menyimpan pesan ke database
        const savedMessage = await newMessage.save();

        // Mengirim respon sukses ke frontend
        res.status(201).json({ 
            success: true, 
            message: 'Pesan Anda telah berhasil terkirim!', 
            data: savedMessage 
        });

    } catch (error) {
        // Jika ada error (misalnya, ada field yang kosong), kirim pesan error
        res.status(400).json({ 
            success: false, 
            message: 'Gagal mengirim pesan. Pastikan semua kolom terisi.', 
            error: error.message 
        });
    }
});

module.exports = router;

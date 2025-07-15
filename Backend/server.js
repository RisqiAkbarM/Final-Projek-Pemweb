require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Impor semua file rute
const productRoutes = require('./routes/productRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Pastikan ini ada

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Gunakan semua rute
app.use('/api/products', productRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes); // Pastikan ini ada

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Berhasil terhubung ke MongoDB');
        app.listen(PORT, () => {
            console.log(`✅ Backend API server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Gagal terhubung ke MongoDB:', error.message);
    }
};

startServer();

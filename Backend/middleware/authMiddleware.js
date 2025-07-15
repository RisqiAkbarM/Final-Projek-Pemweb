const jwt = require('jsonwebtoken');
const User = require('../models/UserModel.js');

const protect = async (req, res, next) => {
    console.log('\n--- [Middleware Protect] Mulai memeriksa otorisasi ---');
    let token;

    // 1. Cek apakah header otorisasi ada dan berformat 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            console.log('1. Header "Bearer" ditemukan.');
            
            // 2. Ambil token dari header
            token = req.headers.authorization.split(' ')[1];
            console.log('2. Token berhasil diambil.');

            // 3. Verifikasi token menggunakan kunci rahasia
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('3. Token berhasil diverifikasi. ID User:', decoded.id);

            // 4. Ambil data user dari database berdasarkan ID di token
            req.user = await User.findById(decoded.id).select('-password');
            console.log('4. Data user berhasil ditemukan di database.');

            // 5. Jika semua berhasil, lanjutkan ke proses selanjutnya (rute profil)
            console.log('5. Otorisasi berhasil. Melanjutkan ke rute...');
            next();

        } catch (error) {
            console.error('!!! [Middleware Protect] Terjadi error di blok catch !!!');
            console.error(error);
            res.status(401).json({ message: 'Tidak terotorisasi, token gagal' });
        }
    }

    if (!token) {
        console.log('1. Header "Bearer" TIDAK ditemukan. Mengirim status 401.');
        res.status(401).json({ message: 'Tidak terotorisasi, tidak ada token' });
    }
};

const admin = (req, res, next) => {
    console.log('\n--- [Middleware Admin] Memeriksa peran user ---');
    if (req.user && req.user.role === 'admin') {
        console.log('Peran adalah "admin". Akses diizinkan.');
        next();
    } else {
        console.log('Peran BUKAN "admin". Akses ditolak.');
        res.status(401).json({ message: 'Tidak terotorisasi sebagai admin' });
    }
};

module.exports = { protect, admin };

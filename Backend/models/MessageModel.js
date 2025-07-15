const mongoose = require('mongoose');

// Ini adalah struktur atau "cetakan" untuk setiap pesan yang masuk
const messageSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Nama tidak boleh kosong'] 
    },
    email: { 
        type: String, 
        required: [true, 'Email tidak boleh kosong'] 
    },
    message: { 
        type: String, 
        required: [true, 'Pesan tidak boleh kosong'] 
    }
}, { 
    // Opsi ini akan otomatis menambahkan waktu kapan pesan dibuat
    timestamps: true 
});

// Membuat model dari skema di atas
const Message = mongoose.model('Message', messageSchema);

// Ekspor model agar bisa digunakan di file lain
module.exports = Message;

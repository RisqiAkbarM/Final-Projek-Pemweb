const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/ProductModel');

// PASTIKAN SEMUA PRODUK ADA DI DALAM ARRAY INI
const products = [
  { name: "Wienkglam Misty Nude Lipstick", slug: "misty-nude", description: "Warna nude elegan...", price: 89000, imageUrl: "lipstik2.jpg", buyUrl: "https://id.shp.ee/ppsEJnj" },
  { name: "Wienkglam Dusty Mauve Lipstick", slug: "dusty-mauve", description: "Campuran ungu dan abu-abu...", price: 89000, imageUrl: "lipstik5.jpg", buyUrl: "https://id.shp.ee/8Z1hk3N" },
  { name: "Wienkglam Coral Choco Lipstick", slug: "coral-choco", description: "Perpaduan sempurna coral dan coklat...", price: 89000, imageUrl: "lipstik3.jpg", buyUrl: "https://id.shp.ee/aSMogdF" },
  { name: "Wienkglam Pixy Bold Lipstick", slug: "pixy-bold", description: "Warna merah muda cerah...", price: 89000, imageUrl: "lipstik4.jpg", buyUrl: "https://id.shp.ee/TovFTzG" },
  { name: "Wienkglam Teracotta Lovely Lipstick", slug: "teracotta-lovely", description: "Terracotta lembut...", price: 89000, imageUrl: "lipstik1.jpg", buyUrl: "https://id.shp.ee/Jpk9tXF" },
  { name: "Wienkglam Sweet Exotic Lipstick", slug: "sweet-exotic", description: "Warna unik dan memikat...", price: 89000, imageUrl: "lipstik6.jpg", buyUrl: "https://id.shp.ee/ewbJ5ou" },
  { name: "Wienkglam Cocoa Brick Lipstick", slug: "cocoa-brick", description: "Warna bata coklat yang kuat...", price: 89000, imageUrl: "lipstik7.jpg", buyUrl: "https://id.shp.ee/EAxFAH8" }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany(); // Hapus data lama
    await Product.insertMany(products); // Masukkan semua data baru
    console.log('✅ 7 data produk berhasil dimasukkan ke database!');
    process.exit();
  } catch (error) {
    console.error('❌ Error saat memasukkan data:', error);
    process.exit(1);
  }
};

importData();
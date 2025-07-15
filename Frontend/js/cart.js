// =======================================================
// FUNGSI INTI UNTUK MENGELOLA KERANJANG BELANJA
// =======================================================

/**
 * Mengambil semua item dari keranjang di localStorage.
 * @returns {Array} Array dari produk di keranjang.
 */
function getCartItems() {
    const cart = localStorage.getItem('wienkglamCart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Menyimpan array keranjang ke localStorage.
 * @param {Array} cart - Array produk yang akan disimpan.
 */
function saveCartItems(cart) {
    localStorage.setItem('wienkglamCart', JSON.stringify(cart));
}

/**
 * Menambahkan satu produk ke keranjang.
 * Jika produk sudah ada, jumlahnya akan ditambah 1.
 * @param {Object} product - Objek produk yang akan ditambahkan.
 */
function addToCart(product) {
    if (!product || !product._id) {
        console.error("Produk tidak valid untuk ditambahkan ke keranjang.");
        return;
    }

    const cart = getCartItems();
    const existingProduct = cart.find(item => item._id === product._id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    saveCartItems(cart);
    updateCartIcon(); // Perbarui tampilan ikon di header
    alert(`"${product.name}" telah ditambahkan ke keranjang!`);
}

/**
 * Menghitung total jumlah item di dalam keranjang.
 * @returns {number} Total jumlah item.
 */
function getCartCount() {
    return getCartItems().reduce((total, item) => total + item.quantity, 0);
}

/**
 * Memperbarui angka pada ikon keranjang di header.
 */
function updateCartIcon() {
    const cartCount = getCartCount();
    // Kita cari badge setelah header dimuat
    const cartIconBadge = document.getElementById('cart-icon-badge');
    if (cartIconBadge) {
        if (cartCount > 0) {
            cartIconBadge.textContent = cartCount;
            cartIconBadge.style.display = 'inline-block';
        } else {
            cartIconBadge.style.display = 'none';
        }
    }
}

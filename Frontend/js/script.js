const API_URL = 'https://vercel.com/matsukas-projects/final-projek-pemweb';

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('product-list-container')) {
        fetchProducts();
    }
    if (document.getElementById('product-detail-container')) {
        fetchProductDetail();
    }
});

async function fetchProducts() {
    const container = document.getElementById('product-list-container');
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Gagal mengambil data produk');
        
        const products = await response.json();
        container.innerHTML = ''; 
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'card';
            productCard.style.width = '18rem';
            productCard.innerHTML = `
                <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}"> 
                <div class="card-body text-center">
                    <h5 class="card-title">${product.name}</h5>
                    <a href="product-detail.html?slug=${product.slug}" class="btn btn-outline-danger mt-2">Lihat Detail</a>
                </div>
            `;
            container.appendChild(productCard);
        });
    } catch (error) {
        // ... sisa kode biarkan sama ...
    }
}

async function fetchProductDetail() {
 const container = document.getElementById('product-detail-container');
 try {
  const urlParams = new URLSearchParams(window.location.search);
  const productSlug = urlParams.get('slug');
  if (!productSlug) throw new Error('Slug produk tidak ditemukan di URL.');

  const response = await fetch(`${API_URL}/products/${productSlug}`);
  if (!response.ok) throw new Error('Produk tidak ditemukan.');

  const product = await response.json();

  document.title = `${product.name} - Wienkglam`;
  // PERBAIKI PATH GAMBAR DI SINI
  document.getElementById('product-image').src = `${product.imageUrl}`;
  document.getElementById('product-image').alt = product.name;
  document.getElementById('product-name').innerText = product.name;
  document.getElementById('product-description').innerText = product.description;
  document.getElementById('product-price').innerText = `Harga: Rp ${product.price.toLocaleString('id-ID')}`;
  document.getElementById('buy-now-link').href = product.buyUrl;
 } catch (error) {
  container.innerHTML = `<p class="text-danger text-center w-100">${error.message}</p>`;
  console.error("Error fetching product detail:", error);
 }
}
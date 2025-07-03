document.addEventListener("DOMContentLoaded", function () {
    const productCarousel = document.querySelector('.product-carousel');
    
    // Fungsi untuk mendeteksi swipe kanan-kiri
    let isMouseDown = false;
    let startX;
    let scrollLeft;

    productCarousel.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        startX = e.pageX - productCarousel.offsetLeft;
        scrollLeft = productCarousel.scrollLeft;
    });

    productCarousel.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });

    productCarousel.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    productCarousel.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return; // Jika tidak sedang drag, keluar dari fungsi
        e.preventDefault();
        const x = e.pageX - productCarousel.offsetLeft;
        const walk = (x - startX) * 3; // Kecepatan scroll
        productCarousel.scrollLeft = scrollLeft - walk;
    });
});

function scrollLeft() {
    document.querySelector('.product-carousel').scrollBy({
      left: -250,
      behavior: 'smooth'
    });
  }
  
  function scrollRight() {
    document.querySelector('.product-carousel').scrollBy({
      left: 250,
      behavior: 'smooth'
    });
  }
  
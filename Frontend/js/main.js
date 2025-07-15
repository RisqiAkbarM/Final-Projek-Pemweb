document.addEventListener("DOMContentLoaded", function() {
    // Fungsi generik untuk memuat komponen HTML
    const loadComponent = (url, placeholderId, callback) => {
        fetch(url)
            .then(response => response.ok ? response.text() : null)
            .then(data => {
                if (data) {
                    const placeholder = document.getElementById(placeholderId);
                    if (placeholder) placeholder.innerHTML = data;
                }
                if (callback) callback();
            })
            .catch(error => console.error(`Gagal memuat ${url}:`, error));
    };

    // Fungsi untuk memperbarui UI berdasarkan status login
    const updateUserUI = () => {
        const userMenuPlaceholder = document.getElementById('user-menu-placeholder');
        if (!userMenuPlaceholder) return;

        const userInfoString = localStorage.getItem('userInfo');
        
        if (userInfoString) {
            try {
                const userInfo = JSON.parse(userInfoString);
                
                let adminLink = '';
                if (userInfo && userInfo.role === 'admin') {
                    adminLink = `
                        <li><a class="dropdown-item" href="admin.html">Admin Dashboard</a></li>
                        <li><hr class="dropdown-divider"></li>
                    `;
                }

                userMenuPlaceholder.innerHTML = `
                    <div class="dropdown">
                        <a href="#" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user-circle me-1"></i> Halo, ${userInfo.name}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="profile.html">Profil Saya</a></li>
                            <li><a class="dropdown-item" href="order-history.html">Riwayat Pesanan</a></li>
                            ${adminLink}
                            <li><a class="dropdown-item" href="#" id="logoutButton">Logout</a></li>
                        </ul>
                    </div>
                `;
                
                // =======================================================
                // LOGIKA LOGOUT DIPERBARUI DI SINI
                // =======================================================
                document.getElementById('logoutButton').addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // 1. Hapus informasi pengguna
                    localStorage.removeItem('userInfo');
                    
                    // 2. Hapus keranjang belanja dari pengguna sebelumnya
                    localStorage.removeItem('wienkglamCart');
                    
                    alert('Anda telah berhasil logout.');
                    
                    // 3. Arahkan kembali ke halaman utama
                    window.location.href = 'index.html';
                });

            } catch (error) {
                console.error('Gagal mem-parsing userInfo dari localStorage:', error);
                localStorage.removeItem('userInfo');
                displayLoginButton();
            }
        } else {
            displayLoginButton();
        }
    };

    const displayLoginButton = () => {
        const userMenuPlaceholder = document.getElementById('user-menu-placeholder');
        if (userMenuPlaceholder) {
            userMenuPlaceholder.innerHTML = `
                <a href="login.html" class="btn btn-pink btn-sm">Login</a>
            `;
        }
    };

    // Memuat header, lalu jalankan semua fungsi yang diperlukan
    loadComponent('header.html', 'header-placeholder', () => {
        if (typeof updateCartIcon === 'function') {
            updateCartIcon();
        }
        updateUserUI();
    });

    // Memuat footer
    loadComponent('footer.html', 'footer-placeholder');
});

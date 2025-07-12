document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('loginMessage');

  // Contoh login statis (bisa dihubungkan ke database nantinya)
  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  if (username === adminUsername && password === adminPassword) {
    alert('Login berhasil!');
    // Redirect ke dashboard admin (ganti sesuai kebutuhan)
    window.location.href = 'admin_dashboard.html';
  } else {
    message.style.display = 'block';
    message.textContent = 'Username atau password salah!';
  }
});

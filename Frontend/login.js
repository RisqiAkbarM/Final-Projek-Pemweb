document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://vercel.com/matsukas-projects/final-projek-pemweb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (result.success) {
      alert("Login berhasil!");
      // Simpan token atau user info jika diperlukan
      localStorage.setItem("user", JSON.stringify(result.user));
      window.location.href = "products.html";
    } else {
      alert("Login gagal: " + result.message);
    }
  } catch (error) {
    console.error("Error saat login:", error);
    alert("Terjadi kesalahan. Coba lagi nanti.");
  }
});

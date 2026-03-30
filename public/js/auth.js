export function initAuth() {
    // 1. Logika untuk Logout (di halaman index.html)
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if(confirm('Apakah Anda yakin ingin keluar?')) {
                window.location.href = 'login.html';
            }
        });
    }

    // 2. Logika untuk Login (di halaman login.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah form reload halaman bawaan browser
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Di sini nantinya Anda bisa melakukan validasi ke API/Database.
            // Untuk sementara, kita buat simulasi login sederhana:
            if (username !== '' && password !== '') {
                // Jika input tidak kosong, arahkan ke Dashboard
                window.location.href = 'index.html';
            } else {
                alert('Username dan Password harus diisi!');
            }
        });
    }
}
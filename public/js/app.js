// ==========================================
// 1. SISTEM KEAMANAN & ROUTING HALAMAN
// ==========================================

export const DB_USERS = {
    'admin_pusat':   { pass: 'pusat1234',   role: 'OPERATOR' },
    'admin_awai':    { pass: 'awai1234',    role: 'AWAI' },
    'admin_dempar':  { pass: 'dempar1234',  role: 'DEMPAR' },
    'admin_muut':    { pass: 'muut1234',    role: 'MUUT' },
    'admin_lendian': { pass: 'lendian1234', role: 'LENDIAN' },
    'admin_marimun': { pass: 'marimun1234', role: 'MARIMUN' },
    'admin_mjawaq':  { pass: 'mjawaq1234',  role: 'MUARA JAWAQ' },
    'admin_tondoh':  { pass: 'tondoh1234',  role: 'TONDOH' }
};

const sessionRole = sessionStorage.getItem('userRole');
// ... (biarkan sisa kode di bawahnya tetap sama seperti sebelumnya) ...

// Cek apakah user sedang berada di halaman login.html
const isLoginPage = window.location.pathname.toLowerCase().includes('login.html');

// SKENARIO 1: Belum login, tapi nekat buka halaman dashboard (index.html)
if (!sessionRole && !isLoginPage) {
    window.location.href = 'login.html'; // Usir ke halaman login
    throw new Error("Anda belum login. Mengalihkan ke halaman login...");
}

// SKENARIO 2: Sudah login, tapi iseng buka halaman login.html
if (sessionRole && isLoginPage) {
    window.location.href = 'index.html'; // Kembalikan ke dashboard
    throw new Error("Anda sudah login. Mengalihkan ke dashboard...");
}

// SKENARIO 3: Berada di halaman login.html (Fungsikan form Anda)
if (isLoginPage) {
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Mencegah halaman reload
                
                // Ambil nilai dari input form login Anda
                const u = document.getElementById('username').value.toLowerCase();
                const p = document.getElementById('password').value;

                if (DB_USERS[u] && DB_USERS[u].pass === p) {
                    sessionStorage.setItem('userRole', DB_USERS[u].role); // Catat sesi
                    window.location.href = 'index.html'; // Pindah ke Dashboard
                } else {
                    alert('Username atau Password salah! Silakan coba lagi.');
                }
            });
        }
    });

    // Stop eksekusi kode di bawahnya agar fitur dashboard tidak error di halaman login
    throw new Error("Halaman login aktif. Script dashboard dihentikan sementara.");
}

// ==========================================
// 2. KODE APLIKASI UTAMA (Lanjutan app.js Anda)
// ==========================================
import { renderFormGantiAdmin } from './admin.js';
import { renderInputDataForm, renderDataPelangganTable } from './pelanggan.js';
import { renderBillingForm, renderDataPembayaranTable, renderDashboard } from './pembayaran.js';
import { renderInfoKontak } from './kontak.js';
import { renderLaporan } from './laporan.js';

// 1. Deklarasi Variabel Global di paling atas
let kampungAktif = 'OPERATOR'; 

// 2. Ambil elemen-elemen dari HTML (PENTING: Baris ini harus ada)
const sidebarLinks = document.querySelectorAll('.sidebar-nav a'); // Sesuaikan class-nya dengan HTML kamu
const btnDash = document.getElementById('btnDashboard'); // Sesuaikan ID-nya

// 3. Tambahkan Event Listener untuk Sidebar
if (sidebarLinks.length > 0) {
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Ambil nama kampung dari teks menu
            kampungAktif = link.innerText.trim(); 
            
            // Logika ganti warna aktif di sidebar
            sidebarLinks.forEach(l => l.classList.remove('active-sidebar'));
            link.classList.add('active-sidebar');

            // Panggil renderDashboard dengan filter kampung
            // Import renderDashboard dari pembayaran.js harus sudah dilakukan di atas
            renderDashboard(kampungAktif);
        });
    });
}

// 4. Tambahkan Event Listener untuk tombol Dashboard di Navbar
if (btnDash) {
    btnDash.addEventListener('click', (e) => {
        e.preventDefault();
        renderDashboard(kampungAktif);
    });
}

// 1. KONFIGURASI VISUAL KAMPUNG
const lokasiData = {
    'OPERATOR': { title: 'KUBARPAYNET', bg: 'url("img/kubarpaynet.jpg")', tColor: '#0011ff' },
    'AWAI': { title: 'KAMPUNG AWAI', bg: 'url("img/awai.jpg")', tColor: '#ff3300' },
    'DEMPAR': { title: 'KAMPUNG DEMPAR', bg: 'url("img/dempar.jpg")', tColor: '#00E5FF' },
    'MUUT': { title: 'KAMPUNG MUUT', bg: 'url("img/muut.jpg")', tColor: '#f705a6' },
    'LENDIAN': { title: 'KAMPUNG LENDIAN', bg: 'url("img/lendian.jpg")', tColor: '#FF5722' },
    'MARIMUN': { title: 'KAMPUNG MARIMUN', bg: 'url("img/marimun.jpg")', tColor: '#27fa0b' },
    'TONDOH': { title: 'KAMPUNG TONDOH', bg: 'url("img/tondoh.jpg")', tColor: '#00eeff' },
    'MUARA JAWAQ': { title: 'KAMPUNG MUARA JAWAQ', bg: 'url("img/muarajawaq.jpg")', tColor: '#FFFFFF' }
};

// 2. FUNGSI HELPER (PEMBANTU)
function updateHeader(namaMenu) {
    const data = lokasiData[namaMenu];
    if (!data) return;

    const banner = document.getElementById('bannerContainer');
    const mainTitle = document.getElementById('mainTitle');
    const subTitle = document.getElementById('subTitle');
    const navPelanggan = document.getElementById('navPelanggan');

    if (banner) banner.style.backgroundImage = data.bg;
    if (mainTitle) {
        mainTitle.innerText = data.title;
        mainTitle.style.color = data.tColor;
    }
    if (subTitle) subTitle.style.color = '#FFCC00';

    // Toggle Label Admin vs Pelanggan
    if (navPelanggan) {
        navPelanggan.innerText = (namaMenu === 'OPERATOR') ? 'ADMIN' : 'PELANGGAN';
    }
}

// ==========================================
// FUNGSI JAM REALTIME ANTI-ERROR
// ==========================================
function jalankanJamRealtime() {
    const timeElem = document.getElementById('timeDisplay');
    const dateElem = document.getElementById('dateDisplay');

    // Mencegah error: Jika elemen jam tidak ada (misalnya saat di halaman Login), abaikan saja.
    if (!timeElem || !dateElem) return;

    function updateWaktu() {
        const now = new Date();

        // 1. Format Waktu (Contoh: 14:05:09 WITA)
        const jam = String(now.getHours()).padStart(2, '0');
        const menit = String(now.getMinutes()).padStart(2, '0');
        const detik = String(now.getSeconds()).padStart(2, '0');
        timeElem.innerText = `${jam}:${menit}:${detik} WITA`;

        // 2. Format Tanggal (Contoh: SENIN, 30 MARET 2026)
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        dateElem.innerText = now.toLocaleDateString('id-ID', options).toUpperCase();
    }

    // Eksekusi pembaruan waktu langsung saat halaman dimuat
    updateWaktu();
    
    // Perbarui setiap 1000 milidetik (1 detik)
    setInterval(updateWaktu, 1000);
}

// Fungsi utama ganti halaman (Anti-Menumpuk)
function navigasiKe(fungsiRender) {
    const container = document.getElementById('mainContentArea');
    if (container) {
        container.innerHTML = ""; // Bersihkan konten lama
        fungsiRender();
    }
}

// 3. INISIALISASI EVENT LISTENERS (HANYA SATU BLOK)
document.addEventListener('DOMContentLoaded', () => {

    // 1. PENTING: Ambil data sesi di urutan PALING ATAS
    const sessionRole = sessionStorage.getItem('userRole');
    let kampungAktif = sessionRole || 'OPERATOR'; 

    // 2. Fungsikan tombol Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            const konfirmasi = confirm("Apakah Anda yakin ingin keluar dari sistem?");
            if (konfirmasi) {
                sessionStorage.removeItem('userRole'); // Hapus sesi
                window.location.href = 'login.html'; // Lempar ke halaman login
            }
        });
    }

    // 3. Muat header dan dashboard pertama kali sesuai Hak Akses
    updateHeader(kampungAktif);
    navigasiKe(() => renderDashboard(kampungAktif));

    // ==========================================
    // 4. MODIFIKASI NAVBAR KHUSUS OPERATOR
    // ==========================================
    if (sessionRole === 'OPERATOR') {
        const dropdowns = document.querySelectorAll('.top-nav .dropdown');
        
        if (dropdowns.length >= 2) {
            // 1. Ubah Menu "PELANGGAN" menjadi "ADMIN"
            const menuPelanggan = dropdowns[0];
            menuPelanggan.innerHTML = `<a href="#" class="dropbtn" id="navAdmin">ADMIN</a>`;
            document.getElementById('navAdmin').addEventListener('click', (e) => {
                e.preventDefault();
                navigasiKe(renderFormGantiAdmin);
            });

            // 2. Ubah Menu "PEMBAYARAN" menjadi "DATA MANAGEMENT"
            const menuDataMgmt = dropdowns[1];
            menuDataMgmt.innerHTML = `
                <a href="#" class="dropbtn">DATA MANAGEMENT</a>
                <div class="dropdown-content">
                    <a href="#" id="opDataPelanggan">DATA PELANGGAN</a>
                    <a href="#" id="opDataPembayaran">DATA PEMBAYARAN</a>
                </div>
            `;
            
            // 3. Pasang Event Listener yang Membawa "kampungAktif"
            document.getElementById('opDataPelanggan').addEventListener('click', (e) => {
                e.preventDefault();
                navigasiKe(() => renderDataPelangganTable(kampungAktif)); // Kirim filter kampung
            });
            document.getElementById('opDataPembayaran').addEventListener('click', (e) => {
                e.preventDefault();
                navigasiKe(() => renderDataPembayaranTable(kampungAktif)); // Kirim filter kampung
            });
        }
    }

    // ==========================================
    // 4B. LOGIKA TOMBOL COLLAPSE SIDEBAR
    // ==========================================
    const sidebarElement = document.querySelector('.sidebar');
    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    
    if (btnToggleSidebar && sidebarElement) {
        btnToggleSidebar.addEventListener('click', () => {
            sidebarElement.classList.toggle('collapsed');
            // Ubah arah panah
            if (sidebarElement.classList.contains('collapsed')) {
                btnToggleSidebar.innerText = '❯';
            } else {
                btnToggleSidebar.innerText = '❮';
            }
        });
    }

    // ==========================================
    // 5. LOGIKA SIDEBAR
    // ==========================================
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    sidebarLinks.forEach(link => {
        const menuText = link.innerText.trim();

        // Sembunyikan menu kampung lain jika bukan OPERATOR
        if (sessionRole !== 'OPERATOR' && menuText !== sessionRole) {
            link.style.display = 'none'; 
        }

        // Event listener saat sidebar diklik
        link.addEventListener('click', (e) => {
            e.preventDefault();
            kampungAktif = menuText; 
            updateHeader(kampungAktif);
            navigasiKe(() => renderDashboard(kampungAktif)); 
            
            sidebarLinks.forEach(l => l.classList.remove('active-sidebar'));
            link.classList.add('active-sidebar');
        });
    });

    // ==========================================
    // 6. LOGIKA MENU UTAMA
    // ==========================================
    // Dashboard
    const btnDash = document.getElementById('navDashboard');
    if (btnDash) {
        btnDash.onclick = (e) => {
            e.preventDefault();
            // PENTING: Kirim kampungAktif agar dashboard tidak error/reset
            navigasiKe(() => renderDashboard(kampungAktif));
        };
    }

    // Pelanggan Utama (Hanya berlaku untuk non-operator, karena operator sudah diubah jadi ADMIN)
    const btnPelanggan = document.getElementById('navPelanggan');
    if (btnPelanggan) {
        btnPelanggan.onclick = (e) => {
            e.preventDefault();
            navigasiKe(renderDataPelangganTable);
        };
    }

    // Logika Submenu (Dropdown)
    const menuActions = {
        'subMenuInputData': renderInputDataForm,
        'subMenuDataPelanggan': renderDataPelangganTable,
        'subMenuBilling': renderBillingForm,
        'subMenuDataPembayaran': renderDataPembayaranTable
    };

    Object.keys(menuActions).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.onclick = (e) => {
                e.preventDefault();
                navigasiKe(menuActions[id]);
            };
        }
    });

    // Logika Tombol Laporan
    const btnLaporan = document.getElementById('navLaporan');
    if (btnLaporan) {
        btnLaporan.onclick = (e) => {
            e.preventDefault();
            navigasiKe(renderLaporan);
        };
    }

    // Logika limit data (Opsional)
    document.addEventListener('change', (e) => {
        if (e.target.id === 'dataLimit') {
            console.log(`Limit berubah ke: ${e.target.value}`);
        }
    });
});

// Update bagian Sidebar Listener
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        kampungAktif = link.innerText.trim(); // Simpan kampung yang dipilih
        updateHeader(kampungAktif);
        
        // Otomatis refresh dashboard sesuai kampung yang diklik
        navigasiKe(() => renderDashboard(kampungAktif)); 
        
        sidebarLinks.forEach(l => l.classList.remove('active-sidebar'));
        link.classList.add('active-sidebar');
    });
});

// Update Listener tombol Dashboard di Navbar
if (btnDash) {
    btnDash.onclick = (e) => {
        e.preventDefault();
        // Kirim kampungAktif ke fungsi render
        navigasiKe(() => renderDashboard(kampungAktif)); 
    };
}

// public/js/app.js
import { renderLaporanKeuangan } from './laporan.js'; // TAMBAHKAN INI

// ... (Kode sebelumnya) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (Event listener lainnya) ...

    // Tambahkan Event Listener untuk Menu Laporan
    // Pastikan di index.html Anda, tombol LAPORAN punya id="navLaporan"
    const btnLaporan = document.getElementById('navLaporan');
    if (btnLaporan) {
        btnLaporan.addEventListener('click', (e) => {
            e.preventDefault();
            navigasiKe(renderLaporanKeuangan);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // ... (event listener menu lainnya seperti Dashboard, Pelanggan, dll) ...

    // Tambahkan Logika untuk Menu KONTAK
    const btnKontak = document.getElementById('navKontak'); // Pastikan ID di index.html adalah id="navKontak"
    if (btnKontak) {
        btnKontak.addEventListener('click', (e) => {
            e.preventDefault();
            navigasiKe(renderInfoKontak);
        });
    }
});
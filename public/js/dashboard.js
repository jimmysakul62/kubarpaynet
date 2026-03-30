import { fetchDashboardStats } from './api.js';
import { formatCurrency } from './utils.js';

export async function initDashboard() {
    try {
        const stats = await fetchDashboardStats();
        document.getElementById('valTotalPelanggan').innerText = stats.totalPelanggan;
        document.getElementById('valSudahBayar').innerText = stats.sudahBayar;
        document.getElementById('valTotalPendapatan').innerText = formatCurrency(stats.totalPendapatan);
        document.getElementById('valBelumBayar').innerText = stats.belumBayar;
    } catch (error) {
        console.error("Gagal memuat data dashboard", error);
    }
}

// Fungsi untuk merender Dashboard
export function renderDashboard() {
    const container = document.getElementById('mainContentArea');
    if (!container) return;

    // KUNCI UTAMA: Kosongkan container sebelum mengisi yang baru
    container.innerHTML = ""; 

    // Simulasi Hitung Data (Nanti bisa disambung ke data asli)
    const totalPelanggan = 5; // Contoh dari data Anda (Rudi, Arif, Wati, Budi, Siti)
    const totalPendapatan = 900000; // Contoh total Rp

    container.innerHTML = `
        <h2 class="page-title">DASHBOARD</h2>
        <div class="dashboard-stats">
            <div class="stat-card">
                <h3>Total Pelanggan</h3>
                <p class="stat-number">${totalPelanggan}</p>
                <span>Orang Aktif</span>
            </div>
            <div class="stat-card">
                <h3>Total Pendapatan</h3>
                <p class="stat-number">Rp ${totalPendapatan.toLocaleString('id-ID')}</p>
                <span>Bulan Maret 2026</span>
            </div>
            <div class="stat-card">
                <h3>Belum Bayar</h3>
                <p class="stat-number" style="color: #ff0000;">3</p>
                <span>Pelanggan</span>
            </div>
        </div>
    `;
}
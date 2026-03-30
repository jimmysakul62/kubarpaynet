// public/js/laporan.js
import { mockDataPelanggan, mockRiwayatPembayaran } from './pembayaran.js';

const daftarBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// State untuk tabel
let currentPage = 1;
let rowsPerPage = 5;
let filterTahun = '2026';

export function renderLaporanKeuangan() {
    const container = document.getElementById('mainContentArea');
    if (!container) return;

    container.innerHTML = `
        <h2 class="page-title" style="color: #FFC000; text-align: center; font-size: 32px; font-weight: bold; margin-bottom: 30px;">
            LAPORAN KEUANGAN
        </h2>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
                <select id="laporanLimit" class="table-limit" style="padding: 5px;">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
            
            <div>
                <select id="laporanTahun" class="table-limit" style="padding: 5px;">
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                </select>
            </div>
        </div>

        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr style="background-color: #8FAADC;"> <th width="5%">No</th>
                        <th width="15%">Bulan</th>
                        <th width="20%">Total Pelanggan</th>
                        <th width="20%">Total Bayar</th>
                        <th width="20%">Total Belum Bayar</th>
                        <th width="20%">Jumlah</th>
                    </tr>
                </thead>
                <tbody id="laporanTableBody"></tbody>
            </table>
        </div>

        <div class="table-pagination" style="display: flex; justify-content: flex-end; margin-top: 15px;">
            <div class="pagination-buttons" id="laporanPagination">
                </div>
        </div>
    `;

    // Pasang Event Listeners
    document.getElementById('laporanLimit').value = rowsPerPage;
    document.getElementById('laporanTahun').value = filterTahun;

    document.getElementById('laporanLimit').addEventListener('change', (e) => {
        rowsPerPage = parseInt(e.target.value);
        currentPage = 1; // Reset ke halaman pertama
        loadDataLaporan();
    });

    document.getElementById('laporanTahun').addEventListener('change', (e) => {
        filterTahun = e.target.value;
        currentPage = 1;
        loadDataLaporan();
    });

    // Load data pertama kali
    loadDataLaporan();
}

function loadDataLaporan() {
    const tbody = document.getElementById('laporanTableBody');
    const paginationContainer = document.getElementById('laporanPagination');
    
    // 1. Hitung Rekapitulasi per Bulan
    let rekapData = daftarBulan.map(bulan => {
        // Ambil pembayaran lunas di bulan & tahun ini
        const bayarBulanIni = mockRiwayatPembayaran.filter(p => 
            p.bulan === bulan && p.status === 'Lunas' && (p.tahun === filterTahun || !p.tahun) 
        );

        const totalPelanggan = mockDataPelanggan.length; // Anggap total pelanggan konstan/global
        const totalBayar = bayarBulanIni.length;
        const totalBelumBayar = totalPelanggan - totalBayar;
        const jumlahUang = bayarBulanIni.reduce((sum, p) => sum + p.jumlah, 0);

        return { bulan, totalPelanggan, totalBayar, totalBelumBayar, jumlah: jumlahUang };
    });

    // Hilangkan bulan yang tidak ada transaksi sama sekali jika Anda mau, 
    // Tapi untuk format laporan biasanya ditampilkan semua 12 bulan.

    // 2. Logika Pagination
    const totalData = rekapData.length;
    const totalPages = Math.ceil(totalData / rowsPerPage);
    const startIdx = (currentPage - 1) * rowsPerPage;
    const paginatedData = rekapData.slice(startIdx, startIdx + rowsPerPage);

    // 3. Render Isi Tabel
    tbody.innerHTML = paginatedData.map((data, index) => `
        <tr>
            <td style="text-align:center;">${startIdx + index + 1}</td>
            <td>${data.bulan}</td>
            <td style="text-align:center;">${data.totalPelanggan}</td>
            <td style="text-align:center;">${data.totalBayar}</td>
            <td style="text-align:center;">${data.totalBelumBayar}</td>
            <td style="text-align:right;">Rp ${data.jumlah.toLocaleString('id-ID')}</td>
        </tr>
    `).join('');

    if (paginatedData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Tidak ada data untuk tahun ${filterTahun}</td></tr>`;
    }

    // 4. Render Tombol Pagination
    let paginationHtml = `<button onclick="ubahHalamanLaporan(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button class="${i === currentPage ? 'active' : ''}" onclick="ubahHalamanLaporan(${i})">${i}</button>`;
    }
    paginationHtml += `<button onclick="ubahHalamanLaporan(${currentPage + 1})" ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}>Next</button>`;
    
    paginationContainer.innerHTML = paginationHtml;
}

// Jadikan fungsi global agar bisa dipanggil oleh tombol pagination HTML inline
window.ubahHalamanLaporan = function(newPage) {
    currentPage = newPage;
    loadDataLaporan(); // Render ulang setelah ganti halaman
};

// public/js/laporan.js

export function renderLaporan() {
    const container = document.getElementById('mainContentArea');
    if (!container) return;

    // 2. Cek siapa yang sedang buka menu ini
    const role = sessionStorage.getItem('userRole') || 'OPERATOR';

    // 3. Logika Filter Data
    let dataLaporan = mockRiwayatPembayaran;

    if (role !== 'OPERATOR') {
        // Jika yang login BUKAN Operator, saring datanya
        dataLaporan = mockRiwayatPembayaran.filter(bayar => {
            // Cari data pelanggan aslinya untuk mengecek alamat/kampungnya
            const pelanggan = mockDataPelanggan.find(p => p.id === bayar.idPelanggan || p.idPelanggan === bayar.idPelanggan);
            
            // Hanya masukkan ke laporan jika alamat pelanggan mengandung nama Role (cth: "AWAI")
            return pelanggan && pelanggan.alamat.toUpperCase().includes(role);
        });
    }

    // 4. Hitung Ringkasan
    const totalPendapatan = dataLaporan.reduce((sum, p) => sum + p.jumlah, 0);
    const totalTransaksi = dataLaporan.length;

    // 5. Tampilkan ke Layar
    container.innerHTML = `
        <h2 class="page-title">LAPORAN KEUANGAN ${role === 'OPERATOR' ? 'GLOBAL' : `KAMPUNG ${role}`}</h2>
        
        <div class="stats-grid" style="margin-bottom: 20px;">
            <div class="stat-card" style="border: 2px solid #00B050;">
                <div class="stat-header" style="background-color: #00B050; color: white;">TOTAL TRANSAKSI</div>
                <div class="stat-body" style="color: #00B050;">${totalTransaksi}</div>
            </div>
            <div class="stat-card" style="border: 2px solid #00B050;">
                <div class="stat-header" style="background-color: #00B050; color: white;">TOTAL PENDAPATAN</div>
                <div class="stat-body" style="color: #00B050;">Rp ${totalPendapatan.toLocaleString('id-ID')}</div>
            </div>
        </div>

        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr style="background-color: #00B050; color: white;">
                        <th>No</th>
                        <th>ID Pelanggan</th>
                        <th>Nama</th>
                        <th>Bulan</th>
                        <th>Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    ${dataLaporan.length > 0 ? dataLaporan.map((item, index) => `
                        <tr>
                            <td style="text-align:center;">${index + 1}</td>
                            <td>${item.idPelanggan}</td>
                            <td>${item.nama}</td>
                            <td style="text-align:center;">${item.bulan}</td>
                            <td style="text-align:right;">Rp ${item.jumlah.toLocaleString('id-ID')}</td>
                        </tr>
                    `).join('') : `<tr><td colspan="5" style="text-align:center; padding:20px;">Belum ada data transaksi</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
}
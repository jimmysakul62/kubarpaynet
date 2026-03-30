// ==========================================
// DATA SIMULASI (Database Sederhana)
// ==========================================
export const mockDataPelanggan = [
    { id: 'DMP6543020001', nama: 'RUDI', noHp: '0852xxxxxxxx', paket: 'PAKET B', harga: 300000, alamat: 'KAMPUNG TONDOH' },
    { id: 'DMP6543020002', nama: 'ARIF', noHp: '0852xxxxxxxx', paket: 'PAKET B', harga: 300000, alamat: 'KAMPUNG TONDOH' },
    { id: 'DMP6543020003', nama: 'WATI', noHp: '0852xxxxxxxx', paket: 'PAKET B', harga: 300000, alamat: 'KAMPUNG TONDOH' }
];

export let mockRiwayatPembayaran = [
    { idPelanggan: 'DMP6543020001', nama: 'RUDI', noHp: '0852xxxxxxxx', paket: 'PAKET B', jumlah: 300000, metode: 'TRANSFER', status: 'Lunas', bulan: 'Januari' },
    { idPelanggan: 'DMP6543020002', nama: 'ARIF', noHp: '0852xxxxxxxx', paket: 'PAKET B', jumlah: 300000, metode: 'TRANSFER', status: 'Lunas', bulan: 'Januari' }
];

const daftarBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// ==========================================
// VARIABEL STATE GLOBAL UNTUK TABEL PEMBAYARAN
// ==========================================
let currentPageBayar = 1;
let rowsPerPageBayar = 5;
let filterBulanBayar = 'Semua';
let currentKampungBayar = 'OPERATOR'; // <-- Ini obat anti errornya!

// ==========================================
// 1. RENDER DASHBOARD (DENGAN FILTER KAMPUNG)
// ==========================================
export function renderDashboard(filterLokasi = 'OPERATOR') {
    const container = document.getElementById('mainContentArea');
    if (!container) return;

    let dataPelanggan = mockDataPelanggan;
    let dataBayar = mockRiwayatPembayaran;

    if (filterLokasi !== 'OPERATOR') {
        dataPelanggan = mockDataPelanggan.filter(p => p.alamat && p.alamat.toUpperCase().includes(filterLokasi.toUpperCase()));
        dataBayar = mockRiwayatPembayaran.filter(p => {
            const pelanggan = mockDataPelanggan.find(pl => pl.id === p.idPelanggan || pl.idPelanggan === p.idPelanggan);
            return pelanggan && pelanggan.alamat.toUpperCase().includes(filterLokasi.toUpperCase());
        });
    }

    const totalPelanggan = dataPelanggan.length;
    const sudahBayar = dataBayar.length;
    const belumBayar = totalPelanggan - sudahBayar;
    const totalPendapatan = dataBayar.reduce((sum, p) => sum + p.jumlah, 0);

    container.innerHTML = `
        <div style="background-color: #e0e0e0; min-height: 100%; padding: 20px; font-family: Arial;">
            <h2 style="text-align: center; color: red; font-weight: bold; margin-bottom: 20px;">
                STATISTIK ${filterLokasi === 'OPERATOR' ? 'GLOBAL' : 'PELANGGAN ' + filterLokasi}
            </h2>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 800px; margin: 0 auto;">
                <div style="border: 1px solid #000;">
                    <div style="background: #FFC000; padding: 5px; text-align: center; font-weight: bold; border-bottom: 1px solid #000;">TOTAL PELANGGAN</div>
                    <div style="background: #FFF9E1; height: 100px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 60px; color: red; font-weight: bold;">${totalPelanggan}</span>
                    </div>
                </div>
                <div style="border: 1px solid #000;">
                    <div style="background: #FFC000; padding: 5px; text-align: center; font-weight: bold; border-bottom: 1px solid #000;">SUDAH BAYAR</div>
                    <div style="background: #FFF9E1; height: 100px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 60px; color: red; font-weight: bold;">${sudahBayar}</span>
                    </div>
                </div>
                <div style="border: 1px solid #000;">
                    <div style="background: #FFC000; padding: 5px; text-align: center; font-weight: bold; border-bottom: 1px solid #000;">TOTAL PENDAPATAN</div>
                    <div style="background: #FFF9E1; height: 100px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 40px; color: red; font-weight: bold;">Rp${totalPendapatan.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <div style="border: 1px solid #000;">
                    <div style="background: #FFC000; padding: 5px; text-align: center; font-weight: bold; border-bottom: 1px solid #000;">BELUM BAYAR</div>
                    <div style="background: #FFF9E1; height: 100px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 60px; color: red; font-weight: bold;">${belumBayar}</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center; font-size: 12px;">
                <p>Menampilkan data untuk: <strong>${filterLokasi}</strong></p>
            </div>
        </div>
    `;
}

// ==========================================
// 2. RENDER FORM BILLING
// ==========================================
export function renderBillingForm() {
    const container = document.getElementById('mainContentArea');
    if (!container) return;

    container.innerHTML = `
        <div class="form-wrapper">
            <div class="form-container">
                <h2 class="form-title">Proses Billing</h2>
                <div class="autocomplete" style="width:100%;">
                    <div class="input-search-group">
                        <input type="text" id="inputCariPelanggan" placeholder="Ketik Nama atau ID..." class="input-field input-search" autocomplete="off">
                        <button class="btn-cari" id="btnCariPelanggan">Cari</button>
                    </div>
                    <div id="autocomplete-list" class="autocomplete-items"></div>
                </div>
                <form id="billingForm" style="margin-top: 20px;">
                    <div class="form-group"><label>ID :</label><input type="text" id="billId" class="input-field" readonly required></div>
                    <div class="form-group"><label>Nama :</label><input type="text" id="billNama" class="input-field" readonly required></div>
                    <div class="form-group"><label>Paket :</label><input type="text" id="billPaket" class="input-field" readonly required></div>
                    <div class="form-group"><label>Harga :</label><span id="billHarga" style="font-weight:bold; font-size:18px;">Rp 0</span><input type="hidden" id="billNominal"></div>
                    <div class="form-group">
                        <label>Bulan :</label>
                        <select id="billBulan" class="input-field select-field" required>
                            <option value="">-- Pilih Bulan --</option>
                            ${daftarBulan.map(b => `<option value="${b}">${b}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Metode :</label>
                        <select id="billMetode" class="input-field select-field" required>
                            <option value="CASH">CASH</option>
                            <option value="TRANSFER">TRANSFER</option>
                            <option value="QRIS">QRIS</option>
                        </select>
                    </div>
                    <div class="form-actions"><button type="submit" class="btn-simpan">Konfirmasi Bayar</button></div>
                </form>
            </div>
        </div>
    `;
    setupAutocomplete();
    setupFormSubmission();
}

function setupAutocomplete() {
    const input = document.getElementById('inputCariPelanggan');
    const list = document.getElementById('autocomplete-list');
    if(!input) return;

    input.addEventListener('input', function() {
        list.innerHTML = '';
        const val = this.value.toLowerCase();
        if (!val) return;
        const matches = mockDataPelanggan.filter(p => p.nama.toLowerCase().includes(val) || (p.id || p.idPelanggan).toLowerCase().includes(val));
        matches.forEach(match => {
            const item = document.createElement('div');
            item.innerHTML = `<strong>${match.id || match.idPelanggan}</strong> - ${match.nama}`;
            item.onclick = () => {
                input.value = match.id || match.idPelanggan;
                list.innerHTML = '';
                document.getElementById('billId').value = match.id || match.idPelanggan;
                document.getElementById('billNama').value = match.nama;
                document.getElementById('billPaket').value = match.paket;
                document.getElementById('billNominal').value = match.harga;
                document.getElementById('billHarga').innerText = `Rp ${match.harga.toLocaleString('id-ID')}`;
            };
            list.appendChild(item);
        });
    });
}

function setupFormSubmission() {
    const form = document.getElementById('billingForm');
    if (!form) return;
    form.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('billId').value;
        const bulan = document.getElementById('billBulan').value;
        if (mockRiwayatPembayaran.some(p => p.idPelanggan === id && p.bulan === bulan)) {
            alert("Pelanggan ini sudah bayar untuk bulan tersebut!");
            return;
        }
        mockRiwayatPembayaran.push({
            idPelanggan: id,
            nama: document.getElementById('billNama').value,
            paket: document.getElementById('billPaket').value,
            jumlah: parseInt(document.getElementById('billNominal').value),
            metode: document.getElementById('billMetode').value,
            status: 'Lunas',
            bulan: bulan
        });
        alert("Pembayaran Berhasil!");
        form.reset();
        document.getElementById('billHarga').innerText = 'Rp 0';
    };
}

// ==========================================
// 3. RENDER TABEL DATA PEMBAYARAN
// ==========================================
export function renderDataPembayaranTable(filterLokasi = 'OPERATOR') {
    currentKampungBayar = filterLokasi;
    const container = document.getElementById('mainContentArea');
    if (!container) return;

    container.innerHTML = `
        <h2 class="page-title">RIWAYAT PEMBAYARAN ${currentKampungBayar !== 'OPERATOR' ? '- ' + currentKampungBayar : ''}</h2>
        
        <div class="table-actions" style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div>
                <label style="font-weight:bold;">Tampilkan: </label>
                <select id="payLimit" class="table-limit" style="padding: 5px;">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <span> data</span>
            </div>

            <div>
                <label style="font-weight:bold;">Filter Bulan: </label>
                <select id="payBulanFilter" class="table-limit" style="padding: 5px 15px;">
                    <option value="Semua">Semua Bulan</option>
                    ${daftarBulan.map(b => `<option value="${b}">${b}</option>`).join('')}
                </select>
            </div>
        </div>

        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr style="background-color:#00B050; color: white;">
                        <th>No</th>
                        <th>ID Pelanggan</th>
                        <th>Nama</th>
                        <th>Paket</th>
                        <th>Jumlah</th>
                        <th>Metode</th>
                        <th>Bulan</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="pembayaranTableBody"></tbody>
            </table>
        </div>

        <div class="table-pagination" style="display: flex; justify-content: flex-end; margin-top: 15px;">
            <div class="pagination-buttons" id="paginationBayar"></div>
        </div>
    `;

    document.getElementById('payLimit').value = rowsPerPageBayar;
    document.getElementById('payBulanFilter').value = filterBulanBayar;

    document.getElementById('payLimit').addEventListener('change', (e) => {
        rowsPerPageBayar = parseInt(e.target.value);
        currentPageBayar = 1; 
        loadTableDataBayar();
    });

    document.getElementById('payBulanFilter').addEventListener('change', (e) => {
        filterBulanBayar = e.target.value;
        currentPageBayar = 1; 
        loadTableDataBayar();
    });

    loadTableDataBayar();
}

function loadTableDataBayar() {
    const tbody = document.getElementById('pembayaranTableBody');
    const paginationContainer = document.getElementById('paginationBayar');
    if (!tbody) return;
    
    // --- 1. Logika Filter Kampung & Bulan ---
    let dataTerfilter = mockRiwayatPembayaran;
    
    if (currentKampungBayar !== 'OPERATOR') {
        const pelangganSesuai = mockDataPelanggan.filter(p => p.alamat && p.alamat.toUpperCase().includes(currentKampungBayar.toUpperCase()));
        const idSesuai = pelangganSesuai.map(p => p.id || p.idPelanggan);
        dataTerfilter = mockRiwayatPembayaran.filter(b => idSesuai.includes(b.idPelanggan));
    }

    if (filterBulanBayar !== 'Semua') {
        dataTerfilter = dataTerfilter.filter(p => p.bulan === filterBulanBayar);
    }
    
    // 2. Logika Pagination
    const totalData = dataTerfilter.length;
    const totalPages = Math.ceil(totalData / rowsPerPageBayar);
    const startIdx = (currentPageBayar - 1) * rowsPerPageBayar;
    const paginatedData = dataTerfilter.slice(startIdx, startIdx + rowsPerPageBayar);

    // 3. Render Baris Tabel
    if (paginatedData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 15px;">Tidak ada data pembayaran untuk kriteria ini.</td></tr>`;
    } else {
        tbody.innerHTML = paginatedData.map((p, i) => `
            <tr>
                <td style="text-align:center;">${startIdx + i + 1}</td>
                <td>${p.idPelanggan}</td>
                <td>${p.nama}</td>
                <td style="text-align:center;">${p.paket}</td>
                <td style="text-align:right;">Rp ${p.jumlah.toLocaleString('id-ID')}</td>
                <td style="text-align:center;">${p.metode}</td>
                <td style="text-align:center;">${p.bulan}</td>
                <td style="text-align:center; color:green; font-weight:bold;">${p.status}</td>
            </tr>
        `).join('');
    }

    // 4. Render Tombol Pagination
    let paginationHtml = `<button onclick="ubahHalamanBayar(${currentPageBayar - 1})" ${currentPageBayar === 1 ? 'disabled' : ''} style="margin-right:5px; cursor:pointer;">Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button class="${i === currentPageBayar ? 'active' : ''}" onclick="ubahHalamanBayar(${i})" style="margin-right:5px; cursor:pointer; ${i === currentPageBayar ? 'background:#FFC000; font-weight:bold;' : ''}">${i}</button>`;
    }
    paginationHtml += `<button onclick="ubahHalamanBayar(${currentPageBayar + 1})" ${currentPageBayar === totalPages || totalPages === 0 ? 'disabled' : ''} style="cursor:pointer;">Next</button>`;
    
    paginationContainer.innerHTML = paginationHtml;
}

window.ubahHalamanBayar = function(newPage) {
    currentPageBayar = newPage;
    loadTableDataBayar();
};
export function formatCurrency(amount) {
    return `Rp${amount}`;
}

export function updateClock() {
    const now = new Date();

    // 1. Format Jam (HH:mm:ss)
    const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const timeString = now.toLocaleTimeString('en-GB', optionsTime);
    
    // 2. Format Tanggal (HARI, DD BULAN YYYY)
    const optionsDate = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    const dateString = now.toLocaleDateString('id-ID', optionsDate).toUpperCase();

    // 3. Update ke Elemen HTML
    const timeElem = document.getElementById('timeDisplay');
    const dateElem = document.getElementById('dateDisplay');

    if (timeElem) timeElem.innerText = `${timeString} WITA`;
    if (dateElem) dateElem.innerText = dateString;
}

// public/js/utils.js

// Peta Kode Wilayah Kampung
const kodeWilayah = {
    'AWAI': { inisial: 'AWI', kode: '654301' },
    'DEMPAR': { inisial: 'DMP', kode: '654302' },
    'MUUT': { inisial: 'MUT', kode: '654303' },
    'LENDIAN': { inisial: 'LND', kode: '654304' },
    'MARIMUN': { inisial: 'MRM', kode: '654305' },
    'TONDOH': { inisial: 'TND', kode: '654306' },
    'MUARA JAWAQ': { inisial: 'MJW', kode: '654307' }
};

// Fungsi generate ID Pelanggan otomatis
export function generateIDPelanggan(namaKampung, noUrut) {
    const data = kodeWilayah[namaKampung.toUpperCase()];
    if (!data) return ''; // Kampung tidak ditemukan

    const formatNoUrut = String(noUrut).padStart(4, '0');
    return `${data.inisial}${data.kode}${formatNoUrut}`;
}

// Format mata uang Rupiah
export function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
}
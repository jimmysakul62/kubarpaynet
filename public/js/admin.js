// public/js/admin.js

export function renderFormGantiAdmin() {
    const container = document.getElementById('mainContentArea');
    if (!container) return;

    // Daftar role kampung yang tersedia
    const roles = ['OPERATOR', 'AWAI', 'DEMPAR', 'LENDIAN', 'MARIMUN', 'MUARA JAWAQ', 'MUUT', 'TONDOH'];

    container.innerHTML = `
        <div style="display: flex; justify-content: center; padding-top: 50px; height: 100%;">
            
            <div style="background-color: #C3D69B; padding: 40px; border: 1px solid #000; width: 350px; font-family: Arial, sans-serif; box-shadow: 4px 4px 0px rgba(0,0,0,0.1);">
                
                <h2 style="text-align: center; color: #FFC000; font-size: 24px; font-weight: bold; margin-top: 0; margin-bottom: 30px; letter-spacing: 1px;">
                    GANTI ADMIN
                </h2>
                
                <form id="formGantiAdmin" style="display: flex; flex-direction: column; gap: 15px;">
                    
                    <div style="display: flex; align-items: center;">
                        <div style="width: 100px; color: #000;">Role</div>
                        <div style="margin-right: 10px;">:</div>
                        <select id="adminRole" style="flex-grow: 1; padding: 6px; border: 1px solid #000; background: white;" required>
                            <option value="">-- Pilih Role --</option>
                            ${roles.map(r => `<option value="${r}">${r}</option>`).join('')}
                        </select>
                    </div>

                    <div style="display: flex; align-items: center;">
                        <div style="width: 100px; color: #000;">Username</div>
                        <div style="margin-right: 10px;">:</div>
                        <input type="text" id="adminUser" style="flex-grow: 1; padding: 6px; border: 1px solid #000;" required>
                    </div>

                    <div style="display: flex; align-items: center;">
                        <div style="width: 100px; color: #000;">Password</div>
                        <div style="margin-right: 10px;">:</div>
                        <input type="password" id="adminPass" style="flex-grow: 1; padding: 6px; border: 1px solid #000;" required>
                    </div>

                    <div style="text-align: center; margin-top: 20px;">
                        <button type="submit" style="background-color: #00B050; color: black; padding: 8px 30px; border: 1px solid #000; font-size: 16px; cursor: pointer;">
                            Simpan
                        </button>
                    </div>
                </form>

            </div>
        </div>
    `;

    // Aksi saat tombol Simpan diklik
    document.getElementById('formGantiAdmin').addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.getElementById('adminRole').value;
        const user = document.getElementById('adminUser').value;
        const pass = document.getElementById('adminPass').value;
        
        // Karena belum ada database, kita buatkan alert simulasi sukses
        alert(`BERHASIL!\n\nData login untuk role ${role} telah diubah.\nUsername: ${user}\nPassword: ${pass}`);
        e.target.reset(); // Kosongkan form setelah disimpan
    });
}
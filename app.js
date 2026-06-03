// ==========================================
// REGISTRASI SERVICE WORKER
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker terdaftar!', reg))
            .catch(err => console.log('Gagal daftar SW:', err));
    });  
}

// ==========================================
// LOGIKA FORM (TAMBAH & EDIT BARANG)
// ==========================================
const formBarang = document.getElementById('form-barang');

formBarang.addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const idBarang = document.getElementById('input-id').value;
    const namaBarang = document.getElementById('input-nama').value;
    const hargaBarang = document.getElementById('input-harga').value;

    const isEdit = idBarang !== "";
    
    // SOLUSI: Menggunakan 'POST' untuk Edit karena 'PUT' diblokir hosting
    const method = 'POST'; 
    
    const endpoint = isEdit 
        ? '../api-toko/edit_barang.php' 
        : '../api-toko/tambah_barang.php';

    const dataKirim = {
        nama_barang: namaBarang,
        harga: hargaBarang
    };

    if (isEdit) {
        dataKirim.id = idBarang;
    }

    try {
        const response = await fetch(endpoint, {
            method: method, 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(dataKirim) 
        });

        const hasil = await response.json();

        if (hasil.status === 'success') {
            formBarang.reset(); 
            
            if (isEdit) {
                document.getElementById('input-id').value = "";
                document.getElementById('text-title').innerText = 'Tambah Barang Baru';
                
                const btnSubmit = document.getElementById('btn-submit');
                btnSubmit.innerText = 'Simpan';
                btnSubmit.classList.replace('bg-blue-500', 'bg-amber-500');
                btnSubmit.classList.replace('hover:bg-blue-600', 'hover:bg-amber-600');
            }
            
            alert('Sukses: ' + hasil.pesan);
            ambilDataBarang(); 
        } else {
            alert('Gagal: ' + hasil.pesan);
        }

    } catch (error) {
        console.error('Terjadi kesalahan koneksi:', error);
        alert('Gagal menghubungi server API.');
    }
});

// ==========================================
// FUNGSIONALITAS TOMBOL EDIT & HAPUS
// ==========================================
function siapkanEdit(id, nama, harga) {
    document.getElementById('input-id').value = id;
    document.getElementById('input-nama').value = nama;
    document.getElementById('input-harga').value = harga;
    
    document.getElementById('text-title').innerText = 'Edit Barang #' + id;
    
    const btnSubmit = document.getElementById('btn-submit');
    btnSubmit.innerText = 'Update';
    btnSubmit.classList.replace('bg-amber-500', 'bg-blue-500');
    btnSubmit.classList.replace('hover:bg-blue-600', 'hover:bg-blue-600');
}

async function hapusBarang(id_target) {
    const yakin = confirm("Peringatan!\nApakah Anda yakin ingin menghapus barang dengan ID " + id_target + "?");
    
    if (yakin) {
        try {
            // SOLUSI: Menggunakan 'POST' untuk Hapus karena 'DELETE' diblokir hosting
            const response = await fetch('../api-toko/hapus_barang.php', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id_target }) 
            });

            const hasil = await response.json();

            if (hasil.status === 'success') {
                alert('Sukses: ' + hasil.pesan);
                ambilDataBarang(); 
            } else {
                alert('Gagal: ' + hasil.pesan);
            }

        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            alert('Gagal terhubung ke server untuk menghapus data.');
        }
    }
}

// ==========================================
// AMBIL DATA & RENDER TABEL (GET)
// ==========================================
async function ambilDataBarang() {
    const tabel = document.getElementById('tabel-barang');
    
    try {
        const response = await fetch('../api-toko/get-barang.php');
        const hasil = await response.json();
        
        if (hasil.status === 'success') {
            let barisHTML = '';
            
            hasil.data.forEach(barang => {
                const hargaFormatted = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(barang.harga);

                barisHTML += `
                    <tr class="hover:bg-emerald-50 transition-colors group">
                        <td class="px-6 py-4 text-slate-600 font-medium">#${barang.id}</td>
                        <td class="px-6 py-4 text-slate-800 font-semibold group-hover:text-emerald-700">${barang.nama_barang}</td>
                        <td class="px-6 py-4 text-right text-emerald-600 font-bold">${hargaFormatted}</td>
                        <td class="px-6 py-4 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <button onclick="siapkanEdit(${barang.id}, '${barang.nama_barang.replace(/'/g, "\\'")}', ${barang.harga})" class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded-lg font-medium transition-all active:scale-95 shadow-sm">
                                    Edit
                                </button>
                                <button onclick="hapusBarang(${barang.id})" class="bg-rose-500 hover:bg-rose-600 text-white text-xs px-3 py-2 rounded-lg font-medium transition-all active:scale-95 shadow-sm">
                                    Hapus
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            tabel.innerHTML = barisHTML;
        }
    } catch (error) {
        tabel.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-10 text-center text-red-500 bg-red-50">
                    ⚠️ Gagal memuat data. Server offline atau database bermasalah.
                </td>
            </tr>
        `;
        console.error('Error:', error);
    }
}

// Jalankan otomatis saat aplikasi pertama kali dimuat
ambilDataBarang();
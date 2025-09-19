// File: fetch.js
export let globalMahasiswaData = null;
export let currentKHSData = [];
export let currentKehadiranSummary = [];
export let currentJadwalUjian = { uts: [], uas: [] };
export let currentJadwalKuliah = [];
export let currentKurikulumData = [];
export let currentKMKData = [];
export let currentKRSData = { mata_kuliah_tersedia: [], krs_terisi: [] };
export let currentDaftarNilaiKumulatif = [];
export let currentPembayaranData = null;
export let currentPointBookData = null; 
export let currentPinjamanData = null; 
export let currentMagangHistory = null;
export let currentSemesterIndex = 0;

// Fungsi untuk mengambil data mahasiswa
export async function fetchDataAndPopulateForm() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;

    const url = `http://localhost/siakad_api/mahasiswa.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        globalMahasiswaData = apiResponse.data[0];
        return globalMahasiswaData;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data mahasiswa:', error);
        return null;
    }
}

// Fungsi untuk mengambil data IPS dan IPK
export async function fetchIpkIpsData() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;

    const url = `http://localhost/siakad_api/ipk_ips.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data IPS/IPK:', error);
        return null;
    }
}

// Fungsi untuk mengambil data mata kuliah
export async function fetchMataKuliahData() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;

    const url = `http://localhost/siakad_api/nilai.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        currentDaftarNilaiKumulatif = apiResponse.data;
        return currentDaftarNilaiKumulatif;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data mata kuliah:', error);
        return null;
    }
}

// Fungsi untuk mengambil data KHS
export async function fetchKHSData() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;

    const url = `http://localhost/siakad_api/khs.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success' && apiResponse.data.length > 0) {
            currentKHSData = apiResponse.data;
            return { data: currentKHSData, program_studi: apiResponse.program_studi, jenjang_studi: apiResponse.jenjang_studi };
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data KHS:', error);
        return null;
    }
}

// Fungsi untuk mengambil data jadwal ujian
export async function fetchJadwalUjian() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;

    const url = `http://localhost/siakad_api/jadwal_ujian.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success') {
            currentJadwalUjian.uts = apiResponse.uts;
            currentJadwalUjian.uas = apiResponse.uas;
            return currentJadwalUjian;
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data jadwal ujian:', error);
        return null;
    }
}

// Fungsi untuk mengambil data jadwal kuliah
export async function fetchJadwalKuliah() {
    await fetchDataAndPopulateForm();
    const nim = globalMahasiswaData?.nim;
    const semester = globalMahasiswaData?.semester_sekarang;
    if (!nim || !semester) return null;

    const url = `http://localhost/siakad_api/jadwal_kuliah.php?nim=${nim}&semester=${semester}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success' && apiResponse.data.length > 0) {
            currentJadwalKuliah = apiResponse.data;
            return currentJadwalKuliah;
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data jadwal kuliah:', error);
        return null;
    }
}

// Fungsi untuk mengambil data ringkasan kehadiran
export async function fetchKehadiranSummaryData() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;

    const url = `http://localhost/siakad_api/kehadiran.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success' && apiResponse.data.length > 0) {
            currentKehadiranSummary = apiResponse.data;
            return currentKehadiranSummary;
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data kehadiran:', error);
        return null;
    }
}

// Fungsi untuk mengambil data detail kehadiran
export async function showKehadiranDetail(kode_mk, mata_kuliah) {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;
    const url = `http://localhost/siakad_api/kehadiran_detail.php?nim=${nim}&kode_mk=${kode_mk}`;
    try {
        const response = await fetch(url);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success' && apiResponse.data.length > 0) {
            return apiResponse.data;
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data detail kehadiran:', error);
        return null;
    }
}

// Fungsi untuk mengambil data KRS
export async function fetchKRSData() {
    await fetchDataAndPopulateForm();
    const nim = globalMahasiswaData?.nim;
    const semester = globalMahasiswaData?.semester_sekarang;
    if (!nim || !semester) return null;

    const url = `http://localhost/siakad_api/krs.php?nim=${nim}&semester=${semester}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success' && apiResponse.mata_kuliah_tersedia.length > 0) {
            currentKRSData.mata_kuliah_tersedia = apiResponse.mata_kuliah_tersedia;
            currentKRSData.krs_terisi = apiResponse.krs_terisi;
            return currentKRSData;
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data KRS:', error);
        return null;
    }
}

// Fungsi untuk mengambil data kurikulum
export async function fetchKurikulumData() {
    const nim = localStorage.getItem('loggedInUserNim');
    await fetchDataAndPopulateForm();
    const semesterSekarang = globalMahasiswaData?.semester_sekarang;
    if (!nim) return null;

    const url = `http://localhost/siakad_api/kurikulum.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success' && apiResponse.data.length > 0) {
            currentKurikulumData = apiResponse.data;
            return { data: currentKurikulumData, semester: semesterSekarang };
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data kurikulum:', error);
        return null;
    }
}

// Fungsi untuk mengambil data kartu mata kuliah
export async function fetchAndRenderKartuMataKuliah() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;
    await fetchDataAndPopulateForm();
    const urlMatakuliah = `http://localhost/siakad_api/matakuliah.php?nim=${nim}`;
    try {
        const response = await fetch(urlMatakuliah);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success' && apiResponse.matakuliah && apiResponse.matakuliah.length > 0) {
            currentKMKData = apiResponse.matakuliah;
            return { data: currentKMKData, mahasiswa: globalMahasiswaData };
        }
        return null;
    } catch (error) {
        console.error('Gagal mengambil data mata kuliah:', error);
        return null;
    }
}

// Fungsi untuk menangani pengiriman KRS
export async function handleKRSSubmit(e) {
    e.preventDefault();
    const nim = globalMahasiswaData?.nim;
    const semester = globalMahasiswaData?.semester_sekarang;
    if (!nim || !semester) return;
    const formData = new FormData(e.target);
    const selectedCourses = formData.getAll('mata_kuliah[]');
    const postPromises = selectedCourses.map(kode_mk => {
        const postData = new FormData();
        postData.append('nim', nim);
        postData.append('semester', semester);
        postData.append('kode_mk', kode_mk);
        return fetch('http://localhost/siakad_api/krs.php', {
            method: 'POST',
            body: postData
        });
    });
    try {
        const responses = await Promise.all(postPromises);
        const allSuccess = responses.every(res => res.ok);
        if (allSuccess) {
            alert('KRS berhasil disimpan!');
        } else {
            alert('Gagal menyimpan KRS. Silakan coba lagi.');
        }
    } catch (error) {
        alert('Terjadi kesalahan saat menyimpan KRS.');
        console.error('Error saving KRS:', error);
    }
}

// Fungsi untuk mengambil data pembayaran
export async function fetchPembayaranData() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;

    const url = `http://localhost/siakad_api/pembayaran.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success') {
            currentPembayaranData = apiResponse;
            return currentPembayaranData;
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data pembayaran:', error);
        return null;
    }
}

// Fungsi untuk mengambil data histori Point Book
export async function fetchPointBookHistory() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;
    const url = `http://localhost/siakad_api/pointbook.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success') {
            currentPointBookData = apiResponse;
            return currentPointBookData;
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data point book:', error);
        return null;
    }
}

// Fungsi untuk mengambil data histori Pinjaman
export async function fetchPinjamanHistory() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;
    const url = `http://localhost/siakad_api/pinjaman.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success') {
            currentPinjamanData = apiResponse;
            return currentPinjamanData;
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data pinjaman:', error);
        return null;
    }
}

// Fungsi untuk mengambil data histori pengajuan magang
export async function fetchMagangHistory() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;
    const url = `http://localhost/siakad_api/pengajuan_magang.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        if (apiResponse.status === 'success') {
            currentMagangHistory = apiResponse.data;
            return currentMagangHistory;
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data histori magang:', error);
        return null;
    }
}

// Fungsi untuk menangani pengajuan magang
export async function handlePengajuanMagangSubmit(e) {
  e.preventDefault();
  const nim = localStorage.getItem('loggedInUserNim');
  const form = e.target;
  const formData = new FormData(form);
  formData.append('nim', nim);
  
  try {
    const response = await fetch('http://localhost/siakad_api/pengajuan_magang.php', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Gagal terhubung ke server.');
    }
    
    const apiResponse = await response.json();
    if (apiResponse.status === 'success') {
      alert(apiResponse.message);
      loadContent('/dashboard/Registrasi/pengajuan_magang.html'); // Muat ulang halaman setelah sukses
    } else {
      alert('Pengajuan gagal: ' + apiResponse.message);
    }
  } catch (error) {
    console.error('Error saat mengirim pengajuan:', error);
    alert('Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.');
  }
}

// Fungsi untuk mengambil data pengajuan judul skripsi
export async function fetchPengajuanJudulData() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;
    const url = `http://localhost/siakad_api/skripsi_judul.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data pengajuan judul skripsi:', error);
        return null;
    }
}

// Fungsi untuk menangani pengajuan judul skripsi
export async function handlePengajuanJudulSubmit(e) {
    e.preventDefault();
    const nim = localStorage.getItem('loggedInUserNim');
    const form = e.target;
    const formData = new FormData(form);
    formData.append('nim', nim);
    try {
        const response = await fetch('http://localhost/siakad_api/skripsi_judul.php', {
            method: 'POST',
            body: formData
        });
        const apiResponse = await response.json();
        if (apiResponse.status === 'success') {
            alert(apiResponse.message);
            loadContent('/dashboard/skripsi/pengajuan_judul.html');
        } else {
            alert('Pengajuan gagal: ' + apiResponse.message);
        }
    } catch (error) {
        console.error('Error saat mengirim pengajuan judul:', error);
        alert('Terjadi kesalahan saat mengirim pengajuan judul.');
    }
}

// Fungsi untuk mengambil data ujian skripsi
export async function fetchPengajuanUjianData() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;
    const url = `http://localhost/siakad_api/skripsi_ujian.php?nim=${nim}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apiResponse = await response.json();
        return apiResponse;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data ujian skripsi:', error);
        return null;
    }
}

// Fungsi untuk menangani pengajuan ujian skripsi
export async function handlePengajuanUjianSubmit(e) {
    e.preventDefault();
    const nim = localStorage.getItem('loggedInUserNim');
    const form = e.target;
    const formData = new FormData(form);
    formData.append('nim', nim);
    try {
        const response = await fetch('http://localhost/siakad_api/skripsi_ujian.php', {
            method: 'POST',
            body: formData
        });
        const apiResponse = await response.json();
        if (apiResponse.status === 'success') {
            alert(apiResponse.message);
        } else {
            alert('Pengajuan gagal: ' + apiResponse.message);
        }
    } catch (error) {
        console.error('Error saat mengirim pengajuan ujian:', error);
        alert('Terjadi kesalahan saat mengirim pengajuan ujian.');
    }
}

// Fungsi untuk mengambil data form pengajuan judul skripsi
export async function fetchSkripsiData() {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) return null;

    try {
        const mahasiswaData = await fetchDataAndPopulateForm();
        const ipkIpsData = await fetchIpkIpsData();
        const pointData = await fetchPointBookHistory();
        const nilaiData = await fetchMataKuliahData();
        
        // Logika untuk menghitung jumlah nilai D dan E serta mata kuliahnya
        const jumlahNilaiD = nilaiData ? nilaiData.filter(item => item.grade === 'D').length : 0;
        const mataKuliahD = nilaiData ? nilaiData.filter(item => item.grade === 'D').map(item => item.nama_mk).join(', ') : '';
        const jumlahNilaiE = nilaiData ? nilaiData.filter(item => item.grade === 'E').length : 0;
        const mataKuliahE = nilaiData ? nilaiData.filter(item => item.grade === 'E').map(item => item.nama_mk).join(', ') : '';
        
        return {
            status: 'success',
            data: {
                hp_terbaru: mahasiswaData?.handphone || '',
                semester_pengajuan: mahasiswaData?.semester_sekarang || '',
                ipk_terakhir: ipkIpsData?.ipk || '',
                jumlah_point: pointData?.total_poin || '',
                nilai_magang: 'A', // Asumsi nilai default
                sks_ditempuh: ipkIpsData?.ips_per_semester.reduce((sum, semester) => sum + parseInt(semester.total_sks), 0) || 0,
                jumlah_nilai_d: jumlahNilaiD,
                jumlah_nilai_e: jumlahNilaiE,
                mata_kuliah_d: mataKuliahD,
                mata_kuliah_e: mataKuliahE,
            }
        };
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data skripsi:', error);
        return null;
    }
}

// Fungsi baru untuk memperbarui data profil
export async function updateProfile(formData) {
    const nim = localStorage.getItem('loggedInUserNim');
    if (!nim) {
        alert('NIM tidak ditemukan. Silakan login kembali.');
        return;
    }

    formData.append('nim', nim);

    try {
        const response = await fetch('http://localhost/siakad_api/mahasiswa.php', {
            method: 'POST',
            body: formData
        });
        const apiResponse = await response.json();
        if (apiResponse.status === 'success') {
            alert(apiResponse.message);
            // Muat ulang data profil setelah sukses
            fetchDataAndPopulateForm();
        } else {
            alert('Gagal memperbarui profil: ' + apiResponse.message);
        }
    } catch (error) {
        console.error('Error saat mengirim data profil:', error);
        alert('Terjadi kesalahan saat mencoba memperbarui profil.');
    }
}
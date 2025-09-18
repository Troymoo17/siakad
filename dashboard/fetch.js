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
export let currentPembayaranData = null; // Diubah untuk menyimpan seluruh objek respons
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
        if (apiResponse.status === 'success' && apiResponse.data.length > 0) {
            currentKMKData = apiResponse.data;
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
            currentPembayaranData = apiResponse; // Menyimpan seluruh objek respons
            return currentPembayaranData;
        }
        return null;
    } catch (error) {
        console.error('Terjadi masalah saat mengambil data pembayaran:', error);
        return null;
    }
}
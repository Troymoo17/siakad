// File: core.js
import { 
  fetchDataAndPopulateForm, 
  fetchIpkIpsData, 
  fetchMataKuliahData, 
  fetchKHSData, 
  fetchJadwalUjian, 
  fetchJadwalKuliah, 
  fetchKehadiranSummaryData, 
  showKehadiranDetail, 
  fetchKRSData, 
  handleKRSSubmit, 
  fetchKurikulumData, 
  fetchAndRenderKartuMataKuliah,
  fetchPembayaranData,
  fetchPointBookHistory, 
  fetchPinjamanHistory,
  fetchMagangHistory, 
  handlePengajuanMagangSubmit,
  fetchPengajuanJudulData,
  handlePengajuanJudulSubmit,
  fetchPengajuanUjianData,
  handlePengajuanUjianSubmit,
  fetchSkripsiData,
  globalMahasiswaData,
  currentKHSData,
  currentKehadiranSummary,
  currentJadwalUjian,
  currentJadwalKuliah,
  currentKurikulumData,
  currentKMKData,
  currentKRSData,
  currentDaftarNilaiKumulatif,
  currentPembayaranData,
  currentPointBookData, 
  currentPinjamanData,
  currentMagangHistory,
  currentSemesterIndex,
  updateProfile // <-- Ditambahkan: Mengimpor fungsi updateProfile
} from './fetch.js';

import {
  renderProfileData,
  renderIpkIpsData,
  renderDaftarNilaiKumulatif,
  renderKHSData,
  renderJadwalUjian,
  renderJadwalKuliah,
  renderKehadiranSummary,
  renderKehadiranDetail,
  renderKRSData,
  renderKurikulumData,
  renderKMKData,
  renderJadwalHariIni,
  renderPembayaranData,
  renderPointBookData, 
  renderPinjamanData,
  renderMagangPage,
  renderPengajuanJudul,
  renderPengajuanUjianData,
  renderPengajuanJudulFormData
} from './loader.js';


function getNamaHari() {
    const d = new Date();
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return hari[d.getDay()];
}

async function loadContent(url) {
    const container = document.getElementById('main-content-container');
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.text();
        container.innerHTML = data;
        container.dataset.currentUrl = url;

        if (url.includes('mainpage.html')) {
            const mahasiswaData = await fetchDataAndPopulateForm();
            renderProfileData(mahasiswaData);
            const ipkIpsData = await fetchIpkIpsData();
            renderIpkIpsData(ipkIpsData);
            const jadwalData = await fetchJadwalKuliah();
            const hariIni = getNamaHari();
            const jadwalHariIni = jadwalData.filter(jadwal => jadwal.hari === hariIni);
            renderJadwalHariIni(jadwalHariIni, document.getElementById('jadwal-hari-ini-container'));
        } else if (url.includes('profile.html')) {
            const mahasiswaData = await fetchDataAndPopulateForm();
            renderProfileData(mahasiswaData);

            // Ditambahkan: Event listener untuk tombol simpan profil
            const saveProfileBtn = document.getElementById('saveProfileBtn');
            if (saveProfileBtn) {
                saveProfileBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    
                    const formData = new FormData();
                    formData.append('email', document.getElementById('input-email').value);
                    formData.append('telp', document.getElementById('input-telp').value);
                    formData.append('handphone', document.getElementById('input-hp').value);
                    formData.append('nik', document.getElementById('input-nik').value);
                    
                    await updateProfile(formData);
                });
            }

        } else if (url.includes('daftar_nilai_kumulatif.html')) {
            const nilaiData = await fetchMataKuliahData();
            renderDaftarNilaiKumulatif(nilaiData);
        } else if (url.includes('kartu_hasil_studi.html')) {
            const khsResult = await fetchKHSData();
            if (khsResult) {
                const semesterSelect = document.getElementById('semester-select');
                semesterSelect.innerHTML = '';
                khsResult.data.forEach((semester, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `Semester ${index + 1}`;
                    semesterSelect.appendChild(option);
                });
                renderKHSData(khsResult.data, 0, khsResult.program_studi, khsResult.jenjang_studi);
                let localSemesterIndex=0;
                semesterSelect.addEventListener('change', (e) => {
                    localSemesterIndex = e.target.value;
                    renderKHSData(khsResult.data, localSemesterIndex, khsResult.program_studi, khsResult.jenjang_studi);
                });
            }
        } else if (url.includes('jadwalUjian.html')) {
            const jadwalUjianData = await fetchJadwalUjian();
            renderJadwalUjian(jadwalUjianData);
        } else if (url.includes('jadwalKuliah.html')) {
            const jadwalData = await fetchJadwalKuliah();
            const mahasiswaData = await fetchDataAndPopulateForm();
            if (jadwalData) renderJadwalKuliah(jadwalData, mahasiswaData);
        } else if (url.includes('kehadiran.html')) {
            const kehadiranData = await fetchKehadiranSummaryData();
            if (kehadiranData) renderKehadiranSummary(kehadiranData);
        } else if (url.includes('krs.html')) {
            await fetchDataAndPopulateForm();
            const krsData = await fetchKRSData();
            if (krsData) {
                renderKRSData(krsData, globalMahasiswaData);
                document.getElementById('krsForm').addEventListener('submit', handleKRSSubmit);
            }
        } else if (url.includes('kurikulum.html')) {
            const kurikulumData = await fetchKurikulumData();
            if (kurikulumData) renderKurikulumData(kurikulumData.data, kurikulumData.semester);
        } else if (url.includes('kmk.html')) {
            const kmkData = await fetchAndRenderKartuMataKuliah();
            if (kmkData) renderKMKData(kmkData.data, kmkData.mahasiswa);
        } else if (url.includes('pembayaran.html')) {
            const pembayaranData = await fetchPembayaranData();
            if (pembayaranData) {
                 const semesterSelect = document.getElementById('semester-select');
                 semesterSelect.innerHTML = '';
                 pembayaranData.data.forEach((semester, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `Semester ${semester.semester}`;
                    semesterSelect.appendChild(option);
                });
                renderPembayaranData(pembayaranData, 0);
                semesterSelect.addEventListener('change', (e) => {
                    renderPembayaranData(pembayaranData, e.target.value);
                });
            }
        } else if (url.includes('pointbook.html')) {
            const pointBookData = await fetchPointBookHistory();
            if (pointBookData) {
                renderPointBookData(pointBookData);
            }
        } else if (url.includes('histori_pinjaman.html')) {
            const pinjamanData = await fetchPinjamanHistory();
            if (pinjamanData) {
                renderPinjamanData(pinjamanData);
            }
        } else if (url.includes('pengajuan_magang.html')) {
            const mahasiswaData = await fetchDataAndPopulateForm();
            const historiMagangData = await fetchMagangHistory();
            renderMagangPage(mahasiswaData, historiMagangData);
            const formPengajuan = document.getElementById('pengajuanMagangForm');
            if (formPengajuan) {
                formPengajuan.addEventListener('submit', handlePengajuanMagangSubmit);
            }
        } else if (url.includes('pengajuan_judul.html')) {
            const skripsiData = await fetchSkripsiData();
            if (skripsiData) {
                renderPengajuanJudulFormData(skripsiData.data);
            }
            const apiResponse = await fetchPengajuanJudulData();
            if (apiResponse) {
                renderPengajuanJudul(apiResponse);
            }
            const formPengajuan = document.getElementById('pengajuanJudulForm');
            if (formPengajuan) {
                formPengajuan.addEventListener('submit', handlePengajuanJudulSubmit);
            }
        } else if (url.includes('pengajuan_ujian.html')) {
            const apiResponse = await fetchPengajuanUjianData();
            const mahasiswaData = await fetchDataAndPopulateForm();
            if (apiResponse && mahasiswaData) {
                renderPengajuanUjianData(apiResponse, mahasiswaData);
            }
            const formPengajuan = document.getElementById('pengajuanUjianForm');
            if (formPengajuan) {
                formPengajuan.addEventListener('submit', handlePengajuanUjianSubmit);
            }
        }
    } catch (error) {
        console.error(`Error loading content from ${url}:`, error);
        container.innerHTML = `<p class="text-center text-red-500">Gagal memuat konten. Silakan coba lagi.</p>`;
    }
}

// Fungsi untuk menangani pemuatan halaman detail kehadiran
window.loadKehadiranDetailPage = async (kode_mk, mata_kuliah) => {
    const data = await showKehadiranDetail(kode_mk, mata_kuliah);
    if (data) {
        renderKehadiranDetail(data, mata_kuliah);
    } else {
        const container = document.getElementById('main-content-container');
        container.innerHTML = `<p class="text-center py-4 text-gray-500">Gagal memuat detail kehadiran.</p>`;
    }
};

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const toggleBtn = document.getElementById('toggleSidebar');

function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.remove('hidden');
}

function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
}

document.addEventListener("DOMContentLoaded", () => {
    loadContent('mainpage.html');
    const berandaLink = document.getElementById('beranda-link');
    berandaLink.classList.add('bg-blue-50', 'text-blue-900', 'font-semibold');
    berandaLink.classList.remove('text-gray-700', 'hover:bg-gray-100');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.dataset.content;
            loadContent(url);
            document.querySelectorAll('.nav-link').forEach(nav => {
                nav.classList.remove('bg-blue-50', 'text-blue-900', 'font-semibold');
                nav.classList.add('text-gray-700', 'hover:bg-gray-100');
            });
            link.classList.add('bg-blue-50', 'text-blue-900', 'font-semibold');
            link.classList.remove('text-gray-700', 'hover:bg-gray-100');
        });
    });

    document.querySelectorAll('.sidebar-dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const submenu = btn.nextElementSibling;
            const arrow = btn.querySelector('svg:last-child');
            submenu.classList.toggle('hidden');
            arrow.classList.toggle('rotate-90');
        });
    });

    toggleBtn?.addEventListener('click', openSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !sidebar.classList.contains('-translate-x-full')) {
            closeSidebar();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
        } else {
            if (!sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.add('-translate-x-full');
            }
        }
        const currentUrl = document.getElementById('main-content-container')?.dataset.currentUrl;
        if (currentUrl && currentUrl.includes('kartu_hasil_studi.html')) {
            renderKHSData(currentKHSData, currentSemesterIndex);
        } else if (currentUrl && currentUrl.includes('jadwalUjian.html')) {
            renderJadwalUjian(currentJadwalUjian);
        } else if (currentUrl && currentUrl.includes('jadwalKuliah.html')) {
            renderJadwalKuliah(currentJadwalKuliah, globalMahasiswaData);
        } else if (currentUrl && currentUrl.includes('kehadiran.html')) {
            renderKehadiranSummary(currentKehadiranSummary);
        } else if (currentUrl && currentUrl.includes('krs.html')) {
            renderKRSData(currentKRSData, globalMahasiswaData);
        } else if (currentUrl && currentUrl.includes('kurikulum.html')) {
            renderKurikulumData(currentKurikulumData, globalMahasiswaData?.semester_sekarang);
        } else if (currentUrl && currentUrl.includes('kmk.html')) {
            renderKMKData(currentKMKData, globalMahasiswaData);
        } else if (currentUrl && currentUrl.includes('daftar_nilai_kumulatif.html')) {
            renderDaftarNilaiKumulatif(currentDaftarNilaiKumulatif);
        } else if (currentUrl && currentUrl.includes('pembayaran.html')) {
            if (currentPembayaranData) {
                renderPembayaranData(currentPembayaranData, 0);
            }
        } else if (currentUrl && currentUrl.includes('pointbook.html')) {
            if (currentPointBookData) {
                renderPointBookData(currentPointBookData);
            }
        } else if (currentUrl && currentUrl.includes('histori_pinjaman.html')) {
            if (currentPinjamanData) {
                renderPinjamanData(currentPinjamanData);
            }
        } else if (currentUrl && currentUrl.includes('pengajuan_magang.html')) {
            if (globalMahasiswaData && currentMagangHistory) {
                renderMagangPage(globalMahasiswaData, currentMagangHistory);
            }
        }
    });

    document.querySelectorAll('#sidebar a:not(#sidebar > .space-y-2 > a)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeSidebar();
            }
        });
    });

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUserNim');
            alert('Anda telah berhasil keluar.');
            window.location.href = '/index.html';
        });
    }

});
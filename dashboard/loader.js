// File: loader.js

// Helper function untuk mengisi textContent pada elemen
function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value || 'Tidak tersedia';
}

// Helper function untuk mengisi value pada elemen input
function setValue(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.value = value || '';
}

export function renderProfileData(mahasiswa) {
    if (!mahasiswa) {
        setText('#profile-nama', 'Gagal memuat data');
        setText('#profile-nim', 'Gagal memuat data');
        return;
    }
    setText('#profile-nama', mahasiswa.nama);
    setText('#profile-nim', mahasiswa.nim);
    setText('#main-content-container #profile-nama-main', mahasiswa.nama);
    setText('#main-content-container #profile-nim-main', mahasiswa.nim);
    const imgElement = document.getElementById('profile-img');
    if (imgElement) imgElement.src = `/assets/${mahasiswa.nim}.jpg`;
    setValue('#input-nama-lengkap', mahasiswa.nama);
    setValue('#input-nim', mahasiswa.nim);
    setValue('#input-nik', mahasiswa.nik);
    setValue('#input-prodi', mahasiswa.prodi);
    setValue('#input-program', mahasiswa.program);
    setValue('#input-kelas', mahasiswa.kelas);
    setValue('#input-angkatan', mahasiswa.angkatan);
    setValue('#input-dosen-pa', mahasiswa.dosen_pa);
    setValue('#input-alamat', mahasiswa.alamat);
    setValue('#input-kota', mahasiswa.kota);
    setValue('#input-rtrw', mahasiswa.rtrw);
    setValue('#input-kodepos', mahasiswa.kodepos);
    setValue('#input-provinsi', mahasiswa.provinsi);
    setValue('#input-negara', mahasiswa.kewarganegaraan);
    setValue('#input-jenis-kelamin', mahasiswa.jenis_kelamin);
    setValue('#input-agama', mahasiswa.agama);
    setValue('#input-status', mahasiswa.status_pernikahan);
    setValue('#input-tempat-lahir', mahasiswa.tempat_lahir);
    setValue('#input-tanggal-lahir', mahasiswa.tanggal_lahir);
    setValue('#input-kewarganegaraan', mahasiswa.kewarganegaraan);
    setValue('#input-email', mahasiswa.email);
    setValue('#input-telp', mahasiswa.telp);
    setValue('#input-hp', mahasiswa.handphone);
}

export function renderIpkIpsData(data) {
    if (!data) {
        setText('#main-page-ipk-value', 'Error');
        setText('#main-page-sks', 'Error');
        setText('#main-page-semester', 'Error');
        setText('#main-page-tahun-akademik', 'Error');
        return;
    }
    const ipkValueElement = document.getElementById('main-page-ipk-value');
    const ipkDonutElement = document.getElementById('ipk-donut');
    if (ipkValueElement) ipkValueElement.textContent = data.ipk;
    if (ipkDonutElement) {
        const percentage = (parseFloat(data.ipk) / 4.00) * 100;
        ipkDonutElement.style.background = `conic-gradient(#0b66a5 0% ${percentage}%, #f0b341 ${percentage}% 100%)`;
    }
    const totalSks = data.ips_per_semester.reduce((sum, semester) => sum + semester.total_sks, 0);
    const sksElement = document.getElementById('main-page-sks');
    if(sksElement) sksElement.textContent = totalSks;
    const semesterElement = document.getElementById('main-page-semester');
    const tahunAkademikElement = document.getElementById('main-page-tahun-akademik');
    if (data.ips_per_semester.length > 0) {
        const lastSemester = data.ips_per_semester[data.ips_per_semester.length - 1];
        if(semesterElement) semesterElement.textContent = data.ips_per_semester.length;
        if(tahunAkademikElement) tahunAkademikElement.textContent = lastSemester.tahun_akademik;
    } else {
        if(semesterElement) semesterElement.textContent = '0';
        if(tahunAkademikElement) tahunAkademikElement.textContent = '-';
    }
}

export function renderDaftarNilaiKumulatif(data) {
    const listContainer = document.getElementById('mata-kuliah-list-container');
    if (!listContainer) return;
    let totalSks = 0;
    let totalBobotSks = 0;
    data.forEach(mk => {
        totalSks += parseInt(mk.sks);
        totalBobotSks += parseFloat(mk.bobot_sks);
    });
    const ipk = totalSks > 0 ? (totalBobotSks / totalSks).toFixed(2) : '0.00';
    const summaryContainer = document.getElementById('total-summary-mobile');
    if (window.innerWidth < 768) {
        listContainer.innerHTML = '';
        const cardContainer = document.createElement('div');
        cardContainer.className = 'p-4 space-y-4';
        data.forEach(mk => {
            const card = document.createElement('div');
            card.className = 'khs-card';
            card.innerHTML = `
                <div class="flex-grow">
                    <h3 class="font-bold text-lg">${mk.nama_mk}</h3>
                    <p class="text-sm text-gray-500">${mk.kode_mk}</p>
                </div>
                <div class="flex flex-col items-end space-y-1">
                     <div class="grade-badge grade-${mk.grade.toUpperCase()}">${mk.grade}</div>
                     <p class="text-xs text-gray-500">SKS: ${mk.sks}</p>
                </div>
            `;
            cardContainer.appendChild(card);
        });
        listContainer.appendChild(cardContainer);
        if(summaryContainer) {
            summaryContainer.querySelector('#total-sks-value').textContent = totalSks;
            summaryContainer.querySelector('#total-bobot-sks-value').textContent = totalBobotSks.toFixed(2);
            summaryContainer.querySelector('#ipk-value').textContent = ipk;
            summaryContainer.classList.remove('hidden');
        }
    } else {
        listContainer.innerHTML = '';
        const tableRows = data.map(mk => `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="py-3 px-6 whitespace-nowrap">${mk.kode_mk}</td>
                <td class="py-3 px-6">${mk.nama_mk}</td>
                <td class="py-3 px-6 text-center">${mk.grade}</td>
                <td class="py-3 px-6 text-center">${mk.bobot}</td>
                <td class="py-3 px-6 text-center">${mk.sks}</td>
                <td class="py-3 px-6 text-center">${mk.bobot_sks}</td>
            </tr>
        `).join('');
        const tableHtml = `
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-500">
                    <thead class="text-xs text-white uppercase bg-blue-600 rounded-t-lg">
                        <tr>
                            <th scope="col" class="py-3 px-6 rounded-tl-lg">Kode Mata Kuliah</th>
                            <th scope="col" class="py-3 px-6">Mata Kuliah</th>
                            <th scope="col" class="py-3 px-6 text-center">Grade</th>
                            <th scope="col" class="py-3 px-6 text-center">Bobot</th>
                            <th scope="col" class="py-3 px-6 text-center">SKS</th>
                            <th scope="col" class="py-3 px-6 text-center rounded-tr-lg">Bobot x SKS</th>
                        </tr>
                    </thead>
                    <tbody id="mata-kuliah-table-body">
                        ${tableRows}
                    </tbody>
                    <tfoot class="text-xs text-white uppercase bg-blue-600">
                        <tr class="font-bold">
                            <td colspan="4" class="py-3 px-6 text-right">JUMLAH</td>
                            <td class="py-3 px-6 text-center">${totalSks}</td>
                            <td class="py-3 px-6 text-center">${Math.round(totalBobotSks)}</td>
                        </tr>
                        <tr class="font-bold">
                            <td colspan="5" class="py-3 px-6 text-right">IPK TOTAL</td>
                            <td class="py-3 px-6 text-center">${ipk}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
        listContainer.innerHTML = tableHtml;
        if(summaryContainer) summaryContainer.classList.add('hidden');
    }
}

export function renderKHSData(data, semesterIndex, programStudi, jenjangStudi) {
    if (!data || !data[semesterIndex]) {
        console.warn("Data KHS untuk semester ini tidak ditemukan.");
        const container = document.getElementById('semester-card-container');
        if(container) container.innerHTML = '<p class="text-center text-red-500">Tidak ada data KHS yang ditemukan.</p>';
        return;
    }
    const semester = data[semesterIndex];
    const container = document.getElementById('semester-card-container');
    if (!container) return;
    
    document.getElementById('program-studi-khs').textContent = programStudi || 'Tidak tersedia';
    document.getElementById('jenjang-studi-khs').textContent = jenjangStudi || 'Tidak tersedia';
    document.getElementById('ip-semester-value').textContent = semester.ips;
    container.innerHTML = '';
    
    if (window.innerWidth < 768) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'khs-card-container';
        semester.mata_kuliah.forEach(mk => {
            const card = document.createElement('div');
            card.className = 'khs-card';
            card.innerHTML = `
                <div>
                    <h3 class="font-bold text-lg text-gray-800">${mk.nama_mk}</h3>
                    <p class="text-sm text-gray-500">${mk.sks} SKS</p>
                </div>
                <div class="grade-badge grade-${mk.grade.toUpperCase()}">${mk.grade}</div>
            `;
            cardContainer.appendChild(card);
        });
        container.appendChild(cardContainer);
    } else {
        let tableRows = '';
        semester.mata_kuliah.forEach(mk => {
            tableRows += `
                <tr class="bg-white border-b hover:bg-gray-50">
                    <td class="py-3 px-4 rounded-tl-lg whitespace-nowrap">${mk.kode_mk}</td>
                    <td class="py-3 px-4">${mk.nama_mk}</td>
                    <td class="py-3 px-4 text-center font-semibold">${mk.grade}</td>
                    <td class="py-3 px-4 text-center">${mk.bobot}</td>
                    <td class="py-3 px-4 text-center">${mk.sks}</td>
                    <td class="py-3 px-4 text-center rounded-tr-lg">${mk.bobot_sks}</td>
                </tr>
            `;
        });
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'bg-gray-50 p-6 rounded-lg shadow-inner';
        semesterDiv.innerHTML = `
            <div class="overflow-x-auto mb-4">
                <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-white uppercase bg-blue-600 rounded-t-lg">
                        <tr>
                            <th scope="col" class="py-3 px-4 rounded-tl-lg whitespace-nowrap">Kode MK</th>
                            <th scope="col" class="py-3 px-4">Mata Kuliah</th>
                            <th scope="col" class="py-3 px-4 text-center">Grade</th>
                            <th scope="col" class="py-3 px-4 text-center">Bobot</th>
                            <th scope="col" class="py-3 px-4 text-center">SKS</th>
                            <th scope="col" class="py-3 px-4 text-center rounded-tr-lg">Bobot x SKS</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
            <div class="flex justify-end text-sm">
                <div class="text-right">
                    <p class="font-bold">JUMLAH: ${semester.total_sks}</p>
                    <p class="font-bold">IP SEMESTER: ${semester.ips}</p>
                </div>
            </div>
        `;
        container.appendChild(semesterDiv);
    }
}

export function renderJadwalUjian(data) {
    const utsContainer = document.getElementById('uts-container');
    const uasContainer = document.getElementById('uas-container');
    if (!utsContainer || !uasContainer) return;

    utsContainer.innerHTML = `<h2 class="text-lg md:text-xl font-semibold mb-4 border-b pb-2">Ujian Tengah Semester (UTS)</h2>`;
    uasContainer.innerHTML = `<h2 class="text-lg md:text-xl font-semibold mb-4 border-b pb-2">Ujian Akhir Semester (UAS)</h2>`;

    if (window.innerWidth < 768) {
        renderJadwalUjianCards(data.uts, utsContainer);
        renderJadwalUjianCards(data.uas, uasContainer);
    } else {
        renderJadwalUjianTable(data.uts, utsContainer);
        renderJadwalUjianTable(data.uas, uasContainer);
    }
}

export function renderJadwalUjianCards(jadwalData, container) {
    if (jadwalData.length === 0) {
        container.innerHTML += '<div class="text-center py-4 text-gray-500">Tidak ada jadwal yang ditemukan.</div>';
        return;
    }
    const cardContainer = document.createElement('div');
    cardContainer.className = 'khs-card-container';
    jadwalData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'khs-card flex-col items-start space-y-2';
        card.innerHTML = `
            <h3 class="font-bold text-lg text-gray-800">${item.mata_kuliah}</h3>
            <p class="text-sm text-gray-500">Tanggal: ${item.tanggal} (${item.hari})</p>
            <p class="text-sm text-gray-500">Waktu: ${item.mulai.substring(0, 5)} - ${item.selesai.substring(0, 5)}</p>
            <p class="text-sm text-gray-500">Ruangan: ${item.ruangan}</p>
            <p class="text-sm text-gray-500">Dosen: ${item.dosen}</p>
            <p class="text-sm text-gray-500">No. Kursi: ${item.no_kursi}</p>
        `;
        cardContainer.appendChild(card);
    });
    container.appendChild(cardContainer);
}

export function renderJadwalUjianTable(jadwalData, container) {
     if (jadwalData.length === 0) {
        container.innerHTML += '<div class="text-center py-4 text-gray-500">Tidak ada jadwal yang ditemukan.</div>';
        return;
    }
    let tableRows = '';
    jadwalData.forEach(item => {
        tableRows += `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="py-3 px-4 whitespace-nowrap">${item.tanggal}</td>
                <td class="py-3 px-4">${item.hari}</td>
                <td class="py-3 px-4">${item.mulai.substring(0, 5)}</td>
                <td class="py-3 px-4">${item.selesai.substring(0, 5)}</td>
                <td class="py-3 px-4">${item.ruangan}</td>
                <td class="py-3 px-4">${item.mata_kuliah}</td>
                <td class="py-3 px-4">${item.kelas}</td>
                <td class="py-3 px-4">${item.dosen}</td>
                <td class="py-3 px-4">${item.no_kursi}</td>
                <td class="py-3 px-4">${item.soal}</td>
            </tr>
        `;
    });
    const tableHtml = `
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
                <thead class="text-xs text-white uppercase bg-blue-600">
                    <tr>
                        <th scope="col" class="py-3 px-4 rounded-tl-lg whitespace-nowrap">Tanggal</th>
                        <th scope="col" class="py-3 px-4 whitespace-nowrap">Hari</th>
                        <th scope="col" class="py-3 px-4 whitespace-nowrap">Mulai</th>
                        <th scope="col" class="py-3 px-4 whitespace-nowrap">Selesai</th>
                        <th scope="col" class="py-3 px-4 whitespace-nowrap">Ruangan</th>
                        <th scope="col" class="py-3 px-4 whitespace-nowrap">Mata Kuliah</th>
                        <th scope="col" class="py-3 px-4 whitespace-nowrap">Kelas</th>
                        <th scope="col" class="py-3 px-4 whitespace-nowrap">Dosen</th>
                        <th scope="col" class="py-3 px-4 whitespace-nowrap">No. Kursi</th>
                        <th scope="col" class="py-3 px-4 rounded-tr-lg whitespace-nowrap">Soal</th>
                    </tr>
                </thead>
                <tbody id="uts-table-body">
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML += tableHtml;
}

export function renderJadwalKuliah(data, mahasiswaData) {
    const container = document.getElementById('jadwal-kuliah-content-container');
    if (!container) return;
    container.innerHTML = '';
    
    setText('#program-studi-meta', mahasiswaData?.prodi);
    setText('#jenjang-studi-meta', mahasiswaData?.jenjang_studi);
    setText('#jadwal-kuliah-meta', `Tahun: ${mahasiswaData?.tahun_masuk}/${parseInt(mahasiswaData?.tahun_masuk) + 1} - Semester: Gasal`);

    if (window.innerWidth < 768) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'khs-card-container';
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'khs-card flex-col items-start space-y-2';
            card.innerHTML = `
                <h3 class="font-bold text-base text-gray-800">${item.matkul}</h3>
                <p class="text-xs text-gray-500">Kode: ${item.kode_matkul}</p>
                <p class="text-xs text-gray-500">Hari: ${item.hari}</p>
                <p class="text-xs text-gray-500">Waktu: ${item.jam_mulai.substring(0, 5)} - ${item.jam_selesai.substring(0, 5)}</p>
                <p class="text-xs text-gray-500">Ruangan: ${item.ruang}</p>
                <p class="text-xs text-gray-500">Dosen: ${item.dosen}</p>
            `;
            cardContainer.appendChild(card);
        });
        container.appendChild(cardContainer);
    } else {
        let tableRows = '';
        data.forEach(item => {
            tableRows += `
                <tr class="bg-white border-b hover:bg-gray-50">
                    <td class="py-3 px-4 whitespace-nowrap">${item.hari}</td>
                    <td class="py-3 px-4">${item.jam_mulai.substring(0, 5)}</td>
                    <td class="py-3 px-4">${item.jam_selesai.substring(0, 5)}</td>
                    <td class="py-3 px-4">${item.ruang}</td>
                    <td class="py-3 px-4">${item.kode_matkul}</td>
                    <td class="py-3 px-4">${item.matkul}</td>
                    <td class="py-3 px-4">${item.dosen}</td>
                    <td class="py-3 px-4">${item.jenis}</td>
                    <td class="py-3 px-4">${item.kelas}</td>
                    <td class="py-3 px-4">${item.goggle_classroom_id}</td>
                </tr>
            `;
        });
        const tableHtml = `
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-700">
                    <thead class="text-xs text-white uppercase bg-blue-600">
                        <tr>
                            <th scope="col" class="py-3 px-4 rounded-tl-lg whitespace-nowrap">Hari</th>
                            <th scope="col" class="py-3 px-4 whitespace-nowrap">Jam Mulai</th>
                            <th scope="col" class="py-3 px-4 whitespace-nowrap">Jam Selesai</th>
                            <th scope="col" class="py-3 px-4 whitespace-nowrap">Ruang</th>
                            <th scope="col" class="py-3 px-4 whitespace-nowrap">Kode Matkul</th>
                            <th scope="col" class="py-3 px-4 whitespace-nowrap">Matkul</th>
                            <th scope="col" class="py-3 px-4 whitespace-nowrap">Dosen</th>
                            <th scope="col" class="py-3 px-4 whitespace-nowrap">Jenis</th>
                            <th scope="col" class="py-3 px-4 whitespace-nowrap">Kelas</th>
                            <th scope="col" class="py-3 px-4 rounded-tr-lg whitespace-nowrap">Goggle Classroom ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
        container.innerHTML = tableHtml;
    }
}

export function renderKehadiranSummary(data) {
    const container = document.getElementById('kehadiran-content-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="p-4 md:p-6 border-b border-gray-200">
            <h2 class="font-bold text-lg">Rekapitulasi Kehadiran Mata Kuliah</h2>
            <p class="text-sm text-gray-500 mt-1">Rekapitulasi total kehadiran berdasarkan status.</p>
        </div>
    `;

    if (window.innerWidth < 768) {
         const cardContainer = document.createElement('div');
         cardContainer.className = 'p-4 space-y-4';
         data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'khs-card flex-col items-start space-y-2';
            card.innerHTML = `
                <h3 class="font-bold text-lg text-gray-800">${item.mata_kuliah}</h3>
                <div class="w-full flex justify-between space-x-2 text-xs text-gray-500">
                    <div class="flex-1 p-2 bg-gray-100 rounded-lg text-center">Hadir: <span class="font-semibold text-green-600">${item.hadir}</span></div>
                    <div class="flex-1 p-2 bg-gray-100 rounded-lg text-center">Izin: <span class="font-semibold text-yellow-600">${item.izin}</span></div>
                    <div class="flex-1 p-2 bg-gray-100 rounded-lg text-center">Sakit: <span class="font-semibold text-red-600">${item.sakit}</span></div>
                </div>
                <button onclick="loadKehadiranDetailPage('${item.kode_mk}', '${item.mata_kuliah}')" class="w-full text-blue-600 hover:underline text-sm mt-2">Detail</button>
            `;
            cardContainer.appendChild(card);
         });
         container.appendChild(cardContainer);
    } else {
        let tableRows = '';
        data.forEach(item => {
            tableRows += `
                <tr class="bg-white border-b hover:bg-gray-50">
                    <td class="py-3 px-6">${item.mata_kuliah}</td>
                    <td class="py-3 px-6 text-center font-semibold text-green-600">${item.hadir}</td>
                    <td class="py-3 px-6 text-center font-semibold text-yellow-600">${item.izin}</td>
                    <td class="py-3 px-6 text-center font-semibold text-red-600">${item.sakit}</td>
                    <td class="py-3 px-6 text-center">
                        <button onclick="loadKehadiranDetailPage('${item.kode_mk}', '${item.mata_kuliah}')" class="text-blue-600 hover:underline">Detail</button>
                    </td>
                </tr>
            `;
        });
        const tableHtml = `
             <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-500">
                    <thead class="text-xs text-white uppercase bg-blue-600 rounded-t-lg">
                        <tr>
                            <th scope="col" class="py-3 px-6 rounded-tl-lg">Mata Kuliah</th>
                            <th scope="col" class="py-3 px-6 text-center">Total Hadir</th>
                            <th scope="col" class="py-3 px-6 text-center">Total Izin</th>
                            <th scope="col" class="py-3 px-6 text-center">Total Sakit</th>
                            <th scope="col" class="py-3 px-6 rounded-tr-lg text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="kehadiran-table-body">
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
        container.innerHTML += tableHtml;
    }
}

export function renderKehadiranDetail(data, mataKuliahName) {
    const container = document.getElementById('main-content-container');
    fetch('/dashboard/Perkuliahan/detailKehadiran.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            document.getElementById('detail-mk-name').textContent = `Mata Kuliah: ${mataKuliahName}`;
            const detailContainer = document.getElementById('detail-kehadiran-content-container');
            if (!detailContainer) return;
            detailContainer.innerHTML = '';
            
            if (window.innerWidth < 768) {
                const cardContainer = document.createElement('div');
                cardContainer.className = 'p-4 space-y-4';
                data.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'khs-card flex-col items-start space-y-2';
                    card.innerHTML = `
                        <h3 class="font-bold text-base text-gray-800">Pertemuan ${item.pertemuan}</h3>
                        <p class="text-xs text-gray-500">Tanggal: ${item.tanggal}</p>
                        <p class="text-xs text-gray-500">Dosen: ${item.dosen}</p>
                        <div class="w-full text-center p-2 rounded-md font-semibold text-white mt-2 status-${item.status}">${item.status}</div>
                    `;
                    cardContainer.appendChild(card);
                });
                detailContainer.appendChild(cardContainer);
            } else {
                let tableRows = '';
                data.forEach(item => {
                    tableRows += `
                        <tr class="bg-white border-b hover:bg-gray-50">
                            <td class="py-3 px-6 whitespace-nowrap">${item.pertemuan}</td>
                            <td class="py-3 px-6 whitespace-nowrap">${item.tanggal}</td>
                            <td class="py-3 px-6">${item.dosen}</td>
                            <td class="py-3 px-6 text-center">${item.status}</td>
                        </tr>
                    `;
                });
                const tableHtml = `
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-500">
                            <thead class="text-xs text-white uppercase bg-blue-600 rounded-t-lg">
                                <tr>
                                    <th scope="col" class="py-3 px-6 rounded-tl-lg">Pertemuan</th>
                                    <th scope="col" class="py-3 px-6">Tanggal</th>
                                    <th scope="col" class="py-3 px-6">Dosen</th>
                                    <th scope="col" class="py-3 px-6 rounded-tr-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody id="kehadiran-detail-table-body">
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                `;
                detailContainer.innerHTML = tableHtml;
            }
        });
}

export function renderKRSData(data, mahasiswaData) {
    const container = document.getElementById('krs-content-container');
    if (!container) return;
    container.innerHTML = '';

    if (window.innerWidth < 768) {
         const form = document.createElement('form');
         form.id = 'krsForm';
         const infoDiv = document.createElement('div');
         infoDiv.className = 'p-4 border-b border-gray-200';
         infoDiv.innerHTML = `<h2 class="font-bold text-lg">Pilih Mata Kuliah</h2><p class="text-sm text-gray-500 mt-1">Semester: <span id="krs-semester">${mahasiswaData?.semester_sekarang || 'Memuat...'}</span></p>`;
         form.appendChild(infoDiv);
         const cardContainer = document.createElement('div');
         cardContainer.className = 'p-4 space-y-4';
         data.mata_kuliah_tersedia.forEach(mk => {
            const isChecked = data.krs_terisi.includes(mk.kode_mk) ? 'checked' : '';
            const card = document.createElement('label');
            card.className = 'khs-card flex-col items-start space-y-2 cursor-pointer';
            card.innerHTML = `
                <div class="flex items-center space-x-4 w-full">
                    <input type="checkbox" name="mata_kuliah[]" value="${mk.kode_mk}" ${isChecked} class="form-checkbox h-5 w-5 text-blue-600 rounded">
                    <h3 class="font-bold text-base text-gray-800">${mk.nama_mk}</h3>
                </div>
                <div class="text-xs text-gray-500 w-full">Kode: ${mk.kode_mk} | SKS: ${mk.sks} | Semester: ${mahasiswaData?.semester_sekarang}</div>
            `;
            cardContainer.appendChild(card);
        });
        form.appendChild(cardContainer);
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'p-4 md:p-6 border-t border-gray-200 flex justify-end';
        buttonDiv.innerHTML = `<button type="submit" class="bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition">Simpan KRS</button>`;
        form.appendChild(buttonDiv);
        container.appendChild(form);
    } else {
        const form = document.createElement('form');
        form.id = 'krsForm';
        const infoDiv = document.createElement('div');
        infoDiv.className = 'p-4 md:p-6 border-b border-gray-200';
        infoDiv.innerHTML = `<h2 class="font-bold text-lg">Pilih Mata Kuliah</h2><p id="krs-info" class="text-sm text-gray-500 mt-1">Semester: <span id="krs-semester">${mahasiswaData?.semester_sekarang || 'Memuat...'}</span></p>`;
        form.appendChild(infoDiv);
        const tableDiv = document.createElement('div');
        tableDiv.className = 'overflow-x-auto';
        let tableRows = '';
        data.mata_kuliah_tersedia.forEach(mk => {
            const isChecked = data.krs_terisi.includes(mk.kode_mk) ? 'checked' : '';
            tableRows += `
                <tr>
                    <td class="py-3 px-6 text-center">
                        <input type="checkbox" name="mata_kuliah[]" value="${mk.kode_mk}" ${isChecked}>
                    </td>
                    <td class="py-3 px-6">${mk.kode_mk}</td>
                    <td class="py-3 px-6">${mk.nama_mk}</td>
                    <td class="py-3 px-6 text-center">${mk.sks}</td>
                    <td class="py-3 px-6 text-center">${mahasiswaData?.semester_sekarang}</td>
                </tr>
            `;
        });
        tableDiv.innerHTML = `
            <table class="w-full text-left text-sm text-gray-500">
                <thead class="text-xs text-white uppercase bg-blue-600 rounded-t-lg">
                    <tr>
                        <th scope="col" class="py-3 px-6 rounded-tl-lg">Pilih</th>
                        <th scope="col" class="py-3 px-6">Kode Mata Kuliah</th>
                        <th scope="col" class="py-3 px-6">Mata Kuliah</th>
                        <th scope="col" class="py-3 px-6 text-center">SKS</th>
                        <th scope="col" class="py-3 px-6 rounded-tr-lg text-center">Semester</th>
                    </tr>
                </thead>
                <tbody id="krs-table-body">
                    ${tableRows}
                </tbody>
            </table>
        `;
        form.appendChild(tableDiv);
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'p-4 md:p-6 border-t border-gray-200 flex justify-end';
        buttonDiv.innerHTML = `<button type="submit" class="bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition">Simpan KRS</button>`;
        form.appendChild(buttonDiv);
        container.appendChild(form);
    }
}

export function renderKurikulumData(data, semesterSekarang) {
    const container = document.getElementById('kurikulum-content-container');
    if (!container) return;
    container.innerHTML = '';
    const semesterText = semesterSekarang ? `Semester ${semesterSekarang}` : `semester saat ini`;
    const infoDiv = document.createElement('div');
    infoDiv.className = 'p-4 md:p-6 border-b border-gray-200';
    infoDiv.innerHTML = `<h2 class="font-bold text-lg">Daftar Kurikulum</h2><p id="semester-info" class="text-sm text-gray-500 mt-1">Menampilkan mata kuliah kurikulum yang tersedia untuk ${semesterText}.</p>`;
    container.appendChild(infoDiv);
    
    if (window.innerWidth < 768) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'p-4 space-y-4';
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'khs-card flex-col items-start space-y-2';
            card.innerHTML = `
                <h3 class="font-bold text-lg text-gray-800">${item.nama_mk}</h3>
                <p class="text-xs text-gray-500">Kode: ${item.kode_mk}</p>
                <p class="text-xs text-gray-500">SKS: ${item.sks}</p>
                <p class="text-xs text-gray-500">Grade Min: ${item.grade_min}</p>
            `;
            cardContainer.appendChild(card);
        });
        container.appendChild(cardContainer);
    } else {
        let tableRows = '';
        data.forEach(item => {
            tableRows += `
                <tr class="bg-white border-b hover:bg-gray-50">
                    <td class="py-3 px-6 whitespace-nowrap">${item.kode_mk}</td>
                    <td class="py-3 px-6">${item.nama_mk}</td>
                    <td class="py-3 px-6 text-center">${item.sks}</td>
                    <td class="py-3 px-6 text-center">${item.grade_min}</td>
                </tr>
            `;
        });
        const tableDiv = document.createElement('div');
        tableDiv.className = 'overflow-x-auto';
        tableDiv.innerHTML = `
            <table class="w-full text-left text-sm text-gray-500">
                <thead class="text-xs text-white uppercase bg-blue-600 rounded-t-lg">
                    <tr>
                        <th scope="col" class="py-3 px-6 rounded-tl-lg">Kode Matkul</th>
                        <th scope="col" class="py-3 px-6">Mata Kuliah</th>
                        <th scope="col" class="py-3 px-6 text-center">SKS</th>
                        <th scope="col" class="py-3 px-6 text-center">Grade Min</th>
                    </tr>
                </thead>
                <tbody id="kurikulum-table-body">
                    ${tableRows}
                </tbody>
            </table>
        `;
        container.appendChild(tableDiv);
    }
}

export function renderKMKData(data, mahasiswaData) {
    const container = document.getElementById('kmk-content-container');
    if (!container) return;
    container.innerHTML = '';
    
    if (window.innerWidth < 768) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'p-4 md:p-6 border-b border-gray-200';
        infoDiv.innerHTML = `
            <h2 class="text-lg md:text-xl font-semibold mb-4 border-b pb-2">Informasi Mahasiswa dan Daftar Mata Kuliah</h2>
            <div class="grid grid-cols-1 gap-2 text-sm text-gray-700 mb-4">
                <p>NIM: <span class="font-semibold">${mahasiswaData?.nim || 'Memuat...'}</span></p>
                <p>Nama: <span class="font-semibold">${mahasiswaData?.nama || 'Memuat...'}</span></p>
                <p>Program Studi: <span class="font-semibold">${mahasiswaData?.prodi || 'Memuat...'}</span></p>
                <p>Jenjang Studi: <span class="font-semibold">${mahasiswaData?.program || 'Memuat...'}</span></p>
                <p>Semester: <span class="font-semibold">${mahasiswaData?.semester_sekarang || 'Memuat...'}</span></p>
            </div>
        `;
        const cardContainer = document.createElement('div');
        cardContainer.className = 'p-4 space-y-4';
        data.forEach(mk => {
            const card = document.createElement('div');
            card.className = 'khs-card flex-col items-start space-y-2';
            card.innerHTML = `
                <h3 class="font-bold text-lg text-gray-800">${mk.nama_mk}</h3>
                <p class="text-xs text-gray-500">Kode: ${mk.kode_mk}</p>
                <p class="text-xs text-gray-500">SKS: ${mk.sks}</p>
                <p class="text-xs text-gray-500">Kelas: ${mk.kelas}</p>
            `;
            cardContainer.appendChild(card);
        });
        container.appendChild(infoDiv);
        container.appendChild(cardContainer);
    } else {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'p-4 md:p-8 rounded-xl shadow-lg';
        infoDiv.innerHTML = `
            <h2 class="text-lg md:text-xl font-semibold mb-4 border-b pb-2">Informasi Mahasiswa dan Daftar Mata Kuliah</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                <p>NIM: <span id="mahasiswa-nim" class="font-semibold">${mahasiswaData?.nim || 'Memuat...'}</span></p>
                <p>Nama: <span id="mahasiswa-nama" class="font-semibold">${mahasiswaData?.nama || 'Memuat...'}</span></p>
                <p>Program Studi: <span class="font-semibold">${mahasiswaData?.prodi || 'Memuat...'}</span></p>
                <p>Jenjang Studi: <span class="font-semibold">${mahasiswaData?.program || 'Memuat...'}</span></p>
                <p class="md:col-span-2">Semester: <span id="semester-sekarang" class="font-semibold">${mahasiswaData?.semester_sekarang || 'Memuat...'}</span></p>
            </div>
        `;
        const tableDiv = document.createElement('div');
        tableDiv.className = 'overflow-x-auto';
        let tableRows = '';
        data.forEach(mk => {
            tableRows += `
                <tr class="bg-white border-b hover:bg-gray-50">
                    <td class="py-3 px-4 whitespace-nowrap">${mk.kode_mk}</td>
                    <td class="py-3 px-4 whitespace-nowrap">${mk.nama_mk}</td>
                    <td class="py-3 px-4 text-center whitespace-nowrap">${mk.sks}</td>
                    <td class="py-3 px-4 rounded-tr-lg text-center whitespace-nowrap">${mk.kelas}</td>
                </tr>
            `;
        });
        tableDiv.innerHTML = `
            <table class="w-full text-sm text-left text-gray-700">
                <thead class="text-xs text-white uppercase bg-blue-600">
                    <tr>
                        <th scope="col" class="py-3 px-4 rounded-tl-lg whitespace-nowrap">Kode Matkul</th>
                        <th scope="col" class="py-3 px-4 whitespace-nowrap">Mata Kuliah</th>
                        <th scope="col" class="py-3 px-4 text-center whitespace-nowrap">SKS</th>
                        <th scope="col" class="py-3 px-4 rounded-tr-lg text-center whitespace-nowrap">Kelas</th>
                    </tr>
                </thead>
                <tbody id="mata-kuliah-table-body">
                    ${tableRows}
                </tbody>
            </table>
        `;
        container.appendChild(infoDiv);
        container.appendChild(tableDiv);
    }
}

export function renderJadwalHariIni(data, container) {
    if (data.length > 0) {
        let htmlContent = `<div class="space-y-4">`;
        data.forEach(item => {
            htmlContent += `
                <div class="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 class="font-bold text-base text-gray-800">${item.matkul}</h3>
                    <p class="text-xs text-gray-500 mt-1">
                        ${item.jam_mulai.substring(0, 5)} - ${item.jam_selesai.substring(0, 5)} |
                        Ruang: ${item.ruang} | Dosen: ${item.dosen}
                    </p>
                </div>
            `;
        });
        htmlContent += `</div>`;
        container.innerHTML = htmlContent;
    } else {
        container.innerHTML = '<p class="text-sm text-gray-500 italic">Tidak ada jadwal kuliah untuk hari ini.</p>';
    }
}
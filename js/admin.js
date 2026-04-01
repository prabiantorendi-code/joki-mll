// Auth
function checkAuth() {
    if (!sessionStorage.getItem("isLoggedIn")) {
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('admin-dashboard').style.display = 'none';
    } else {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'flex';
        initAdmin();
    }
}

function adminLogin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    if(user === adminCredentials.username && pass === adminCredentials.password) {
        sessionStorage.setItem("isLoggedIn", "true");
        checkAuth();
    } else {
        alert("Username atau Password salah!");
    }
}

function adminLogout() {
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
}

// Navigation
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Initialization
function initAdmin() {
    renderDashboard();
    renderPaket();
    renderFlashSaleAdmin();
    renderRank();
    renderMode();
    renderFaq();
    renderKonfigurasi();
    renderBanner();
}

// Dashboard
function renderDashboard() {
    const tbody = document.getElementById('dashboard-table');
    if(!tbody) return;
    tbody.innerHTML = ordersData.slice(0,5).map(o => `
        <tr>
            <td>${o.id}</td>
            <td>${o.name}</td>
            <td>${o.paket}</td>
            <td>Rp ${o.harga.toLocaleString('id-ID')}</td>
            <td><span style="color:${o.status==='Selesai'?'#16a34a':'#f97316'}">${o.status}</span></td>
        </tr>
    `).join('');
}

// Modals Utilities
function showModal(id) { document.getElementById(id).style.display = 'flex'; }
function hideModal(id) { document.getElementById(id).style.display = 'none'; }

// Kelola Paket
function renderPaket() {
    document.getElementById('paket-table').innerHTML = packagesData.map((p, i) => `
        <tr>
            <td>${p.id}</td><td>${p.name}</td><td>Rp ${p.price.toLocaleString('id-ID')}</td><td>${p.status}</td>
            <td>
                <button class="action-btn btn-edit" onclick="openModalEditPaket(${p.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="hapusPaket(${i})">Hapus</button>
            </td>
        </tr>
    `).join('');
}
function openModalTambahPaket() {
    document.getElementById('form-paket').reset();
    document.getElementById('paket-id').value = '';
    showModal('modal-paket');
}
function openModalEditPaket(id) {
    const p = packagesData.find(x => x.id === id);
    if(p) {
        document.getElementById('paket-id').value = p.id;
        document.getElementById('paket-nama').value = p.name;
        document.getElementById('paket-harga').value = p.price;
        document.getElementById('paket-desc').value = p.desc;
        showModal('modal-paket');
    }
}
function simpanPaket() {
    const id = document.getElementById('paket-id').value;
    const name = document.getElementById('paket-nama').value;
    const price = parseInt(document.getElementById('paket-harga').value);
    const desc = document.getElementById('paket-desc').value;
    if(id) {
        const p = packagesData.find(x => x.id == id);
        p.name = name; p.price = price; p.desc = desc;
    } else {
        packagesData.push({id: Date.now(), name, price, desc, status: "aktif"});
    }
    hideModal('modal-paket'); renderPaket();
}
function hapusPaket(index) { if(confirm("Hapus paket?")) { packagesData.splice(index, 1); renderPaket(); } }

// Flash Sale
function renderFlashSaleAdmin() {
    document.getElementById('fs-table').innerHTML = flashSaleData.map((f, i) => `
        <tr>
            <td>${f.name}</td><td>Rp ${f.originalPrice}</td><td>Rp ${f.salePrice}</td>
            <td><button class="action-btn btn-delete" onclick="hapusItemFlashSale(${i})">Hapus</button></td>
        </tr>
    `).join('');
}
function tambahItemFlashSale() {
    const name = prompt("Nama Item:");
    const ori = parseInt(prompt("Harga Asli:"));
    const sale = parseInt(prompt("Harga Diskon:"));
    if(name && ori && sale) { flashSaleData.push({id: Date.now(), name, originalPrice:ori, salePrice:sale}); renderFlashSaleAdmin(); }
}
function hapusItemFlashSale(index) { if(confirm("Hapus?")) { flashSaleData.splice(index, 1); renderFlashSaleAdmin(); } }

// Rank
function renderRank() {
    document.getElementById('rank-table').innerHTML = rankData.map((r, i) => `
        <tr><td>${r}</td><td><button class="action-btn btn-delete" onclick="hapusRank(${i})">Hapus</button></td></tr>
    `).join('');
}
function tambahRank() { const r = prompt("Nama Rank Baru:"); if(r) { rankData.push(r); renderRank(); } }
function hapusRank(index) { rankData.splice(index, 1); renderRank(); }

// Mode
let modeData = ["Perpaket", "Per Bintang", "Win Rate", "Full Season"];
function renderMode() {
    document.getElementById('mode-table').innerHTML = modeData.map((m, i) => `
        <tr><td>${m}</td><td><button class="action-btn btn-delete" onclick="hapusMode(${i})">Hapus</button></td></tr>
    `).join('');
}
function tambahMode() { const m = prompt("Nama Mode:"); if(m) { modeData.push(m); renderMode(); } }
function hapusMode(index) { modeData.splice(index, 1); renderMode(); }

// FAQ
function renderFaq() {
    document.getElementById('faq-table').innerHTML = faqData.map((f, i) => `
        <tr><td>${f.q}</td><td>${f.a}</td><td><button class="action-btn btn-delete" onclick="hapusFaq(${i})">Hapus</button></td></tr>
    `).join('');
}
function openModalTambahFaq() { document.getElementById('form-faq').reset(); showModal('modal-faq'); }
function simpanFaq() {
    const q = document.getElementById('faq-q').value; const a = document.getElementById('faq-a').value;
    if(q && a) { faqData.push({q, a}); hideModal('modal-faq'); renderFaq(); }
}
function hapusFaq(index) { faqData.splice(index, 1); renderFaq(); }

// Konfigurasi
function renderKonfigurasi() {
    document.getElementById('conf-name').value = siteConfig.name;
    document.getElementById('conf-wa').value = siteConfig.wa;
    document.getElementById('conf-ig').value = siteConfig.instagram;
}
function simpanKonfigurasi() {
    siteConfig.name = document.getElementById('conf-name').value;
    siteConfig.wa = document.getElementById('conf-wa').value;
    siteConfig.instagram = document.getElementById('conf-ig').value;
    alert("Konfigurasi disimpan!");
}

// Banner
let banners = ["Banner Promo Ramadan", "Banner Flash Sale", "Banner Mythic Grading"];
function renderBanner() {
    document.getElementById('banner-table').innerHTML = banners.map((b, i) => `
        <tr><td>${b}</td><td><button class="action-btn btn-delete" onclick="hapusBanner(${i})">Hapus</button></td></tr>
    `).join('');
}
function tambahBanner() { const b = prompt("Nama Banner:"); if(b) { banners.push(b); renderBanner(); } }
function hapusBanner(index) { banners.splice(index, 1); renderBanner(); }

// Pesan WA
function simpanPesanWA() { alert("Template WA disimpan!"); }

document.addEventListener("DOMContentLoaded", checkAuth);


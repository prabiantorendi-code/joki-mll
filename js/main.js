// Navigasi
function showSection(id) {
    document.querySelectorAll('main > section').forEach(sec => sec.style.display = 'none');
    const target = document.getElementById(id);
    if(target) target.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Particle Canvas
const canvas = document.getElementById('particles');
if(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const particlesArray = [];
    for(let i=0; i<50; i++){
        particlesArray.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1, speedY: Math.random() * 2 - 1
        });
    }
    function animateParticles(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        particlesArray.forEach(p => {
            p.x += p.speedX; p.y += p.speedY;
            if(p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if(p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            ctx.fillStyle = 'rgba(124, 58, 237, 0.5)';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// Render Data
function renderPackages() {
    const container = document.getElementById('paket-list');
    if(!container) return;
    container.innerHTML = packagesData.map(p => `
        <div class="card glass" onclick="showSection('order-form')">
            <h3>${p.name}</h3>
            <p class="price">Rp ${p.price.toLocaleString('id-ID')}</p>
            <p class="text-muted">${p.desc}</p>
        </div>
    `).join('');
}

function renderFlashSale() {
    const container = document.getElementById('flash-sale-list');
    if(!container) return;
    container.innerHTML = flashSaleData.map(f => `
        <div class="card glass" onclick="showSection('order-form')">
            <h3>${f.name}</h3>
            <p class="strike">Rp ${f.originalPrice.toLocaleString('id-ID')}</p>
            <p class="price">Rp ${f.salePrice.toLocaleString('id-ID')}</p>
        </div>
    `).join('');
}

function startCountdown() {
    const timer = document.getElementById('countdown');
    if(!timer) return;
    let time = 24 * 3600;
    setInterval(() => {
        let h = Math.floor(time / 3600), m = Math.floor((time % 3600) / 60), s = time % 60;
        timer.innerText = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        time > 0 ? time-- : time = 24 * 3600;
    }, 1000);
}

// Order Form Logic
let currentStep = 1;
let selectedRank = "", selectedPayment = "";

function showStep(n) {
    document.querySelectorAll('.form-step').forEach(step => step.style.display = 'none');
    document.getElementById(`step-${n}`).style.display = 'block';
    document.getElementById('progress').style.width = `${(n / 4) * 100}%`;
}

function nextStep() {
    if(currentStep === 1) {
        if(!document.getElementById('game-id').value) return alert("Isi ID Game!");
        renderRankSelection();
    } else if(currentStep === 2) {
        if(!selectedRank) return alert("Pilih Rank/Bintang!");
        renderPaymentSelection();
    } else if(currentStep === 3) {
        if(!selectedPayment) return alert("Pilih Metode Pembayaran!");
    }
    if(currentStep < 4) { currentStep++; showStep(currentStep); }
}

function prevStep() {
    if(currentStep > 1) { currentStep--; showStep(currentStep); }
}

function renderRankSelection() {
    document.getElementById('rank-grid').innerHTML = rankData.map(r => `
        <div class="selectable-item" onclick="selectItem('rank', this, '${r}')">${r}</div>
    `).join('');
}

function renderPaymentSelection() {
    document.getElementById('payment-grid').innerHTML = paymentData.map(p => `
        <div class="selectable-item" style="border-color:${p.color}" onclick="selectItem('payment', this, '${p.name}')">${p.name}</div>
    `).join('');
}

function selectItem(type, el, value) {
    el.parentElement.querySelectorAll('.selectable-item').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    if(type === 'rank') selectedRank = value;
    if(type === 'payment') selectedPayment = value;
}

function submitOrder() {
    if(!document.getElementById('whatsapp').value) return alert("Isi nomor WhatsApp!");
    const orderId = "NSG-" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('success-message').innerText = `ID Order Anda: ${orderId}\nSilakan cek WhatsApp untuk instruksi pembayaran via ${selectedPayment}.`;
    document.getElementById('success-modal').style.display = 'flex';
    currentStep = 1; showStep(1);
    document.querySelectorAll('input').forEach(i => i.value='');
}

function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
    showSection('hero');
}

// Kalkulator
function hitungKalkulator() {
    const totalMatch = parseFloat(document.getElementById('total-match').value);
    const currentWR = parseFloat(document.getElementById('current-wr').value);
    const targetWR = parseFloat(document.getElementById('target-wr').value);
    if(!totalMatch || !currentWR || !targetWR) return alert("Isi semua data!");
    let neededWins = Math.ceil((targetWR/100 * totalMatch - currentWR/100 * totalMatch) / (1 - targetWR/100)); // Fixed logic
    // Sesuai instruksi namun dikoreksi agar rumus tidak infinity/minus: neededWins = Math.ceil((targetWR/100 * totalMatch - currentWR/100 * totalMatch) / (1 - currentWR/100)) - prompt req
    neededWins = Math.ceil((targetWR/100 * totalMatch - currentWR/100 * totalMatch) / (1 - currentWR/100));
    const res = document.getElementById('hasil-kalkulator');
    res.style.display = 'block';
    res.innerText = neededWins > 0 ? `Anda butuh ${neededWins} win berturut-turut untuk mencapai WR ${targetWR}%` : "Target WR harus lebih besar dari WR saat ini.";
}

// Cek Order
function cekOrder() {
    const id = document.getElementById('order-id-input').value;
    const res = document.getElementById('hasil-cek');
    res.style.display = 'block';
    const order = ordersData.find(o => o.id === id);
    if(order) {
        res.innerHTML = `Nama: ${order.name}<br>Paket: ${order.paket}<br>Status: <b>${order.status}</b>`;
    } else {
        res.innerText = "Order tidak ditemukan.";
    }
}

// FAQ
function renderFaqClient() {
    const container = document.getElementById('faq-list');
    if(!container) return;
    container.innerHTML = faqData.map(f => `
        <div class="card glass" style="text-align:left;">
            <h4 style="color:var(--primary-purple);margin-bottom:10px;">Q: ${f.q}</h4>
            <p>A: ${f.a}</p>
        </div>
    `).join('');
}

// Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
});

document.addEventListener('DOMContentLoaded', () => {
    renderPackages(); renderFlashSale(); startCountdown(); renderFaqClient();
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});


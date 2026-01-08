/* ============================================
   BÜYÜKSOFULU KÖYÜ - JavaScript
   Aladağ, Adana - Toros Dağları
   ============================================ */

// Firebase Configuration (Replace with your own config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "buyuksofulu.firebaseapp.com",
    projectId: "buyuksofulu",
    storageBucket: "buyuksofulu.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let auth, currentUser = null;
try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
} catch (e) {
    console.log('Firebase config needed for production');
}

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const preloader = document.getElementById('preloader');
const backToTop = document.getElementById('back-to-top');
const galleryGrid = document.getElementById('gallery-grid');
const videoGrid = document.getElementById('video-grid');
const newsGrid = document.getElementById('news-grid');
const lightbox = document.getElementById('lightbox');
const uploadModal = document.getElementById('upload-modal');
const videoModal = document.getElementById('video-modal');
const authModal = document.getElementById('auth-modal');

// Aladağ/Toros themed gallery data
const galleryData = [
    { id: 1, src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', title: 'Toros Dağları Manzarası', category: 'nature' },
    { id: 2, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', title: 'Dağ Zirvesi', category: 'nature' },
    { id: 3, src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', title: 'Köy Manzarası', category: 'village' },
    { id: 4, src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800', title: 'Orman Yolu', category: 'nature' },
    { id: 5, src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800', title: 'Şelale', category: 'nature' },
    { id: 6, src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', title: 'Vadi Manzarası', category: 'nature' },
    { id: 7, src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', title: 'Gün Batımı', category: 'village' },
    { id: 8, src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800', title: 'Hasat Zamanı', category: 'culture' },
    { id: 9, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', title: 'Yayla Evi', category: 'yayla' },
    { id: 10, src: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800', title: 'Karlı Zirveler', category: 'nature' },
    { id: 11, src: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800', title: 'Köy Yolu', category: 'village' },
    { id: 12, src: 'https://images.unsplash.com/photo-1595003969098-f7c3b5f1dd22?w=800', title: 'El Sanatları', category: 'culture' }
];

const videoData = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', title: 'Büyüksofulu Köyü Tanıtım Filmi', duration: '5:32', views: '2.4K' },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', title: 'Drone ile Köyümüz', duration: '3:45', views: '1.8K' },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', title: 'Aladağlar Trekking', duration: '8:20', views: '3.2K' },
    { id: 4, thumbnail: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800', title: 'Kapuzbaşı Şelaleleri Gezisi', duration: '6:15', views: '4.1K' }
];

const newsData = [
    { id: 1, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800', title: 'Köy Şenliği 15 Ağustos\'ta!', date: '5 Ocak 2024', tag: 'Etkinlik', excerpt: 'Geleneksel köy şenliğimiz bu yıl da coşkuyla kutlanacak. Tüm hemşehrilerimizi bekliyoruz...' },
    { id: 2, image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800', title: 'Yeni Yol Projesi Tamamlandı', date: '28 Aralık 2023', tag: 'Altyapı', excerpt: 'Aladağ-Büyüksofulu arası yeni asfalt yol hizmete açıldı...' },
    { id: 3, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', title: 'Yayla Turizmi Canlanıyor', date: '20 Aralık 2023', tag: 'Turizm', excerpt: 'Eğni Yaylası\'na olan ilgi her geçen yıl artıyor. Kamp alanları genişletiliyor...' }
];

let currentLightboxIndex = 0;
let filteredGallery = [...galleryData];
let currentSlide = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavbar();
    initHeroSlider();
    initGallery();
    initVideos();
    initNews();
    initLightbox();
    initModals();
    initAuth();
    initContactForm();
    initScrollAnimations();
    initCounters();
});

// Preloader
function initPreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 800);
    });
}

// Navbar
function initNavbar() {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
        backToTop.classList.toggle('visible', window.scrollY > 500);
        updateActiveNavLink();
    });

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const navLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

// Hero Slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');

    function showSlide(index) {
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        currentSlide = index;
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => showSlide(parseInt(dot.dataset.slide)));
    });

    setInterval(() => {
        showSlide((currentSlide + 1) % slides.length);
    }, 6000);
}

// Gallery
function initGallery() {
    renderGallery(galleryData);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            filteredGallery = filter === 'all' ? [...galleryData] : galleryData.filter(item => item.category === filter);
            renderGallery(filteredGallery);
        });
    });

    document.getElementById('upload-photo-btn').addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Fotoğraf Paylaş';
        checkAuthAndOpenUpload();
    });
}

function renderGallery(items) {
    galleryGrid.innerHTML = items.map((item, index) => `
        <div class="gallery-item" data-index="${index}" data-category="${item.category}">
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <h4>${item.title}</h4>
                <span>${getCategoryName(item.category)}</span>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            currentLightboxIndex = parseInt(item.dataset.index);
            openLightbox();
        });
    });
}

function getCategoryName(cat) {
    const names = { nature: 'Doğa', village: 'Köy', culture: 'Kültür', yayla: 'Yayla', events: 'Etkinlik' };
    return names[cat] || cat;
}

// Videos
function initVideos() {
    videoGrid.innerHTML = videoData.map(v => `
        <div class="video-card" data-id="${v.id}">
            <div class="video-thumbnail">
                <img src="${v.thumbnail}" alt="${v.title}">
                <div class="video-play"><i class="fas fa-play-circle"></i></div>
                <span class="video-duration">${v.duration}</span>
            </div>
            <div class="video-info">
                <h4>${v.title}</h4>
                <p><i class="far fa-eye"></i> ${v.views} görüntülenme</p>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => openModal(videoModal));
    });

    document.getElementById('upload-video-btn').addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Video Paylaş';
        checkAuthAndOpenUpload();
    });
}

// News
function initNews() {
    newsGrid.innerHTML = newsData.map(n => `
        <article class="news-card">
            <div class="news-image">
                <img src="${n.image}" alt="${n.title}">
                <span class="news-tag">${n.tag}</span>
            </div>
            <div class="news-content">
                <div class="news-meta"><span><i class="far fa-calendar"></i> ${n.date}</span></div>
                <h3>${n.title}</h3>
                <p>${n.excerpt}</p>
                <a href="#" class="news-link">Devamını Oku <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `).join('');
}

// Auth
function initAuth() {
    const loginBtn = document.getElementById('login-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const uploadLoginBtn = document.getElementById('upload-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userMenu = document.getElementById('user-menu');

    loginBtn?.addEventListener('click', () => openModal(authModal));
    googleLoginBtn?.addEventListener('click', handleGoogleLogin);
    uploadLoginBtn?.addEventListener('click', handleGoogleLogin);
    logoutBtn?.addEventListener('click', handleLogout);

    // Check auth state
    if (auth) {
        auth.onAuthStateChanged(user => {
            currentUser = user;
            updateAuthUI();
        });
    }
}

async function handleGoogleLogin() {
    if (!auth) {
        alert('Firebase yapılandırması gerekli. Lütfen yöneticiyle iletişime geçin.');
        return;
    }

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        closeAllModals();
        showNotification('Giriş başarılı! Hoş geldiniz.', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Giriş yapılamadı. Lütfen tekrar deneyin.', 'error');
    }
}

async function handleLogout() {
    if (!auth) return;
    try {
        await auth.signOut();
        showNotification('Çıkış yapıldı.', 'success');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const uploadLoginRequired = document.getElementById('upload-login-required');
    const uploadFormContainer = document.getElementById('upload-form-container');

    if (currentUser) {
        loginBtn?.classList.add('hidden');
        userMenu?.classList.remove('hidden');
        if (userAvatar) userAvatar.src = currentUser.photoURL || 'https://via.placeholder.com/40';
        if (userName) userName.textContent = currentUser.displayName || 'Kullanıcı';
        if (userEmail) userEmail.textContent = currentUser.email;
        uploadLoginRequired?.classList.add('hidden');
        uploadFormContainer?.classList.remove('hidden');
    } else {
        loginBtn?.classList.remove('hidden');
        userMenu?.classList.add('hidden');
        uploadLoginRequired?.classList.remove('hidden');
        uploadFormContainer?.classList.add('hidden');
    }
}

function checkAuthAndOpenUpload() {
    openModal(uploadModal);
    updateAuthUI();
}

// Notification
function showNotification(message, type = 'info') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    notif.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'}; 
        color: white; padding: 16px 24px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000; display: flex; align-items: center; gap: 10px; animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => { notif.style.opacity = '0'; setTimeout(() => notif.remove(), 300); }, 3000);
}

// Lightbox
function initLightbox() {
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    document.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox() {
    const item = filteredGallery[currentLightboxIndex];
    document.getElementById('lightbox-img').src = item.src;
    document.querySelector('.lightbox-caption').textContent = item.title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    currentLightboxIndex = (currentLightboxIndex + dir + filteredGallery.length) % filteredGallery.length;
    openLightbox();
}

// Modals
function initModals() {
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeAllModals));
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => { if (e.target === modal) closeAllModals(); });
    });

    // Upload area
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadPreview = document.getElementById('upload-preview');

    uploadArea?.addEventListener('click', () => fileInput?.click());
    uploadArea?.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea?.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea?.addEventListener('drop', e => { e.preventDefault(); uploadArea.classList.remove('dragover'); handleFiles(e.dataTransfer.files); });
    fileInput?.addEventListener('change', () => handleFiles(fileInput.files));

    document.getElementById('submit-upload')?.addEventListener('click', handleUploadSubmit);
}

function handleFiles(files) {
    const preview = document.getElementById('upload-preview');
    preview.innerHTML = '';
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            const isVideo = file.type.startsWith('video/');
            div.innerHTML = `
                <${isVideo ? 'video' : 'img'} src="${e.target.result}" alt="${file.name}">
                <button class="remove-btn"><i class="fas fa-times"></i></button>
            `;
            div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
            preview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function handleUploadSubmit() {
    const title = document.getElementById('upload-title')?.value;
    const category = document.getElementById('upload-category')?.value;
    const files = document.getElementById('upload-preview')?.children.length;

    if (!currentUser) {
        showNotification('Lütfen önce giriş yapın.', 'error');
        return;
    }
    if (!files) {
        showNotification('Lütfen en az bir dosya seçin.', 'error');
        return;
    }

    showNotification('İçeriğiniz başarıyla yüklendi! Onay sonrası yayınlanacaktır.', 'success');
    closeAllModals();
    document.getElementById('upload-preview').innerHTML = '';
    document.getElementById('upload-title').value = '';
}

function openModal(modal) {
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
}

// Contact Form
function initContactForm() {
    document.getElementById('contact-form')?.addEventListener('submit', e => {
        e.preventDefault();
        showNotification('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.', 'success');
        e.target.reset();
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.section-header, .about-image-container, .about-content, .gallery-item, .video-card, .news-card, .info-card, .attraction-card, .product-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Counter Animation
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.dataset.count));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else el.textContent = Math.floor(current);
    }, 25);
}

// Add notification animation
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
document.head.appendChild(style);

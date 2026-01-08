/* ============================================
   BÜYÜKSOFULU & EĞNİ YAYLASI
   Modern Dashboard JavaScript
   ============================================ */

// Firebase Config (Replace with your own)
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

// Gallery Data - Büyüksofulu & Eğni Yaylası themed
const galleryData = [
    { id: 1, src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', title: 'Eğni Yaylası Manzarası', category: 'egni', tall: true },
    { id: 2, src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', title: 'Büyüksofulu Köyü', category: 'koy' },
    { id: 3, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', title: 'Toros Dağları', category: 'doga' },
    { id: 4, src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800', title: 'Orman Yolu', category: 'doga' },
    { id: 5, src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800', title: 'Eğni Şelalesi', category: 'egni', tall: true },
    { id: 6, src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', title: 'Gün Batımı', category: 'koy' },
    { id: 7, src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', title: 'Kamp Alanı', category: 'egni' },
    { id: 8, src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', title: 'Dağ Zirvesi', category: 'doga' },
    { id: 9, src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', title: 'Trekking Rotası', category: 'egni' },
    { id: 10, src: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800', title: 'Karlı Zirveler', category: 'doga', tall: true },
    { id: 11, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', title: 'Yayla Evi', category: 'koy' },
    { id: 12, src: 'https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?w=800', title: 'Piknik Alanı', category: 'egni' }
];

// DOM Elements
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const backToTop = document.getElementById('back-to-top');
const cursorGlow = document.getElementById('cursor-glow');
const galleryGrid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const authModal = document.getElementById('auth-modal');
const uploadModal = document.getElementById('upload-modal');

let currentLightboxIndex = 0;
let filteredGallery = [...galleryData];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set dark theme by default
    document.documentElement.setAttribute('data-theme', 'dark');

    initPreloader();
    initCursor();
    initNavbar();
    initGallery();
    initLightbox();
    initTestimonials();
    initModals();
    initAuth();
    initUpload();
    initCounters();
    initScrollAnimations();
    initContactForm();
    initThemeToggle();
});

// Preloader
function initPreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 600);
    });
}

// Custom Cursor
function initCursor() {
    if (window.innerWidth < 1024) return;

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// Navbar
function initNavbar() {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
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

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 150;

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

// Theme Toggle
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');

    themeBtn?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);

        const icon = themeBtn.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    });
}

// Gallery
function initGallery() {
    renderGallery(galleryData);

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            filteredGallery = filter === 'all'
                ? [...galleryData]
                : galleryData.filter(item => item.category === filter);

            renderGallery(filteredGallery);
        });
    });
}

function renderGallery(items) {
    galleryGrid.innerHTML = items.map((item, index) => `
        <div class="gallery-item ${item.tall ? 'tall' : ''}" data-index="${index}">
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="gi-overlay">
                <h4>${item.title}</h4>
                <span>${getCategoryLabel(item.category)}</span>
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

function getCategoryLabel(cat) {
    const labels = { koy: 'Büyüksofulu', egni: 'Eğni Yaylası', doga: 'Doğa' };
    return labels[cat] || cat;
}

// Lightbox
function initLightbox() {
    document.querySelector('.lb-close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lb-prev')?.addEventListener('click', () => navigate(-1));
    document.querySelector('.lb-next')?.addEventListener('click', () => navigate(1));

    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });
}

function openLightbox() {
    const item = filteredGallery[currentLightboxIndex];
    document.getElementById('lb-img').src = item.src;
    document.getElementById('lb-caption').textContent = item.title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigate(dir) {
    currentLightboxIndex = (currentLightboxIndex + dir + filteredGallery.length) % filteredGallery.length;
    openLightbox();
}

// Testimonials
function initTestimonials() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonial-dots');
    let currentIndex = 0;

    if (!dotsContainer || cards.length === 0) return;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => showTestimonial(i));
        dotsContainer.appendChild(dot);
    });

    function showTestimonial(index) {
        cards.forEach((c, i) => c.classList.toggle('active', i === index));
        document.querySelectorAll('.testimonial-dots .dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    // Auto rotate
    setInterval(() => {
        showTestimonial((currentIndex + 1) % cards.length);
    }, 5000);
}

// Modals
function initModals() {
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Click outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAllModals();
        });
    });

    // Login button
    document.getElementById('login-btn')?.addEventListener('click', () => {
        openModal(authModal);
    });

    // Upload button
    document.getElementById('upload-btn')?.addEventListener('click', () => {
        if (currentUser) {
            openModal(uploadModal);
        } else {
            openModal(authModal);
        }
    });
}

function openModal(modal) {
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
}

// Auth
function initAuth() {
    document.getElementById('google-login')?.addEventListener('click', handleGoogleLogin);

    if (auth) {
        auth.onAuthStateChanged(user => {
            currentUser = user;
            updateAuthUI();
        });
    }
}

async function handleGoogleLogin() {
    if (!auth) {
        showNotification('Firebase yapılandırması gerekli', 'error');
        return;
    }

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        closeAllModals();
        showNotification('Hoş geldiniz! ' + auth.currentUser.displayName, 'success');
    } catch (error) {
        console.error(error);
        showNotification('Giriş yapılamadı', 'error');
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    if (currentUser && loginBtn) {
        loginBtn.innerHTML = `<img src="${currentUser.photoURL || ''}" style="width:24px;height:24px;border-radius:50%"> ${currentUser.displayName?.split(' ')[0] || 'Kullanıcı'}`;
    }
}

// Upload
function initUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const uploadPreview = document.getElementById('upload-preview');

    uploadZone?.addEventListener('click', () => fileInput?.click());

    uploadZone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary)';
    });

    uploadZone?.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '';
    });

    uploadZone?.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '';
        handleFiles(e.dataTransfer.files);
    });

    fileInput?.addEventListener('change', () => handleFiles(fileInput.files));

    document.getElementById('submit-upload')?.addEventListener('click', handleSubmitUpload);
}

function handleFiles(files) {
    const preview = document.getElementById('upload-preview');
    if (!preview) return;

    preview.innerHTML = '';

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `<img src="${e.target.result}" alt="">`;
            preview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function handleSubmitUpload() {
    if (!currentUser) {
        showNotification('Lütfen önce giriş yapın', 'error');
        return;
    }

    const preview = document.getElementById('upload-preview');
    if (!preview?.children.length) {
        showNotification('Lütfen fotoğraf seçin', 'error');
        return;
    }

    showNotification('Fotoğrafınız yüklendi! Onay sonrası yayınlanacak.', 'success');
    closeAllModals();
    preview.innerHTML = '';
}

// Counters
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const elements = document.querySelectorAll('.section-tag, .section-title, .highlight-card, .ef-card, .gallery-item, .exp-card, .cc-item');

    elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
        observer.observe(el);
    });
}

// Contact Form
function initContactForm() {
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Mesajınız gönderildi! Teşekkürler.', 'success');
        e.target.reset();
    });
}

// Notification
function showNotification(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };

    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };

    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notif.innerHTML = `<i class="fas fa-${icons[type]}"></i> ${message}`;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(100%)';
        notif.style.transition = 'all 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Add animation keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

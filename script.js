/* ============================================
   BÜYÜKSOFULU MAHALLESİ
   Aladağ, Adana - JavaScript
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

// Büyüksofulu & Eğni Yaylası Galeri Verileri
// Gerçek köy resimleri için Google Maps ve yerel kaynaklar kullanılabilir
const galleryData = [
    // Büyüksofulu Köyü resimleri
    {
        id: 1,
        src: 'https://d.koylerim.com/gallery/9_1.jpg',
        title: 'Büyüksofulu Köyü Panoraması',
        category: 'koy',
        fallback: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
    },
    {
        id: 2,
        src: 'https://d.koylerim.com/gallery/9_26.jpg',
        title: 'Köy Merkezi',
        category: 'koy',
        fallback: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800'
    },
    {
        id: 3,
        src: 'https://d.koylerim.com/gallery/9_6.jpg',
        title: 'Karlı Manzarası',
        category: 'koy',
        fallback: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800'
    },

    // Eğni Yaylası resimleri
    {
        id: 4,
        src: 'https://d.koylerim.com/gallery/9_13.jpg',
        title: 'Eğni Yaylası ',
        category: 'egni',
        tall: true
    },
    {
        id: 5,
        src: 'https://d.koylerim.com/gallery/9_22.jpg',
        title: 'Eğni Yaylası Manzarası',
        category: 'egni'
    },
    {
        id: 6,
        src: 'https://pbs.twimg.com/media/CYl9ClAW8AAEsv6.jpg',
        title: 'Eğni Fotoğrafları',
        category: 'egni'
    },

    // Doğa resimleri
    {
        id: 7,
        src: 'https://d.koylerim.com/gallery/9_25.jpg',
        title: 'Eğni Yaylası Kale',
        category: 'doga',
        tall: true
    },
    {
        id: 8,
        src: 'https://www.kampadana.com.tr/tema/blog/uploads/makaleler/galeri/diger/80156195-86B9-4FE6-A63F-726F6B386C9D.png',
        title: 'Kamp Alanı',
        category: 'doga'
    },
    {
        id: 9,
        src: 'https://www.kampadana.com.tr/tema/blog/uploads/makaleler/galeri/diger/8BAC9DC1-02E2-431C-AA5C-BC8051A90ADB.png',
        title: 'Eğni Yaylası Yaz Festivali',
        category: 'doga'
    },
    {
        id: 10,
        src: 'https://www.kampadana.com.tr/tema/blog/uploads/makaleler/galeri/diger/6FBE28E3-8931-499E-B489-A6FC523CD5A3.png',
        title: 'Eğni Mini Şelale',
        category: 'egni'
    },
    {
        id: 11,
        src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
        title: 'Gün Batımı',
        category: 'koy'
    },
    {
        id: 12,
        src: 'https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?w=800',
        title: 'Piknik Alanı',
        category: 'egni'
    }
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

// Video Gallery Data - YouTube videoları
// YouTube video ID'si: https://www.youtube.com/watch?v=VIDEO_ID
const videoData = [
    {
        id: 1,
        videoId: 'SPldaxoQnTM',
        title: 'Büyüksofulu Köyü Tanıtımı',
        category: 'koy',
        duration: '3:45'
    },
    {
        id: 2,
        videoId: 'nAcJfUEVLd4',
        title: 'Eğni Yaylası Gezisi',
        category: 'egni',
        duration: '5:20'
    },
    {
        id: 3,
        videoId: 'ilTAVjaX-MI',
        title: 'Eğni Yaylası Manzaraları',
        category: 'egni',
        duration: '4:10'
    },
    {
        id: 4,
        videoId: 'ijRmJcpjjvA',
        title: 'Büyüksofulu Doğa Yürüyüşü',
        category: 'doga',
        duration: '6:30'
    },
    {
        id: 5,
        videoId: 'XMxwdB63CSI',
        title: 'Suyungözü ve Şelale',
        category: 'egni',
        duration: '4:55'
    }
];

const videoModal = document.getElementById('video-modal');
const videoGrid = document.getElementById('video-grid');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set dark theme by default
    document.documentElement.setAttribute('data-theme', 'dark');

    initPreloader();
    initCursor();
    initNavbar();
    initGallery();
    initLightbox();
    initModals();
    initAuth();
    initUpload();
    initVideoGallery();
    initVideoUpload();
    initCounters();
    initScrollAnimations();
    initContactForm();
    initThemeToggle();
});

// Preloader
function initPreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => preloader?.classList.add('hidden'), 600);
    });
}

// Custom Cursor
function initCursor() {
    if (window.innerWidth < 1024 || !cursorGlow) return;

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// Navbar
function initNavbar() {
    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
        backToTop?.classList.toggle('visible', window.scrollY > 500);
        updateActiveNavLink();
    });

    navToggle?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
        navToggle?.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
        });
    });

    backToTop?.addEventListener('click', () => {
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
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    });
}

// Gallery
function initGallery() {
    if (!galleryGrid) return;

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
    if (!galleryGrid) return;

    galleryGrid.innerHTML = items.map((item, index) => `
        <div class="gallery-item ${item.tall ? 'tall' : ''}" data-index="${index}">
            <img src="${item.src}" alt="${item.title}" loading="lazy" onerror="this.src='${item.fallback || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'}'">
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
    const labels = {
        koy: 'Büyüksofulu',
        egni: 'Eğni Yaylası',
        doga: 'Doğa'
    };
    return labels[cat] || cat;
}

// Lightbox
function initLightbox() {
    if (!lightbox) return;

    document.querySelector('.lb-close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lb-prev')?.addEventListener('click', () => navigate(-1));
    document.querySelector('.lb-next')?.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
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
    if (!lightbox || !filteredGallery[currentLightboxIndex]) return;

    const item = filteredGallery[currentLightboxIndex];
    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');

    if (lbImg) lbImg.src = item.src;
    if (lbCaption) lbCaption.textContent = item.title;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigate(dir) {
    currentLightboxIndex = (currentLightboxIndex + dir + filteredGallery.length) % filteredGallery.length;
    openLightbox();
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
        showNotification('Firebase yapılandırması gerekli. Lütfen admin ile iletişime geçin.', 'error');
        return;
    }

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        closeAllModals();
        showNotification('Hoş geldiniz, ' + auth.currentUser.displayName + '!', 'success');
    } catch (error) {
        console.error(error);
        showNotification('Giriş yapılamadı. Lütfen tekrar deneyin.', 'error');
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    if (currentUser && loginBtn) {
        loginBtn.innerHTML = `<img src="${currentUser.photoURL || ''}" style="width:24px;height:24px;border-radius:50%;margin-right:8px"> ${currentUser.displayName?.split(' ')[0] || 'Kullanıcı'}`;
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
            div.innerHTML = `<img src="${e.target.result}" alt="${file.name}">`;
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

    // Burada Firebase Storage entegrasyonu yapılacak
    showNotification('Fotoğrafınız yüklendi! Onay sonrası yayınlanacak.', 'success');
    closeAllModals();
    preview.innerHTML = '';

    const titleInput = document.getElementById('upload-title');
    if (titleInput) titleInput.value = '';
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

    document.querySelectorAll('.stat-num[data-count]').forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    if (isNaN(target)) return;

    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target.toLocaleString('tr-TR');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current).toLocaleString('tr-TR');
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

    const elements = document.querySelectorAll('.section-tag, .section-title, .about-main-img, .about-content, .eh-card, .ef-item, .gallery-item, .activity-card, .testimonial-card, .direction-card, .cc-item, .info-item');

    elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.03}s, transform 0.6s ease ${i * 0.03}s`;
        observer.observe(el);
    });
}

// Contact Form
function initContactForm() {
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Mesajınız gönderildi! En kısa sürede dönüş yapacağız.', 'success');
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
        font-family: 'Outfit', sans-serif;
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
    }, 3500);
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

// Newsletter Form
document.querySelector('.nl-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input?.value) {
        showNotification('Bültene abone oldunuz!', 'success');
        input.value = '';
    }
});

// ============================================
// VIDEO GALLERY FUNCTIONS
// ============================================

function initVideoGallery() {
    if (!videoGrid) return;
    renderVideoGallery();
    createVideoLightbox();
}

function renderVideoGallery() {
    if (!videoGrid) return;

    videoGrid.innerHTML = videoData.map(video => `
        <div class="video-card" data-video-id="${video.videoId}">
            <div class="video-thumbnail">
                <img src="https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg" alt="${video.title}" 
                     onerror="this.src='https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg'">
                <div class="video-play-btn"><i class="fab fa-youtube"></i></div>
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <div class="video-meta">
                    <span><i class="fas fa-folder"></i> ${getCategoryLabel(video.category)}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Video card click handlers
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.dataset.videoId;
            openVideoLightbox(videoId);
        });
    });
}

function createVideoLightbox() {
    // Create video lightbox if not exists
    if (!document.getElementById('video-lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'video-lightbox';
        lightbox.className = 'video-lightbox';
        lightbox.innerHTML = `
            <button class="video-lightbox-close"><i class="fas fa-times"></i></button>
            <div class="video-lightbox-content">
                <iframe id="video-player" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        `;
        document.body.appendChild(lightbox);

        // Close handlers
        lightbox.querySelector('.video-lightbox-close').addEventListener('click', closeVideoLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeVideoLightbox();
        });
    }
}

function openVideoLightbox(videoId) {
    const lightbox = document.getElementById('video-lightbox');
    const player = document.getElementById('video-player');

    if (lightbox && player) {
        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoLightbox() {
    const lightbox = document.getElementById('video-lightbox');
    const player = document.getElementById('video-player');

    if (lightbox && player) {
        player.src = '';
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Video Upload
function initVideoUpload() {
    const videoModal = document.getElementById('video-modal');

    // Video upload button
    document.getElementById('upload-video-btn')?.addEventListener('click', () => {
        if (currentUser) {
            openModal(videoModal);
        } else {
            openModal(authModal);
        }
    });

    // Preview video
    document.getElementById('preview-video')?.addEventListener('click', previewVideo);

    // Submit video
    document.getElementById('submit-video')?.addEventListener('click', submitVideo);
}

function previewVideo() {
    const urlInput = document.getElementById('video-url');
    const previewContainer = document.getElementById('video-preview-container');

    if (!urlInput || !previewContainer) return;

    const url = urlInput.value.trim();
    const videoId = extractYouTubeId(url);

    if (videoId) {
        previewContainer.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        `;
        showNotification('Video önizlemesi yüklendi!', 'success');
    } else {
        showNotification('Geçerli bir YouTube linki girin', 'error');
    }
}

function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

function submitVideo() {
    if (!currentUser) {
        showNotification('Lütfen önce giriş yapın', 'error');
        return;
    }

    const urlInput = document.getElementById('video-url');
    const titleInput = document.getElementById('video-title');
    const catSelect = document.getElementById('video-cat');

    const url = urlInput?.value.trim();
    const videoId = extractYouTubeId(url);

    if (!videoId) {
        showNotification('Geçerli bir YouTube linki girin', 'error');
        return;
    }

    const title = titleInput?.value.trim() || 'Büyüksofulu Video';
    const category = catSelect?.value || 'koy';

    // Yeni videoyu listeye ekle (geçici - backend ile değişir)
    const newVideo = {
        id: videoData.length + 1,
        videoId: videoId,
        title: title,
        category: category,
        duration: '0:00'
    };

    videoData.push(newVideo);
    renderVideoGallery();

    showNotification('Video eklendi! Onay sonrası yayınlanacak.', 'success');
    closeAllModals();

    // Reset form
    if (urlInput) urlInput.value = '';
    if (titleInput) titleInput.value = '';
    document.getElementById('video-preview-container').innerHTML = '';
}

// ESC key for video lightbox
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoLightbox();
    }
});


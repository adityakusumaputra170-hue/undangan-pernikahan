// Inisialisasi variabel global
let currentMusicState = false;
let currentImageIndex = 0;
let guestbookEntries = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi komponen
    initNavigation();
    initCountdown();
    initMusicPlayer();
    initGallery();
    initRSVPForm();
    initGuestbook();
    initBackToTop();
    initCalendarButtons();
    
    // Load data dari localStorage
    loadGuestbookFromStorage();
    
    // Animasi scroll
    initScrollAnimations();
    
    // Event untuk membuka undangan
    document.getElementById('open-invitation').addEventListener('click', openInvitation);
});

// Fungsi untuk membuka undangan
function openInvitation() {
    // Scroll ke bagian pasangan mempelai
    document.getElementById('couple').scrollIntoView({ behavior: 'smooth' });
    
    // Mulai memutar musik
    const musicPlayer = document.getElementById('wedding-music');
    const musicToggle = document.getElementById('music-toggle');
    musicPlayer.play();
    currentMusicState = true;
    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Tampilkan notifikasi
    showNotification('Musik telah dimulai. Selamat menikmati undangan digital kami!');
}

// Inisialisasi navigasi
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Toggle menu hamburger
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu ketika link diklik
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Inisialisasi countdown
function initCountdown() {
    // Set tanggal pernikahan: 15 Desember 2024
    const weddingDate = new Date('December 15, 2024 08:00:00').getTime();
    
    // Update countdown setiap detik
    const countdownTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        // Hitung hari, jam, menit, detik
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update elemen countdown
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Jika countdown selesai
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.querySelector('.countdown-container').innerHTML = '<h3 style="font-size: 2.5rem; color: var(--gold);">Hari Bahagia Telah Tiba!</h3>';
        }
    }, 1000);
}

// Inisialisasi music player
function initMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle');
    const musicPlayer = document.getElementById('wedding-music');
    
    // Set volume
    musicPlayer.volume = 0.5;
    
    // Toggle play/pause
    musicToggle.addEventListener('click', function() {
        if (currentMusicState) {
            musicPlayer.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            musicPlayer.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }
        currentMusicState = !currentMusicState;
    });
}

// Inisialisasi galeri
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        caption: item.querySelector('.gallery-overlay p').textContent
    }));
    
    // Buka lightbox ketika gambar diklik
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentImageIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Mencegah scroll
        });
    });
    
    // Fungsi update lightbox
    function updateLightbox() {
        lightboxImg.src = images[currentImageIndex].src;
        lightboxCaption.textContent = images[currentImageIndex].caption;
    }
    
    // Tutup lightbox
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Lightbox klik di luar gambar untuk menutup
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Navigasi gambar sebelumnya
    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightbox();
    });
    
    // Navigasi gambar berikutnya
    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightbox();
    });
    
    // Navigasi dengan keyboard
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateLightbox();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateLightbox();
        }
    });
}

// Inisialisasi form RSVP
function initRSVPForm() {
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ambil data form
        const name = document.getElementById('rsvp-name').value;
        const email = document.getElementById('rsvp-email').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const guests = document.getElementById('rsvp-guests').value;
        const message = document.getElementById('rsvp-message').value;
        
        // Simpan ke localStorage (dalam aplikasi nyata, ini akan dikirim ke server)
        const rsvpData = {
            name,
            email,
            attendance,
            guests,
            message,
            date: new Date().toISOString()
        };
        
        // Simpan ke localStorage
        const existingRSVPs = JSON.parse(localStorage.getItem('toniNoniRSVPs')) || [];
        existingRSVPs.push(rsvpData);
        localStorage.setItem('toniNoniRSVPs', JSON.stringify(existingRSVPs));
        
        // Tampilkan pesan sukses
        rsvpForm.style.display = 'none';
        rsvpSuccess.style.display = 'block';
        
        // Reset form
        rsvpForm.reset();
        
        // Tampilkan notifikasi
        showNotification('Terima kasih atas konfirmasi kehadiran Anda!');
    });
}

// Inisialisasi buku tamu
function initGuestbook() {
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntriesContainer = document.getElementById('guestbook-entries');
    
    guestbookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ambil data form
        const name = document.getElementById('guest-name').value;
        const message = document.getElementById('guest-message').value;
        
        // Buat entri baru
        const newEntry = {
            id: Date.now(),
            name,
            message,
            date: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Tambahkan ke array
        guestbookEntries.unshift(newEntry);
        
        // Simpan ke localStorage
        saveGuestbookToStorage();
        
        // Tampilkan entri
        displayGuestbookEntry(newEntry);
        
        // Reset form
        guestbookForm.reset();
        
        // Tampilkan notifikasi
        showNotification('Ucapan Anda telah terkirim. Terima kasih!');
    });
}

// Tampilkan entri buku tamu
function displayGuestbookEntry(entry) {
    const guestbookEntriesContainer = document.getElementById('guestbook-entries');
    
    const entryElement = document.createElement('div');
    entryElement.className = 'guest-entry';
    entryElement.innerHTML = `
        <div class="guest-name">
            <i class="fas fa-user-circle"></i> ${entry.name}
        </div>
        <div class="guest-message">"${entry.message}"</div>
        <div class="guest-date">${entry.date}</div>
    `;
    
    // Tambahkan di awal
    guestbookEntriesContainer.prepend(entryElement);
}

// Muat buku tamu dari localStorage
function loadGuestbookFromStorage() {
    const savedEntries = JSON.parse(localStorage.getItem('toniNoniGuestbook')) || [];
    guestbookEntries = savedEntries;
    
    // Tampilkan semua entri
    guestbookEntries.forEach(entry => {
        displayGuestbookEntry(entry);
    });
}

// Simpan buku tamu ke localStorage
function saveGuestbookToStorage() {
    localStorage.setItem('toniNoniGuestbook', JSON.stringify(guestbookEntries));
}

// Inisialisasi tombol kembali ke atas
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
}

// Inisialisasi tombol kalender
function initCalendarButtons() {
    const calendarButtons = document.querySelectorAll('.add-calendar');
    
    calendarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventName = this.getAttribute('data-event');
            const eventDate = this.getAttribute('data-date');
            const eventLocation = this.getAttribute('data-location');
            
            // Format tanggal untuk Google Calendar
            const startDate = new Date(eventDate);
            const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3 jam setelahnya
            
            const formatDate = (date) => {
                return date.toISOString().replace(/-|:|\.\d+/g, '');
            };
            
            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent('Pernikahan Toni & Noni')}&location=${encodeURIComponent(eventLocation)}&sf=true&output=xml`;
            
            // Buka Google Calendar di tab baru
            window.open(googleCalendarUrl, '_blank');
            
            // Tampilkan notifikasi
            showNotification('Acara telah ditambahkan ke Google Calendar Anda');
        });
    });
}

// Animasi scroll
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.couple-card, .event-card, .gallery-item, .timeline-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Tampilkan notifikasi
function showNotification(message) {
    // Cek apakah notifikasi sudah ada
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        // Buat elemen notifikasi
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
        
        // Style notifikasi
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: var(--gold);
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: var(--shadow);
            z-index: 10000;
            transform: translateX(150%);
            transition: transform 0.5s ease;
            max-width: 300px;
            font-weight: 500;
        `;
    }
    
    // Set pesan
    notification.textContent = message;
    
    // Tampilkan notifikasi
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Sembunyikan setelah 3 detik
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
    }, 3000);
}

// Format tanggal Indonesia
function formatIndonesianDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

// Fungsi untuk berbagi undangan
function shareInvitation() {
    if (navigator.share) {
        navigator.share({
            title: 'Undangan Pernikahan Toni & Noni',
            text: 'Saya mengundang Anda untuk menghadiri pernikahan kami. Buka undangan digital kami di:',
            url: window.location.href,
        })
        .then(() => console.log('Berhasil dibagikan'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback untuk browser yang tidak mendukung Web Share API
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl)
            .then(() => showNotification('Tautan undangan telah disalin ke clipboard!'))
            .catch(err => console.error('Gagal menyalin tautan: ', err));
    }
}

// Tambahkan event listener untuk tombol berbagi di footer
document.addEventListener('DOMContentLoaded', function() {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className;
            
            if (platform.includes('whatsapp')) {
                // Berbagi via WhatsApp
                const text = `Undangan Pernikahan Toni & Noni\n\nBuka undangan digital kami di:\n${window.location.href}`;
                const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            } else if (platform.includes('facebook')) {
                // Berbagi via Facebook
                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                window.open(url, '_blank');
            } else if (platform.includes('instagram')) {
                // Instagram tidak mendukung sharing link langsung
                showNotification('Salin tautan dan bagikan di Instagram');
                navigator.clipboard.writeText(window.location.href);
            } else if (platform.includes('envelope')) {
                // Berbagi via Email
                const subject = 'Undangan Pernikahan Toni & Noni';
                const body = `Halo,\n\nSaya mengundang Anda untuk menghadiri pernikahan kami.\n\nBuka undangan digital kami di: ${window.location.href}\n\nSalam hangat,\nToni & Noni`;
                const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = url;
            }
        });
    });
});
// Theme Initialization (Run immediately to prevent flash of unstyled theme)
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

    if (themeBtn && themeIcon) {
        if (savedTheme === 'dark') {
            themeIcon.className = 'ph ph-sun';
        }

        themeBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.className = 'ph ph-moon';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.className = 'ph ph-sun';
            }
        });
    }


    // Create overlay
    let overlay = document.querySelector('.page-transition-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay active';
        document.body.appendChild(overlay);
        overlay.getBoundingClientRect(); // Force reflow
    }

    // Fade in page (fade out overlay)
    requestAnimationFrame(() => {
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 50);
    });

    // Inject Mobile Menu
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = '<i class="ph ph-list"></i>';

        const navActions = navbar.querySelector('.nav-actions');
        if (navActions) {
            navActions.appendChild(mobileBtn);
        } else {
            navbar.appendChild(mobileBtn);
        }

        const mobileDropdown = document.createElement('div');
        mobileDropdown.className = 'mobile-dropdown';

        const navLinks = navbar.querySelector('.nav-links');
        if (navLinks) {
            mobileDropdown.appendChild(navLinks.cloneNode(true));
        }

        const navBtns = navbar.querySelectorAll('.nav-actions .nav-btn');
        navBtns.forEach(btn => {
            const btnClone = btn.cloneNode(true);
            btnClone.style.width = '100%';
            btnClone.style.justifyContent = 'center';
            mobileDropdown.appendChild(btnClone);
        });

        navbar.appendChild(mobileDropdown);

        mobileBtn.addEventListener('click', () => {
            navbar.classList.toggle('mobile-active');
            const icon = mobileBtn.querySelector('i');
            if (navbar.classList.contains('mobile-active')) {
                icon.className = 'ph ph-x';
                mobileDropdown.style.display = 'flex';
                setTimeout(() => mobileDropdown.classList.add('show'), 10);
            } else {
                icon.className = 'ph ph-list';
                mobileDropdown.classList.remove('show');
                setTimeout(() => mobileDropdown.style.display = 'none', 300);
            }
        });
    }

    // Handle smooth exit transitions
    // Handle smooth exit transitions using Event Delegation
    const handleExit = (e, targetUrl) => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 400); // Wait for CSS transition to finish

        // Failsafe
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 2000);
    };

    document.body.addEventListener('click', (e) => {
        // Find closest anchor tag
        const link = e.target.closest('a[href]:not([href^="#"])');
        if (link && link.target !== '_blank' && !link.hasAttribute('download')) {
            handleExit(e, link.href);
        }

        // Find closest button with onclick containing window.location
        const btn = e.target.closest('button[onclick*="window.location"]');
        if (btn) {
            const onclickAttr = btn.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
                if (match) {
                    const url = match[1];
                    btn.removeAttribute('onclick'); // Prevent native execution
                    handleExit(e, url);
                }
            }
        }
    });
    window.goBack = function (e) {
        if (e) e.preventDefault();
        overlay.classList.add('active');

        setTimeout(() => {
            if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
                window.history.back();
            } else {
                window.location.href = 'index.html';
            }
        }, 400);
    };
});

// Tangani tombol back browser (BFCache) secara lebih agresif untuk HP
window.addEventListener('pageshow', (event) => {
    // Sengaja tidak memakai if(event.persisted) karena beberapa browser mobile 
    // sering bermasalah dan tidak memicu flag ini dengan benar.
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        // Hapus class active secara paksa saat halaman kembali dimunculkan
        overlay.classList.remove('active');
    }
});

window.addEventListener('pagehide', () => {
    // Hapus overlay sesaat sebelum ditinggalkan agar jika di-cache, 
    // halaman tidak dalam keadaan gelap.
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
});

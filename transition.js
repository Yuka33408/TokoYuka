// Theme Initialization (Run immediately to prevent flash of unstyled theme)
const savedTheme = localStorage.getItem('yuka_theme') || 'light';
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
                localStorage.setItem('yuka_theme', 'light');
                themeIcon.className = 'ph ph-moon';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('yuka_theme', 'dark');
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
    const links = document.querySelectorAll('a[href]:not([href^="#"])');
    const buttons = document.querySelectorAll('button[onclick*="window.location"]');

    const handleExit = (e, targetUrl) => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 400); // Wait for CSS transition to finish
    };

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.target !== '_blank' && !link.hasAttribute('download')) {
                handleExit(e, link.href);
            }
        });
    });

    buttons.forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
            if (match) {
                const url = match[1];
                btn.removeAttribute('onclick');
                btn.addEventListener('click', (e) => {
                    handleExit(e, url);
                });
            }
        }
    });
});

// Tangani tombol back browser (BFCache) agar overlay transisi hilang
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const overlay = document.querySelector('.page-transition-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
});

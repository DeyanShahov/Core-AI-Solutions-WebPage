// Navigation handling
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#nav-links a');
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';

    navLinks.forEach(link => {
        if (isHomePage) {
            // On home page, convert links to scroll to sections
            const section = link.getAttribute('data-section');
            if (section && section !== 'home') {
                link.href = `#${section}`;
            }
        } else {
            // On subpages, keep the direct links to pages
            // But highlight current page
            if (window.location.pathname === link.getAttribute('href')) {
                link.classList.add('text-cyan-400');
            }
        }
    });

    // Smooth scroll handling for home page
    if (isHomePage) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
});
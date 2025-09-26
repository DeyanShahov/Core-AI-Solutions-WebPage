// Function to get root path
function getRootPath() {
    const path = window.location.pathname;
    return path.includes('/pages/') ? '../' : '';
}

// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const rootPath = getRootPath();
        const response = await fetch(rootPath + componentPath);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const container = document.getElementById(elementId);
        if (container) {
            container.replaceChildren(...doc.body.children);
            // Update navigation links if this is the header
            if (elementId === 'header') {
                updateHeaderNavigation();
            }
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// Function to update header navigation
function updateHeaderNavigation() {
    const rootPath = getRootPath();
    const navLinks = document.querySelectorAll('#nav-links a');
    const isHomePage = !window.location.pathname.includes('/pages/');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (isHomePage) {
            // На началната страница линковете водят към секции
            if (!href.startsWith('#')) {
                link.href = '#' + href.split('#')[1];
            }
            // Добавяме плавно скролиране за всички вътрешни линкове
            // Make handler idempotent by marking links we've processed
            if (!link.dataset.internalNavAttached) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        // compute header height offset
                        const rootStyles = getComputedStyle(document.documentElement);
                        const headerHeightVal = rootStyles.getPropertyValue('--header-height') || '80px';
                        const headerHeight = parseInt(headerHeightVal, 10) || 80;
                        const top = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                });
                link.dataset.internalNavAttached = 'true';
            }
        } else {
            // На подстраниците линковете водят към началната страница + секция
            if (href.startsWith('#')) {
                const sectionId = href.substring(1); // Премахваме # от началото
                link.href = rootPath + 'index.html#' + sectionId;
            }
        }
    });
}

// Scroll to the element indicated by the URL hash after components are loaded.
// Retries a few times in case components are inserted asynchronously.
async function scrollToLocationHash(retries = 8, delay = 100) {
    if (!window.location.hash) return;
    const id = window.location.hash.substring(1);

    for (let i = 0; i < retries; i++) {
        const el = document.getElementById(id);
        if (el) {
            // Read header height from CSS variable if present, fallback to 80
            const rootStyles = getComputedStyle(document.documentElement);
            const headerHeightVal = rootStyles.getPropertyValue('--header-height') || '80px';
            const headerHeight = parseInt(headerHeightVal, 10) || 80;
            const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8; // small extra offset
            window.scrollTo({ top, behavior: 'smooth' });
            return;
        }
        // wait and retry
        await new Promise(res => setTimeout(res, delay));
    }
}

// Load all components when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    const components = [
        { id: 'header', path: 'components/header.html' },
        { id: 'hero', path: 'components/hero.html' },
        { id: 'services', path: 'components/services.html' },
        { id: 'portfolio', path: 'components/portfolio.html' },
        { id: 'about', path: 'components/about.html' },
        { id: 'blog', path: 'components/blog.html' },
        { id: 'contact', path: 'components/contact.html' },
        { id: 'footer', path: 'components/footer.html' }
    ];

    // Load components in parallel
    await Promise.all(components.map(component => 
        loadComponent(component.id, component.path)
    ));

    // After components load, if the URL contains a hash (e.g. index.html#services)
    // scroll to the target element. This fixes the case when the browser attempts
    // to jump to the anchor before component HTML (with the target id) is inserted.
    scrollToLocationHash();
});
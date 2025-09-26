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
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        } else {
            // На подстраниците линковете водят към началната страница + секция
            if (href.startsWith('#')) {
                const sectionId = href.substring(1); // Премахваме # от началото
                link.href = rootPath + 'index.html#' + sectionId;
            }
        }
    });
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
});
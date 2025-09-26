// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const container = document.getElementById(elementId);
        container.replaceChildren(...doc.body.children);
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
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

    // After components are loaded, initialize any necessary scripts
    initializeApp();
});
// Component Loader
// Loads reusable HTML components (navbar, footer, etc.)

async function loadComponent(componentName, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return false;

    try {
        const response = await fetch(`components/${componentName}.html`);
        if (!response.ok) throw new Error(`${response.status}`);

        target.innerHTML = await response.text();
        target.classList.add('loaded');
        return true;
    } catch (error) {
        console.error(`Failed to load ${componentName}:`, error);
        return false;
    }
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Desktop nav
    document.querySelectorAll('.nav__links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Mobile nav
    document.querySelectorAll('.nav__mobile-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Load all components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadComponent('navbar', 'navbar-placeholder'),
        loadComponent('footer', 'footer-placeholder')
    ]);

    setActiveNavLink();

    // Re-initialize navigation after navbar is loaded
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
});

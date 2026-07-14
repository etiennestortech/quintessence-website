// Component Loader
// Loads reusable HTML components (navbar, footer, etc.)

async function loadComponent(componentName, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return false;

    try {
        const response = await fetch(`components/${componentName}.html?v=20260611`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`${response.status}`);

        target.innerHTML = await response.text();
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
    const loads = [loadComponent('footer', 'footer-placeholder')];
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        loads.unshift(loadComponent('navbar', 'navbar-placeholder'));
    }

    await Promise.all(loads);

    setActiveNavLink();

    // Re-initialize navigation after navbar is loaded
    if (navbarPlaceholder && typeof initNavigation === 'function') {
        initNavigation();
    }
});

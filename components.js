// Component Loader
// This script loads reusable HTML components (navbar, footer, etc.)

async function loadComponent(componentName, targetId) {
    try {
        const response = await fetch(`components/${componentName}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentName}: ${response.status}`);
        }
        const html = await response.text();
        const target = document.getElementById(targetId);
        if (target) {
            target.innerHTML = html;
        }
    } catch (error) {
        console.error(`Error loading component ${componentName}:`, error);
    }
}

// Load all components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Load navbar and footer
    await Promise.all([
        loadComponent('navbar', 'navbar-placeholder'),
        loadComponent('footer', 'footer-placeholder')
    ]);

    // Re-initialize navigation after navbar is loaded
    // The initNavigation function is defined in script.js
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
});

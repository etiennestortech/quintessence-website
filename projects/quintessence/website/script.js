/* ==========================================================================
   Quintessence Atelier Dentaire - V2 Interactive Scripts
   ========================================================================== */

// Global Lenis instance
let lenis;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis smooth scroll first
    initLenis();

    // Initialize modules
    initNavigation();
    initAnchorLinks();
    initSolutionsTabs();
});

/* --------------------------------------------------------------------------
   Lenis Smooth Scroll + GSAP Integration
   -------------------------------------------------------------------------- */
function initLenis() {
    // Create Lenis instance
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease out expo
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Optional: Add scroll direction class to body
    lenis.on('scroll', ({ direction }) => {
        document.body.setAttribute('data-scroll-direction', direction > 0 ? 'down' : 'up');
    });
}

/* --------------------------------------------------------------------------
   Navigation
   -------------------------------------------------------------------------- */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav__toggle');
    let isMenuOpen = false;
    let lastScrollY = 0;
    const heroHeight = window.innerHeight;
    let hasScrolledPastHero = false;

    // Scroll behavior - show nav on scroll up, hide on scroll down
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const isScrollingUp = currentScrollY < lastScrollY;

        // Track if we've ever scrolled past the hero
        if (currentScrollY > heroHeight) {
            hasScrolledPastHero = true;
        }

        // At the very top - show original absolute nav
        if (currentScrollY <= 10) {
            nav.classList.remove('nav--fixed');
            nav.classList.remove('nav--hidden');
            hasScrolledPastHero = false;
        }
        // Once we've scrolled past hero, use fixed nav behavior everywhere
        else if (hasScrolledPastHero) {
            nav.classList.add('nav--fixed');

            // Scrolling up - show nav
            if (isScrollingUp) {
                nav.classList.remove('nav--hidden');
            }
            // Scrolling down - hide nav
            else {
                nav.classList.add('nav--hidden');
            }
        }

        lastScrollY = currentScrollY;
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            navToggle.classList.toggle('active', isMenuOpen);
            document.body.classList.toggle('menu-open', isMenuOpen);
        });
    }
}

/* --------------------------------------------------------------------------
   Anchor Links (using Lenis)
   -------------------------------------------------------------------------- */
function initAnchorLinks() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Use Lenis for smooth scroll to target
                lenis.scrollTo(target, {
                    offset: -80, // Account for fixed nav
                    duration: 1.2,
                });

                // Close mobile menu if open
                document.body.classList.remove('menu-open');
                document.querySelector('.nav__toggle')?.classList.remove('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Solutions Tabs
   -------------------------------------------------------------------------- */
function initSolutionsTabs() {
    const tabs = document.querySelectorAll('.solutions__tab');
    const contents = document.querySelectorAll('.solutions__content');

    if (tabs.length === 0 || contents.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('solutions__tab--active'));
            contents.forEach(c => c.classList.remove('solutions__content--active'));

            // Add active class to clicked tab
            tab.classList.add('solutions__tab--active');

            // Show corresponding content
            const targetContent = document.querySelector(`.solutions__content[data-content="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('solutions__content--active');
            }
        });
    });
}


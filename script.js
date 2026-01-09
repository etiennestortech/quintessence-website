/* ==========================================================================
   Quintessence Atelier Dentaire - V2 Interactive Scripts
   ========================================================================== */

// Global Lenis instance
let lenis;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis smooth scroll first
    initLenis();

    // Initialize GSAP animations after Lenis
    if (typeof initAnimations === 'function') {
        initAnimations();
    }

    // Initialize modules
    initNavigation();
    initAnchorLinks();
    initSolutionsTabs();
    initVideoModal();
    initApplicationModal();
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
    let lastScrollY = 0;
    const heroHeight = window.innerHeight;
    let hasScrolledPastHero = false;

    function closeMenu() {
        navToggle?.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }

    function openMenu() {
        navToggle?.classList.add('active');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    }

    function isMenuOpen() {
        return document.body.classList.contains('menu-open');
    }

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
            nav?.classList.remove('nav--fixed');
            nav?.classList.remove('nav--hidden');
            hasScrolledPastHero = false;
        }
        // Once we've scrolled past hero, use fixed nav behavior everywhere
        else if (hasScrolledPastHero) {
            nav?.classList.add('nav--fixed');

            // Scrolling up - show nav
            if (isScrollingUp) {
                nav?.classList.remove('nav--hidden');
            }
            // Scrolling down - hide nav
            else {
                nav?.classList.add('nav--hidden');
            }
        }

        lastScrollY = currentScrollY;
    });

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        if (isMenuOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.nav__mobile-links a, .nav__mobile-cta');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
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
                lenis?.scrollTo(target, {
                    offset: -80, // Account for fixed nav
                    duration: 1.2,
                });

                // Close mobile menu if open
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
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
            targetContent?.classList.add('solutions__content--active');
        });
    });
}

/* --------------------------------------------------------------------------
   Video Modal
   -------------------------------------------------------------------------- */
function initVideoModal() {
    const videoTrigger = document.querySelector('[data-video-id]');
    const modal = document.querySelector('.video-modal');
    const modalClose = document.querySelector('.video-modal__close');
    const modalOverlay = document.querySelector('.video-modal__overlay');
    const modalPlayer = document.querySelector('.video-modal__player');

    if (!videoTrigger || !modal) return;

    // Open modal
    videoTrigger.addEventListener('click', () => {
        const videoId = videoTrigger.getAttribute('data-video-id');
        
        // Create Vimeo iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
        iframe.frameBorder = '0';
        iframe.allow = 'autoplay; fullscreen; picture-in-picture';
        iframe.allowFullscreen = true;
        
        modalPlayer.appendChild(iframe);
        
        // Show modal
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Pause Lenis
        if (lenis) lenis.stop();
    });

    // Close modal function
    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Remove iframe
        modalPlayer.innerHTML = '';
        
        // Resume Lenis
        if (lenis) lenis.start();
    }

    // Close on button click
    modalClose.addEventListener('click', closeModal);

    // Close on overlay click
    modalOverlay.addEventListener('click', closeModal);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });
}

/* --------------------------------------------------------------------------
   Application Modal (Careers Page)
   -------------------------------------------------------------------------- */
function initApplicationModal() {
    const modal = document.getElementById('applicationModal');
    if (!modal) return;

    const positionSelect = document.getElementById('applicantPosition');
    const positionBadge = document.getElementById('modalPositionBadge');
    const resumeInput = document.getElementById('applicantResume');
    const resumeDropZone = document.getElementById('resumeDropZone');
    const resumeFileName = document.getElementById('resumeFileName');
    const form = document.getElementById('applicationForm');

    // Open modal
    function openModal(position = '', positionName = '') {
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Pause Lenis
        if (lenis) lenis.stop();

        // Pre-select position if provided
        if (position && positionSelect) {
            positionSelect.value = position;

            // Show position badge if it's a specific position
            if (positionName && positionBadge) {
                positionBadge.textContent = positionName;
                positionBadge.style.display = 'inline-block';
            }
        } else if (positionBadge) {
            positionBadge.style.display = 'none';
        }
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Resume Lenis
        if (lenis) lenis.start();

        // Reset form after animation
        setTimeout(() => {
            form?.reset();
            if (positionBadge) positionBadge.style.display = 'none';
            if (resumeFileName) resumeFileName.textContent = 'PDF ou DOC, max 5 Mo';
        }, 300);
    }

    // Bind open triggers
    const openTriggers = document.querySelectorAll('[data-modal-open="applicationModal"]');
    openTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const position = trigger.getAttribute('data-position') || '';
            const positionName = trigger.getAttribute('data-position-name') || '';
            openModal(position, positionName);
        });
    });

    // Bind close triggers
    const closeTriggers = modal.querySelectorAll('[data-modal-close]');
    closeTriggers.forEach(trigger => {
        trigger.addEventListener('click', closeModal);
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // File upload handling
    if (resumeDropZone && resumeInput) {
        // Click to browse
        resumeDropZone.addEventListener('click', () => {
            resumeInput.click();
        });

        // Handle file selection
        resumeInput.addEventListener('change', () => {
            if (resumeInput.files.length > 0) {
                const file = resumeInput.files[0];
                resumeFileName.textContent = file.name;
                resumeDropZone.classList.add('has-file');
            }
        });

        // Drag and drop
        resumeDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            resumeDropZone.classList.add('dragover');
        });

        resumeDropZone.addEventListener('dragleave', () => {
            resumeDropZone.classList.remove('dragover');
        });

        resumeDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            resumeDropZone.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                const validTypes = ['.pdf', '.doc', '.docx', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

                if (validTypes.some(type => file.type.includes(type) || file.name.toLowerCase().endsWith(type))) {
                    resumeInput.files = files;
                    resumeFileName.textContent = file.name;
                    resumeDropZone.classList.add('has-file');
                }
            }
        });
    }

    // Form submission
    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Here you would typically send the form data to your backend
        // For now, just show a success message
        alert('Merci pour votre candidature! Nous vous contacterons bientôt.');
        closeModal();
    });
}

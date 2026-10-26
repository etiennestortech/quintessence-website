/* ==========================================================================
   Quintessence Atelier Dentaire - V2 Interactive Scripts
   ========================================================================== */

// Global Lenis instance
let lenis;

document.addEventListener('DOMContentLoaded', () => {
    // The hero must also work when the optional scrolling libraries are unavailable.
    initHeroBackgroundVideo();

    // Initialize Lenis smooth scroll first
    initLenis();

    // Initialize GSAP animations after Lenis
    if (typeof initAnimations === 'function' && window.gsap && window.ScrollTrigger) {
        initAnimations();
    }

    // Initialize modules
    initNavigation();
    initAnchorLinks();
    initSolutionsTabs();
    initVideoModal();
    initApplicationModal();
    initTestimonialToggles();
    initGallery();
    initDesignPreviews();
});

/* --------------------------------------------------------------------------
   Lenis Smooth Scroll + GSAP Integration
   -------------------------------------------------------------------------- */
function initLenis() {
    if (!window.Lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
    if (window.gsap && window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    } else {
        function frame(time) {
            lenis.raf(time);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

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
    const navMobileMenu = document.querySelector('.nav__mobile-menu');
    if (!nav || nav.dataset.navigationReady) return;
    nav.dataset.navigationReady = 'true';
    let lastScrollY = 0;
    const heroHeight = window.innerHeight;
    let hasScrolledPastHero = false;

    function closeMenu() {
        navToggle?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
        navMobileMenu?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        navMobileMenu.inert = true;
        if (lenis) lenis.start();
    }

    function openMenu() {
        navToggle?.classList.add('active');
        navToggle?.setAttribute('aria-expanded', 'true');
        navMobileMenu?.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
        navMobileMenu.inert = false;
        if (lenis) lenis.stop();
    }

    function isMenuOpen() {
        return document.body.classList.contains('menu-open');
    }

    navMobileMenu.inert = true;
    document.addEventListener('keydown', (event) => {
        if (!isMenuOpen()) return;
        if (event.key === 'Escape') {
            closeMenu();
            navToggle.focus();
        }
        if (event.key === 'Tab') {
            const controls = [navToggle, ...navMobileMenu.querySelectorAll('a[href]')];
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault(); last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault(); first.focus();
            }
        }
    });
    window.addEventListener('resize', () => {
        if (isMenuOpen() && getComputedStyle(navToggle).display === 'none') closeMenu();
    });

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
                if (lenis) {
                    lenis.scrollTo(target, { offset: -95, duration: 1.2 });
                } else {
                    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
                }

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
   Hero background video + modal playback
   -------------------------------------------------------------------------- */
function initHeroBackgroundVideo() {
    const bgVideo = document.querySelector('.hero__bg-video');
    const embedTarget = bgVideo?.querySelector('.hero__bg-video-embed');
    const videoId = bgVideo?.getAttribute('data-video-id');

    if (!bgVideo || !embedTarget || !videoId) return;

    const hero = bgVideo.closest('.hero');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const introSeconds = 8;
    let player;
    let finished = false;
    let playbackDeadline;

    hero.dataset.heroState = 'tree';
    if (reducedMotion.matches || document.hidden) return;

    hero.dataset.heroState = 'loading';

    function finishIntro() {
        if (finished) return;
        finished = true;
        clearTimeout(loadDeadline);
        clearTimeout(playbackDeadline);
        hero.classList.remove('hero--video-active');
        hero.dataset.heroState = 'tree';
        document.removeEventListener('visibilitychange', onVisibilityChange);
        reducedMotion.removeEventListener('change', onMotionChange);
        hero.removeEventListener('hero:finish', finishIntro);

        player?.pause().catch(() => {});
        // Let the video dissolve away before removing its iframe and network activity.
        window.setTimeout(() => {
            if (player) player.destroy().catch(() => embedTarget.replaceChildren());
            else embedTarget.replaceChildren();
        }, reducedMotion.matches ? 0 : 1000);
    }

    function onVisibilityChange() {
        if (document.hidden) finishIntro();
    }

    function onMotionChange(event) {
        if (event.matches) finishIntro();
    }

    const loadDeadline = window.setTimeout(finishIntro, 15000);
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', onMotionChange);
    hero.addEventListener('hero:finish', finishIntro);

    function startPlayer() {
        if (finished) return;
        if (!window.Vimeo?.Player) {
            finishIntro();
            return;
        }

        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=0&muted=1&autopause=0&playsinline=1&dnt=1`;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('tabindex', '-1');
        iframe.allow = 'autoplay; fullscreen; picture-in-picture';
        iframe.title = 'Vidéo de présentation Quintessence';
        embedTarget.appendChild(iframe);
        player = new Vimeo.Player(iframe);

        player.on('playing', () => {
            if (finished) return;
            clearTimeout(loadDeadline);
            hero.classList.add('hero--video-active');
            hero.dataset.heroState = 'playing';
            // A stalled stream must not leave a frozen video covering the tree forever.
            clearTimeout(playbackDeadline);
            playbackDeadline = window.setTimeout(finishIntro, 12000);
        });
        player.on('timeupdate', ({ seconds }) => {
            if (seconds >= introSeconds) finishIntro();
        });
        player.on('ended', finishIntro);
        player.on('error', finishIntro);
        player.ready().then(() => {
            if (!finished) return player.play();
        }).catch(finishIntro);
    }

    if (window.Vimeo?.Player) startPlayer();
    else {
        const sdk = document.createElement('script');
        sdk.src = 'https://player.vimeo.com/api/player.js';
        sdk.onload = startPlayer;
        sdk.onerror = finishIntro;
        document.head.appendChild(sdk);
    }
}

function clearModalPlayer(modalPlayer) {
    while (modalPlayer.firstChild) {
        modalPlayer.removeChild(modalPlayer.firstChild);
    }
}

function initVideoModal() {
    const modal = document.querySelector('.video-modal');
    const modalClose = document.querySelector('.video-modal__close');
    const modalOverlay = document.querySelector('.video-modal__overlay');
    const modalPlayer = document.querySelector('.video-modal__player');
    const modalTriggers = document.querySelectorAll('[data-video-trigger]');
    let lastVideoTrigger = null;

    if (!modal || modalTriggers.length === 0) return;

    function openModal(videoId, trigger) {
        document.querySelector('.hero')?.dispatchEvent(new Event('hero:finish'));
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
        iframe.setAttribute('frameborder', '0');
        iframe.allow = 'autoplay; fullscreen; picture-in-picture';
        iframe.title = 'Vidéo de présentation Quintessence';

        lastVideoTrigger = trigger;
        modalPlayer.appendChild(iframe);
        modal.setAttribute('aria-hidden', 'false');
        modal.showModal();
        modalClose?.focus();
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
    }

    function closeModal() {
        modal.close();
    }

    modal.addEventListener('close', () => {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        clearModalPlayer(modalPlayer);
        if (lenis) lenis.start();
        lastVideoTrigger?.focus({ preventScroll: true });
        lastVideoTrigger = null;
    });

    modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const videoId = trigger.getAttribute('data-video-id');
            if (videoId) openModal(videoId, trigger);
        });
    });

    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

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

/* --------------------------------------------------------------------------
   Testimonial Expand/Collapse
   -------------------------------------------------------------------------- */
function initTestimonialToggles() {
    document.querySelectorAll('.testimonial__toggle').forEach(btn => {
        const textEl = btn.previousElementSibling;

        // Hide button if text fits without truncation
        if (textEl.scrollHeight <= textEl.clientHeight) {
            btn.style.display = 'none';
            return;
        }

        btn.addEventListener('click', () => {
            const expanded = textEl.classList.toggle('is-expanded');
            btn.textContent = expanded ? 'Réduire' : 'Lire la suite';
            btn.setAttribute('aria-expanded', expanded);
        });
    });
}

/* Portfolio: progressively revealed selection and a native, keyboard-accessible viewer. */
function initGallery() {
    const items = [...document.querySelectorAll('.portfolio-item')];
    const triggers = [...document.querySelectorAll('[data-gallery-open]')];
    const dialog = document.querySelector('.gallery-dialog');
    if (!dialog || !triggers.length) return;
    const more = document.querySelector('[data-gallery-more]');
    const count = document.querySelector('.gallery-count');
    const image = dialog.querySelector('.gallery-dialog__image');
    const caption = dialog.querySelector('.gallery-dialog__caption');
    let visible = 0;
    let selected = 0;
    let lastTrigger;

    function reveal() {
        visible = Math.min(visible + 18, items.length);
        items.forEach((item, index) => { item.hidden = index >= visible; });
        if (more) more.hidden = visible >= items.length;
        if (count) count.textContent = `${visible} réalisations sur ${items.length}`;
    }
    function show(index) {
        selected = (index + triggers.length) % triggers.length;
        image.src = triggers[selected].dataset.image;
        image.alt = triggers[selected].querySelector('img').alt;
        caption.textContent = `${String(selected + 1).padStart(2, '0')} / ${triggers.length} — Quintessence Atelier Dentaire`;
    }
    triggers.forEach((trigger, index) => trigger.addEventListener('click', () => {
        lastTrigger = trigger;
        show(index);
        dialog.showModal();
        if (lenis) lenis.stop();
        document.body.style.overflow = 'hidden';
    }));
    dialog.querySelector('.gallery-dialog__close').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-gallery-prev]').addEventListener('click', () => show(selected - 1));
    dialog.querySelector('[data-gallery-next]').addEventListener('click', () => show(selected + 1));
    dialog.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault(); show(selected + (event.key === 'ArrowLeft' ? -1 : 1));
        }
    });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
        image.removeAttribute('src');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
        lastTrigger?.focus({ preventScroll: true });
    });
    more?.addEventListener('click', reveal);
    reveal();
}

/* Design preview only: no contact, CV or patient data leaves the browser. */
function initDesignPreviews() {
    document.querySelectorAll('[data-design-preview]').forEach((form) => {
        form.querySelector('[data-preview-submit]')?.addEventListener('click', () => {
            for (const field of form.querySelectorAll('input, select, textarea')) {
                if (!field.reportValidity()) return;
            }
            const status = form.querySelector('.form-preview-status');
            status.textContent = 'L’envoi en ligne n’est pas disponible pour le moment. Vous pouvez joindre notre équipe au 514 887-3075 ou à info@quintessence-ad.com.';
        });
    });
    const zone = document.querySelector('.file-upload__zone');
    const input = document.getElementById('files');
    const list = document.querySelector('.file-preview-list');
    if (!zone || !input || !list) return;
    function showFiles() {
        list.replaceChildren();
        [...input.files].forEach((file) => {
            const item = document.createElement('li');
            item.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} Mo`;
            list.appendChild(item);
        });
    }
    zone.addEventListener('click', () => input.click());
    zone.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); input.click(); }
    });
    input.addEventListener('change', showFiles);
    zone.addEventListener('dragover', (event) => { event.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (event) => {
        event.preventDefault(); zone.classList.remove('dragover');
        const allowed = /\.(stl|ply|obj|dcm|dicom|zip)$/i;
        const transfer = new DataTransfer();
        for (const file of event.dataTransfer.files) {
            if (!allowed.test(file.name)) {
                list.replaceChildren();
                const message = document.createElement('li');
                message.textContent = 'Choisissez des fichiers STL, PLY, OBJ, DCM, DICOM ou ZIP.';
                list.appendChild(message);
                return;
            }
            transfer.items.add(file);
        }
        input.files = transfer.files;
        showFiles();
    });
}

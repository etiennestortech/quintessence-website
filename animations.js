/* ==========================================================================
   Quintessence Atelier Dentaire — GSAP Animations
   ========================================================================== */

/* --------------------------------------------------------------------------
   Text Split Utility
   -------------------------------------------------------------------------- */
function splitText(element, type = 'chars') {
    if (!element) return;
    const text = element.textContent;
    element.innerHTML = '';

    if (type === 'chars') {
        const words = text.split(' ');
        const allChars = [];
        words.forEach((word, wordIndex) => {
            const wordWrapper = document.createElement('span');
            wordWrapper.style.display = 'inline-block';
            wordWrapper.style.whiteSpace = 'nowrap';
            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.style.display = 'inline-block';
                charSpan.textContent = char;
                wordWrapper.appendChild(charSpan);
                allChars.push(charSpan);
            });
            element.appendChild(wordWrapper);
            if (wordIndex < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.style.display = 'inline-block';
                spaceSpan.textContent = '\u00A0';
                element.appendChild(spaceSpan);
                allChars.push(spaceSpan);
            }
        });
        return allChars;
    } else {
        const words = text.split(' ');
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.classList.add('split-word');
            span.style.display = 'inline-block';
            span.style.marginRight = index < words.length - 1 ? '0.35em' : '0';
            span.textContent = word;
            element.appendChild(span);
        });
        return element.querySelectorAll('span');
    }
}

/* --------------------------------------------------------------------------
   Lazy Load Images
   -------------------------------------------------------------------------- */
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]');
    if (lazyImages.length === 0) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.tagName === 'IMG') {
                if (el.dataset.src)    { el.src    = el.dataset.src;    el.removeAttribute('data-src'); }
                if (el.dataset.srcset) { el.srcset = el.dataset.srcset; el.removeAttribute('data-srcset'); }
            } else if (el.tagName === 'SOURCE') {
                if (el.dataset.srcset) { el.srcset = el.dataset.srcset; el.removeAttribute('data-srcset'); }
            }
            el.classList.add('loaded');
            observer.unobserve(el);
        });
    }, { rootMargin: '50px 0px', threshold: 0.01 });

    lazyImages.forEach(img => imageObserver.observe(img));
}

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.defaults({ ease: 'power3.out', duration: 0.9 });

    lazyLoadImages();

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
        animateHero();
        animatePageHero();
        animateIdentity();
        animatePhilosophy();
        animateSectionHeaders();
        animateRealisationsGrid();
        animatePillars();
        animateVisionQuote();
        animateTestimonials();
        animateImages();
        animateTimeline();
        animateVisualSeparator();
        animateCTA();
        animateRealisationsCarousel();
        animateStatsCounter();
    });
}

/* --------------------------------------------------------------------------
   Hero — cinematic entrance + parallax
   -------------------------------------------------------------------------- */
function animateHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const backgroundVideo = hero.querySelector('.hero__bg-video');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (backgroundVideo) gsap.set(backgroundVideo, { autoAlpha: 0 });

    if (backgroundVideo) {
        tl.to(backgroundVideo, { autoAlpha: 1, duration: 1.35, ease: 'power2.inOut' }, 0);
    }

    tl.from('.hero__eyebrow', { autoAlpha: 0, y: 14, duration: 0.65 }, 0.2)
      .from('.hero__tagline span', { autoAlpha: 0, y: 36, stagger: 0.12, duration: 0.95 }, 0.4)
      .from('.hero__lede', { autoAlpha: 0, y: 18, duration: 0.75 }, 0.75)
      .from('.hero__cta-row > *', { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.65 }, 0.95)
      .from('.hero__video-trigger', { autoAlpha: 0, y: 12, duration: 0.65 }, 1.2);
}

/* --------------------------------------------------------------------------
   Page Hero (inner pages)
   -------------------------------------------------------------------------- */
function animatePageHero() {
    if (!document.querySelector('.page-hero')) return;

    const tl = gsap.timeline({
        scrollTrigger: { trigger: '.page-hero', start: 'top 78%', once: true },
        defaults: { ease: 'power3.out' },
    });

    tl.from('.page-hero__left .label', { autoAlpha: 0, y: 16, duration: 0.7 })
      .from('.page-hero__left h1',     { autoAlpha: 0, y: 40, duration: 0.9 }, '-=0.35')
      .from('.page-hero__description', { autoAlpha: 0, y: 22, duration: 0.8 }, '-=0.55');
}

/* --------------------------------------------------------------------------
   Identity section (homepage)
   -------------------------------------------------------------------------- */
function animateIdentity() {
    if (!document.querySelector('.identity')) return;

    const contentTl = gsap.timeline({
        scrollTrigger: { trigger: '.identity__content', start: 'top 82%', once: true },
        defaults: { ease: 'power3.out' },
    });

    contentTl
      .from('.identity__content .label', { autoAlpha: 0, x: -22, duration: 0.6 })
      .from('.identity__content .section-rule', { scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: 'power2.inOut' }, '-=0.35')
      .from('.identity__title', { autoAlpha: 0, y: 40, duration: 0.95 }, '-=0.45')
      .from('.identity__content p', { autoAlpha: 0, y: 24, stagger: 0.15, duration: 0.8 }, '-=0.55')
      .from('.identity .stat', { autoAlpha: 0, y: 18, stagger: 0.1, duration: 0.7 }, '-=0.45')
      .from('.identity__content .btn', { autoAlpha: 0, y: 16, duration: 0.7 }, '-=0.35');

    gsap.from('.identity__media', {
        autoAlpha: 0,
        x: 40,
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.identity__media', start: 'top 82%', once: true },
    });
}

function animatePhilosophy() {
    if (!document.querySelector('.philosophy')) return;

    const tl = gsap.timeline({
        scrollTrigger: { trigger: '.philosophy__split', start: 'top 82%', once: true },
        defaults: { ease: 'power3.out' },
    });

    tl.from('.philosophy__media', { autoAlpha: 0, x: -30, duration: 1 })
      .from('.philosophy__content .label', { autoAlpha: 0, y: 16, duration: 0.6 }, '-=0.8')
      .from('.philosophy__content .section-rule', { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: 'power2.inOut' }, '-=0.45')
      .from('.philosophy__title', { autoAlpha: 0, y: 36, duration: 0.9 }, '-=0.5')
      .from('.philosophy__content p', { autoAlpha: 0, y: 20, duration: 0.75 }, '-=0.55')
      .from('.philosophy__value', { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.65 }, '-=0.4');
}

/* --------------------------------------------------------------------------
   Section Headers (shared across pages)
   -------------------------------------------------------------------------- */
function animateSectionHeaders() {
    const headers = gsap.utils.toArray([
        '.section-header',
        '.pillars__header',
        '.solutions__header',
        '.testimonials__header',
        '.realisations__header',
    ].join(', '));

    headers.forEach(header => {
        const label    = header.querySelector('.label');
        const title    = header.querySelector('h2');
        const subtitle = header.querySelector('p');

        const tl = gsap.timeline({
            scrollTrigger: { trigger: header, start: 'top 82%', once: true },
            defaults: { ease: 'power3.out' },
        });

        if (label)    tl.from(label,    { autoAlpha: 0, x: -20, duration: 0.6 });
        if (title)    tl.from(title,    { autoAlpha: 0, y: 45, duration: 1 },   label ? '-=0.3' : 0);
        if (subtitle) tl.from(subtitle, { autoAlpha: 0, y: 24, duration: 0.8 }, '-=0.5');
    });
}

/* --------------------------------------------------------------------------
   Réalisations grid (homepage)
   -------------------------------------------------------------------------- */
function animateRealisationsGrid() {
    if (!document.querySelector('.realisations__grid')) return;

    // batch handles its own once-like behaviour via overwrite
    gsap.set('.realisations__item', { autoAlpha: 0, y: 45 });
    ScrollTrigger.batch('.realisations__item', {
        start: 'top 88%',
        once: true,
        onEnter: batch => gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            overwrite: true,
        }),
    });

    gsap.from('.realisations__cta', {
        autoAlpha: 0,
        y: 22,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.realisations__cta', start: 'top 90%', once: true },
    });
}

/* --------------------------------------------------------------------------
   Pillars — solution cards
   -------------------------------------------------------------------------- */
function animatePillars() {
    if (!document.querySelector('.pillars__grid')) return;

    gsap.set('.solution-card', { autoAlpha: 0, y: 45 });
    ScrollTrigger.batch('.solution-card', {
        start: 'top 88%',
        once: true,
        onEnter: batch => gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.1,
            overwrite: true,
        }),
    });
}

/* --------------------------------------------------------------------------
   Vision — scrub character reveal + founders stagger
   -------------------------------------------------------------------------- */
function animateVisionQuote() {
    const vision = document.querySelector('.vision');
    if (!vision) return;

    const quoteText = vision.querySelector('.vision__quote-text');
    if (quoteText) {
        const chars = splitText(quoteText, 'chars');
        quoteText.style.willChange = 'opacity';
        gsap.set(chars, { opacity: 0.12 });

        // Scrub — no once, runs continuously; clear will-change when fully past
        gsap.to(chars, {
            opacity: 1,
            stagger: { each: 0.02, from: 'start' },
            ease: 'none',
            scrollTrigger: {
                trigger: vision,
                start: 'top 65%',
                end: 'center 35%',
                scrub: 1.2,
                onLeave: () => { quoteText.style.willChange = 'auto'; },
            }
        });
    }

    const founders = gsap.utils.toArray('.vision__founder');
    if (founders.length) {
        gsap.from(founders, {
            autoAlpha: 0,
            y: 40,
            scale: 0.97,
            stagger: { each: 0.2, from: 'start' },
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.vision__founders', start: 'top 82%', once: true },
        });
    }
}

/* --------------------------------------------------------------------------
   Testimonials
   -------------------------------------------------------------------------- */
function animateTestimonials() {
    if (!document.querySelector('.testimonials__grid')) return;

    gsap.set('.testimonial', { autoAlpha: 0, y: 40 });
    ScrollTrigger.batch('.testimonial', {
        start: 'top 88%',
        once: true,
        onEnter: batch => gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.12,
            overwrite: true,
        }),
    });

    const closing = document.querySelector('.testimonials__closing');
    if (closing) {
        gsap.from(closing, {
            autoAlpha: 0,
            y: 22,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: { trigger: closing, start: 'top 90%', once: true },
        });
    }
}

/* --------------------------------------------------------------------------
   Images (identity media, service media)
   -------------------------------------------------------------------------- */
function animateImages() {
    const identityMedia = document.querySelector('.identity__media');
    if (identityMedia) {
        gsap.from('.identity__image', {
            autoAlpha: 0,
            scale: 0.97,
            duration: 1,
            scrollTrigger: { trigger: identityMedia, start: 'top 80%', once: true },
        });
    }

    gsap.utils.toArray('.service__media').forEach(media => {
        gsap.from(media, {
            autoAlpha: 0,
            scale: 0.97,
            duration: 1,
            scrollTrigger: { trigger: media, start: 'top 80%', once: true },
        });
    });
}

/* --------------------------------------------------------------------------
   Timeline (about / history page)
   -------------------------------------------------------------------------- */
function animateTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const progressBar   = timeline.querySelector('.timeline__progress');
    const timelineItems = gsap.utils.toArray('.timeline__item');
    if (!timelineItems.length) return;

    const isMobile = () => window.innerWidth <= 640;

    if (progressBar) {
        const animateProgressBar = () => {
            // Kill by id — reliable regardless of object reference
            ScrollTrigger.getById('timeline-progress')?.kill();

            const mobile = isMobile();
            gsap.set(progressBar, {
                scaleX: mobile ? 1 : 0,
                scaleY: mobile ? 0 : 1,
                transformOrigin: mobile ? 'top center' : 'left center',
            });
            gsap.to(progressBar, {
                [mobile ? 'scaleY' : 'scaleX']: 1,
                ease: 'none',
                scrollTrigger: {
                    id: 'timeline-progress',
                    trigger: timeline,
                    start: 'top 60%',
                    end: 'bottom 40%',
                    scrub: 1,
                }
            });
        };

        animateProgressBar();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(animateProgressBar, 250);
        });
    }

    // Timeline items are created top-to-bottom in DOM order — no refreshPriority needed
    timelineItems.forEach(item => {
        const marker  = item.querySelector('.timeline__marker');
        const content = item.querySelector('.timeline__content');

        const tl = gsap.timeline({
            scrollTrigger: { trigger: item, start: 'top 78%', once: true },
            defaults: { ease: 'power3.out' },
        });

        if (marker)  tl.from(marker,  { scale: 0, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.7)' });
        if (content) tl.from(content, { autoAlpha: 0, y: 22, duration: 0.65 }, '-=0.3');
    });
}

/* --------------------------------------------------------------------------
   Stats Counter
   -------------------------------------------------------------------------- */
function animateStatsCounter() {
    document.querySelectorAll('.stat__number').forEach(stat => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const targetNumber = parseInt(text.replace(/[^0-9]/g, ''), 10);
        if (isNaN(targetNumber)) return;

        let startValue = 0;
        if (targetNumber >= 1000)     startValue = Math.floor(targetNumber * 0.85);
        else if (targetNumber >= 100) startValue = Math.floor(targetNumber * 0.6);

        stat.textContent = hasPlus ? `${startValue}+` : String(startValue);
        const counter = { value: startValue };

        gsap.to(counter, {
            value: targetNumber,
            duration: 3,
            ease: 'sine.out',
            scrollTrigger: { trigger: stat, start: 'top 80%', once: true },
            onUpdate: () => {
                const v = Math.round(counter.value);
                stat.textContent = hasPlus ? `${v}+` : String(v);
            },
        });
    });
}

/* --------------------------------------------------------------------------
   Visual Separator Parallax
   -------------------------------------------------------------------------- */
function animateVisualSeparator() {
    const vs = document.querySelector('.visual-separator');
    if (!vs) return;
    const image = vs.querySelector('.visual-separator__image img');
    if (!image) return;

    // Scrub — runs continuously while in range, no once
    gsap.fromTo(image,
        { yPercent: -8 },
        {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
                trigger: vs,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
            }
        }
    );
}

/* --------------------------------------------------------------------------
   CTA Section
   -------------------------------------------------------------------------- */
function animateCTA() {
    const cta = document.querySelector('.cta');
    if (!cta) return;

    const tl = gsap.timeline({
        scrollTrigger: { trigger: cta, start: 'top 78%', once: true },
        defaults: { ease: 'power3.out' },
    });

    tl.from('.cta__title',        { autoAlpha: 0, y: 35, duration: 0.9 })
      .from('.cta__buttons .btn', { autoAlpha: 0, y: 22, stagger: 0.14, duration: 0.75 }, '-=0.5')
      .from('.cta__decoration',   { autoAlpha: 0, duration: 0.9 }, '-=0.6');
}

/* --------------------------------------------------------------------------
   Réalisations Carousel (réalisations page)
   -------------------------------------------------------------------------- */
function animateRealisationsCarousel() {
    const carousel = document.querySelector('.realisations__carousel');
    if (!carousel) return;

    gsap.from('.realisations__track', {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        scrollTrigger: { trigger: carousel, start: 'top 78%', once: true },
    });
}

/* --------------------------------------------------------------------------
   Expose to script.js
   -------------------------------------------------------------------------- */
if (typeof window !== 'undefined') {
    window.initAnimations = initAnimations;
}

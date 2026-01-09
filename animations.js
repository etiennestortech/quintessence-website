/* ==========================================================================
   Quintessence Atelier Dentaire - GSAP Animations
   Global animation system following GSAP best practices
   ========================================================================== */

/**
 * Text Split Utility
 * Splits text into spans for character/word animation
 */
function splitText(element, type = 'chars') {
    if (!element) return;

    const text = element.textContent;
    const isChars = type === 'chars';

    // Clear the element
    element.innerHTML = '';

    if (isChars) {
        // Split by words first, then characters within each word
        // This prevents words from breaking across lines
        const words = text.split(' ');
        const allChars = [];

        words.forEach((word, wordIndex) => {
            // Create a word wrapper to prevent line breaks within words
            const wordWrapper = document.createElement('span');
            wordWrapper.style.display = 'inline-block';
            wordWrapper.style.whiteSpace = 'nowrap';

            // Split word into characters
            word.split('').forEach((char) => {
                const charSpan = document.createElement('span');
                charSpan.style.display = 'inline-block';
                charSpan.textContent = char;
                wordWrapper.appendChild(charSpan);
                allChars.push(charSpan);
            });

            element.appendChild(wordWrapper);

            // Add space between words (except after last word)
            if (wordIndex < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.style.display = 'inline-block';
                spaceSpan.textContent = '\u00A0';
                element.appendChild(spaceSpan);
                allChars.push(spaceSpan);
            }
        });

        // Return all character spans (not word wrappers)
        return allChars;
    } else {
        // Split by words
        const words = text.split(' ');
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.classList.add('split-word');
            span.style.display = 'inline-block';
            span.style.marginRight = '0.35em'; // Add space between words
            span.textContent = word;
            element.appendChild(span);

            // Remove margin from last word
            if (index === words.length - 1) {
                span.style.marginRight = '0';
            }
        });

        return element.querySelectorAll('span');
    }
}

/**
 * Lazy Load Images
 * Ensures images are loaded before GSAP animations fire
 */
function lazyLoadImages() {
    // Get all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]');

    if (lazyImages.length === 0) return;

    // Create intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                if (element.tagName === 'IMG') {
                    // Handle img elements
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    if (element.dataset.srcset) {
                        element.srcset = element.dataset.srcset;
                        element.removeAttribute('data-srcset');
                    }
                } else if (element.tagName === 'SOURCE') {
                    // Handle source elements in picture tags
                    if (element.dataset.srcset) {
                        element.srcset = element.dataset.srcset;
                        element.removeAttribute('data-srcset');
                    }
                }

                // Mark as loaded
                element.classList.add('loaded');

                // Stop observing this element
                observer.unobserve(element);
            }
        });
    }, {
        // Start loading images slightly before they enter viewport
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Observe all lazy images
    lazyImages.forEach(img => imageObserver.observe(img));
}

/**
 * Initialize all GSAP animations
 * Called after DOM is loaded and Lenis is initialized
 */
function initAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Set default animation properties
    gsap.defaults({
        ease: 'power2.out',
        duration: 1,
    });

    // Initialize lazy loading first
    lazyLoadImages();

    // Initialize animation modules
    animateHero();
    animatePageHero();
    animateSectionHeaders();
    animateImages();
    animateTimeline();
    animateStatsCounter();
    animateVisualSeparator();
    animateCTA();
    animateRealisationsCarousel();
    animateVisionQuote();
}

/* --------------------------------------------------------------------------
   Hero Animation (Homepage)
   -------------------------------------------------------------------------- */
function animateHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const tl = gsap.timeline();

    // Animate hero content - simple line-by-line
    tl.from('.hero__tagline .label', {
        opacity: 0,
        y: 20,
        duration: 0.8,
    })
    .from('.hero__tagline span:not(.label)', {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out',
    }, '-=0.4')
    .from('.hero__description', {
        opacity: 0,
        y: 20,
        duration: 0.8,
    }, '-=0.6')
    .from('.hero__buttons .btn', {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.8,
    }, '-=0.4')
    .from('.hero__video', {
        opacity: 0,
        scale: 0.95,
        duration: 1,
    }, '-=1.2')
    .from('.hero__scroll', {
        opacity: 0,
        y: -20,
        duration: 0.8,
    }, '-=0.6');

    // Parallax effect on background
    gsap.to('.hero__bg-placeholder', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        }
    });
}

/* --------------------------------------------------------------------------
   Page Hero Animation (All other pages)
   -------------------------------------------------------------------------- */
function animatePageHero() {
    const pageHero = document.querySelector('.page-hero');
    if (!pageHero) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.page-hero',
            start: 'top 75%',
        }
    });

    tl.from('.page-hero__left .label', {
        opacity: 0,
        y: 20,
        duration: 0.8,
    })
    .from('.page-hero__left h1', {
        opacity: 0,
        y: 30,
        duration: 0.8,
    }, '-=0.4')
    .from('.page-hero__description', {
        opacity: 0,
        y: 20,
        duration: 0.8,
    }, '-=0.6');
}

/* --------------------------------------------------------------------------
   Section Headers Animation
   -------------------------------------------------------------------------- */
function animateSectionHeaders() {
    const headers = gsap.utils.toArray('.section-header, .identity__content, .pillars__header, .solutions__header, .testimonials__header, .realisations__header');

    headers.forEach(header => {
        const label = header.querySelector('.label');
        const title = header.querySelector('h2, .identity__title, .pillars__title, .solutions__title, .testimonials__title, .realisations__title');
        const subtitle = header.querySelector('.identity__line, p, .solutions__subtitle, .realisations__subtitle');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 75%',
            }
        });

        if (label) {
            tl.from(label, {
                opacity: 0,
                y: 20,
                duration: 0.6,
            });
        }

        if (title) {
            tl.from(title, {
                opacity: 0,
                y: 30,
                duration: 0.8,
            }, label ? '-=0.3' : '0');
        }

        if (subtitle) {
            tl.from(subtitle, {
                opacity: 0,
                y: 20,
                duration: 0.6,
            }, '-=0.4');
        }
    });
}

/* --------------------------------------------------------------------------
   Images Animation
   -------------------------------------------------------------------------- */
function animateImages() {
    // Identity media - simple fade
    const identityMedia = document.querySelector('.identity__media');
    if (identityMedia) {
        gsap.from('.identity__image', {
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: identityMedia,
                start: 'top 75%',
            }
        });
    }

    // Service media - simple fade
    const serviceMedia = gsap.utils.toArray('.service__media');
    serviceMedia.forEach(media => {
        gsap.from(media, {
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: media,
                start: 'top 75%',
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Timeline Animation - Horizontal with Red Progress Bar
   -------------------------------------------------------------------------- */
function animateTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const progressBar = timeline.querySelector('.timeline__progress');
    const timelineItems = gsap.utils.toArray('.timeline__item');
    if (timelineItems.length === 0) return;

    // Detect if we're on mobile (vertical timeline)
    const isMobile = () => window.innerWidth <= 640;

    // Animate the red progress bar on scroll
    if (progressBar) {
        // Check current viewport
        const animateProgressBar = () => {
            // Kill existing ScrollTrigger
            ScrollTrigger.getAll().forEach(st => {
                if (st.vars.trigger === timeline) {
                    st.kill();
                }
            });

            if (isMobile()) {
                // Vertical progress bar on mobile
                gsap.to(progressBar, {
                    height: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: timeline,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        scrub: 1,
                    }
                });
            } else {
                // Horizontal progress bar on desktop
                gsap.to(progressBar, {
                    width: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: timeline,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        scrub: 1,
                    }
                });
            }
        };

        // Initial animation
        animateProgressBar();

        // Re-animate on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                animateProgressBar();
            }, 250);
        });
    }

    // Animate each timeline item
    timelineItems.forEach((item, index) => {
        const marker = item.querySelector('.timeline__marker');
        const content = item.querySelector('.timeline__content');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top 75%',
            }
        });

        // Animate marker - scale in
        if (marker) {
            tl.from(marker, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                ease: 'back.out(1.7)',
            });
        }

        // Animate content - fade + slide up
        if (content) {
            tl.from(content, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power2.out',
            }, '-=0.3');
        }
    });
}

/* --------------------------------------------------------------------------
   Stats Counter Animation
   -------------------------------------------------------------------------- */
function animateStatsCounter() {
    const stats = document.querySelectorAll('.stat__number');
    if (stats.length === 0) return;

    stats.forEach(stat => {
        // Get the target number from the text content
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const targetNumber = parseInt(text.replace(/[^0-9]/g, ''), 10);

        if (isNaN(targetNumber)) return;

        // For large numbers, start closer to the final value
        let startValue = 0;
        if (targetNumber >= 1000) {
            startValue = Math.floor(targetNumber * 0.85); // Start at 85%
        } else if (targetNumber >= 100) {
            startValue = Math.floor(targetNumber * 0.6); // Start at 60%
        }

        // Set initial state
        stat.textContent = hasPlus ? `${startValue}+` : startValue.toString();

        // Create counter object for GSAP to animate
        const counter = { value: startValue };

        gsap.to(counter, {
            value: targetNumber,
            duration: 3,
            ease: 'sine.out',
            scrollTrigger: {
                trigger: stat,
                start: 'top 80%',
                once: true
            },
            onUpdate: () => {
                const currentValue = Math.round(counter.value);
                stat.textContent = hasPlus ? `${currentValue}+` : currentValue.toString();
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Visual Separator Parallax Animation
   -------------------------------------------------------------------------- */
function animateVisualSeparator() {
    const visualSeparator = document.querySelector('.visual-separator');
    if (!visualSeparator) return;

    const image = visualSeparator.querySelector('.visual-separator__image img');
    if (!image) return;

    // Subtle parallax effect on the image
    gsap.to(image, {
        yPercent: 15, // Move image down by 15% as you scroll
        ease: 'none',
        scrollTrigger: {
            trigger: visualSeparator,
            start: 'top bottom', // Start when separator enters viewport
            end: 'bottom top', // End when separator leaves viewport
            scrub: 1, // Smooth scrubbing, takes 1 second to catch up
        }
    });
}

/* --------------------------------------------------------------------------
   CTA Section Animation
   -------------------------------------------------------------------------- */
function animateCTA() {
    const cta = document.querySelector('.cta');
    if (!cta) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: cta,
            start: 'top 75%',
        }
    });

    tl.fromTo('.cta__title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
    )
    .fromTo('.cta__buttons .btn',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6 },
        '-=0.5'
    )
    .fromTo('.cta__decoration',
        { opacity: 0 },
        { opacity: 0.1, duration: 0.8 },
        '-=0.6'
    );
}

/* --------------------------------------------------------------------------
   Realisations Carousel Animation
   -------------------------------------------------------------------------- */
function animateRealisationsCarousel() {
    const carousel = document.querySelector('.realisations__carousel');
    if (!carousel) return;

    // Initial fade in
    gsap.from('.realisations__track', {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: carousel,
            start: 'top 75%',
        }
    });
}

/* --------------------------------------------------------------------------
   Vision Quote Animation - Scroll-Scrub Character Reveal
   -------------------------------------------------------------------------- */
function animateVisionQuote() {
    const vision = document.querySelector('.vision');
    if (!vision) return;

    const quoteText = document.querySelector('.vision__quote-text');
    const visionImage = document.querySelector('.vision__image');
    const visionAuthor = document.querySelector('.vision__author');

    if (quoteText) {
        // Split quote into characters for scroll-based reveal
        const chars = splitText(quoteText, 'chars');

        // Set initial state - low opacity
        gsap.set(chars, {
            opacity: 0.15,
            willChange: 'opacity'
        });

        // Create scroll-scrubbed animation
        // Each character fades in as you scroll through the section
        gsap.to(chars, {
            opacity: 1,
            stagger: {
                each: 0.02,
                from: 'start'
            },
            ease: 'none',
            scrollTrigger: {
                trigger: vision,
                start: 'top 60%',
                end: 'center 40%',
                scrub: 1, // Smooth scrubbing tied to scroll position
            }
        });
    }

    // Set initial states to prevent FOUC
    if (visionImage) {
        gsap.set(visionImage, { opacity: 0, scale: 0.95 });
    }
    if (visionAuthor) {
        gsap.set(visionAuthor, { opacity: 0, y: 20 });
    }

    // Animate image and author normally
    if (visionImage) {
        gsap.to(visionImage, {
            opacity: 1,
            scale: 1,
            duration: 1,
            scrollTrigger: {
                trigger: vision,
                start: 'top 60%',
            }
        });
    }

    if (visionAuthor) {
        gsap.to(visionAuthor, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: vision,
                start: 'top 50%',
            }
        });
    }
}

/* --------------------------------------------------------------------------
   Initialize on DOM Load
   -------------------------------------------------------------------------- */
// Call this after DOMContentLoaded and Lenis initialization
if (typeof window !== 'undefined') {
    // This will be called from script.js
    window.initAnimations = initAnimations;
}

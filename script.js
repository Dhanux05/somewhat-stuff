document.documentElement.classList.add('js');
document.body?.classList.add('intro-active');

document.addEventListener('DOMContentLoaded', () => {
    const introSplash = document.querySelector('.intro-splash');
    const introControlledMedia = [...document.querySelectorAll('.hero-video, .hero-video-mobile, .about-video')];
    const isMediaVisible = media => {
        const styles = window.getComputedStyle(media);
        const rect = media.getBoundingClientRect();
        return styles.display !== 'none' && styles.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const syncIntroMediaPlayback = () => {
        introControlledMedia.forEach(media => {
            if (!isMediaVisible(media) || document.hidden) {
                media.pause();
                return;
            }

            if (media.readyState < 3) {
                media.load();
            }

            const playPromise = media.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
            }
        });
    };
    const hideIntro = () => {
        if (!introSplash) {
            document.body.classList.remove('intro-active');
            syncIntroMediaPlayback();
            return;
        }

        introSplash.classList.add('is-hidden');
        document.body.classList.remove('intro-active');
        syncIntroMediaPlayback();
        window.setTimeout(() => introSplash.remove(), 900);
    };

    if (introSplash) {
        introControlledMedia.forEach(media => media.pause());
    } else {
        syncIntroMediaPlayback();
    }

    if (introSplash) {
        window.setTimeout(hideIntro, 2100);
    }

    window.addEventListener('resize', syncIntroMediaPlayback);
    document.addEventListener('visibilitychange', syncIntroMediaPlayback);

    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const counterItems = document.querySelectorAll('[data-counter]');
    const easeOut = x => 1 - Math.pow(1 - x, 3);

    const animateCounter = element => {
        const valueEl = element.querySelector('.counter-value');
        if (!valueEl) return;
        const target = parseInt(element.dataset.target, 10) || 0;
        const suffix = element.dataset.suffix || '';
        const duration = 1800;
        let start = null;

        const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const current = Math.floor(easeOut(progress) * target);
            valueEl.textContent = `${current}${suffix}`;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    if (counterItems.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counterItems.forEach(item => observer.observe(item));
    }

    const scrollItems = document.querySelectorAll('[data-scroll]');
    if (scrollItems.length) {
        scrollItems.forEach(item => {
            if (item.dataset.delay) {
                item.style.setProperty('--scroll-delay', item.dataset.delay);
            }
        });

        const scrollObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });

        scrollItems.forEach(item => scrollObserver.observe(item));
    }

    const insightCards = document.querySelectorAll('.insight-card');
    if (insightCards.length) {
        const revealInsightCard = card => {
            card.classList.add('is-animated');
        };

        const insightObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealInsightCard(entry.target);
                    insightObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.35,
            rootMargin: '0px 0px -8% 0px'
        });

        insightCards.forEach(card => insightObserver.observe(card));
    }

    const comicNav = document.querySelector('.comic-radio-group');
    const navInputs = comicNav?.querySelectorAll('input[type="radio"]');
    const navLabels = comicNav?.querySelectorAll('label[data-target]');
    const siteHeader = document.querySelector('.site-header');

    if (comicNav && navInputs?.length && navLabels?.length) {
        const setActiveNav = index => {
            comicNav.style.setProperty('--active-index', index);
            navInputs[index].checked = true;
        };

        const getHeaderOffset = () => (siteHeader?.offsetHeight || 0) + 18;

        const scrollToSection = section => {
            if (!section) return;

            const targetTop = window.scrollY + section.getBoundingClientRect().top - getHeaderOffset();
            window.scrollTo({
                top: Math.max(targetTop, 0),
                behavior: 'smooth'
            });
        };

        navLabels.forEach((label, index) => {
            label.addEventListener('click', event => {
                event.preventDefault();
                const sectionId = label.dataset.target;
                const section = document.getElementById(sectionId);
                setActiveNav(index);
                scrollToSection(section);
            });
        });

        const navSections = [...navLabels]
            .map((label, index) => ({
                element: document.getElementById(label.dataset.target),
                index
            }))
            .filter(item => item.element);

        if (navSections.length) {
            const updateActiveNavFromScroll = () => {
                const scrollMarker = window.scrollY + getHeaderOffset() + 24;
                let activeIndex = navSections[0].index;

                navSections.forEach(item => {
                    if (item.element.offsetTop <= scrollMarker) {
                        activeIndex = item.index;
                    }
                });

                setActiveNav(activeIndex);
            };

            updateActiveNavFromScroll();
            window.addEventListener('scroll', updateActiveNavFromScroll, { passive: true });
            window.addEventListener('resize', updateActiveNavFromScroll);
        }
    }

    const addPointerTilt = (element, options = {}) => {
        if (!supportsHover || !element) return;

        const {
            maxRotate = 8,
            moveX = 12,
            moveY = 12,
            lift = 8,
            baseTransform = '',
            invert = false
        } = options;

        const reset = () => {
            element.style.transform = baseTransform;
        };

        reset();

        element.addEventListener('pointermove', event => {
            const rect = element.getBoundingClientRect();
            const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
            const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
            const direction = invert ? -1 : 1;
            const rotateY = offsetX * maxRotate * direction;
            const rotateX = -offsetY * maxRotate * direction;
            const translateX = offsetX * moveX * direction;
            const translateY = offsetY * moveY * direction;
            const transformParts = [];

            if (baseTransform) transformParts.push(baseTransform);
            transformParts.push(
                `translate3d(${translateX}px, ${translateY}px, ${lift}px)`,
                `rotateX(${rotateX}deg)`,
                `rotateY(${rotateY}deg)`
            );

            element.style.transform = transformParts.join(' ');
        });

        element.addEventListener('pointerleave', reset);
    };

    const addMagneticHover = (element, options = {}) => {
        if (!supportsHover || !element) return;

        const {
            strengthX = 8,
            strengthY = 8
        } = options;

        const reset = () => {
            element.style.setProperty('--mx', '0px');
            element.style.setProperty('--my', '0px');
        };

        reset();

        element.addEventListener('pointermove', event => {
            const rect = element.getBoundingClientRect();
            const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
            const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
            const moveX = offsetX * strengthX * 2;
            const moveY = offsetY * strengthY * 2;

            element.style.setProperty('--mx', `${moveX.toFixed(2)}px`);
            element.style.setProperty('--my', `${moveY.toFixed(2)}px`);
        });

        element.addEventListener('pointerleave', reset);
    };

    if (supportsHover) {
        const reactiveElements = document.querySelectorAll([
            '.about-panels article',
            '.impact-card',
            '.testimonial',
            '.insights-grid article',
            '.btn'
        ].join(', '));

        reactiveElements.forEach(element => {
            element.classList.add('cursor-reactive');
            addPointerTilt(element, {
                maxRotate: 5,
                moveX: 8,
                moveY: 8,
                lift: 4
            });
        });

        const generalMagneticElements = document.querySelectorAll([
            '.contact-mark-shell',
            '.contact-socials a'
        ].join(', '));

        generalMagneticElements.forEach(element => {
            addMagneticHover(element, {
                strengthX: 5,
                strengthY: 4
            });
        });

    }

    const whyCards = document.querySelectorAll('.why .glass');
    if (whyCards.length) {
        whyCards.forEach((card, index) => {
            card.addEventListener('mousemove', event => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            });
        });
    }

    const slider = document.querySelector('[data-slider]');
    if (slider) {
        const testimonials = slider.querySelectorAll('.testimonial');
        const viewport = slider.querySelector('.slides-viewport');
        const track = slider.querySelector('.slides');
        const dots = document.querySelectorAll('.dot');
        const buttons = slider.querySelectorAll('.slider-btn');
        let activeIndex = 0;
        let autoplay;

        const getVisibleCards = () => {
            if (window.innerWidth <= 700) return 1;
            if (window.innerWidth <= 1100) return 2;
            return 3;
        };

        const updateSlider = index => {
            const visibleCards = getVisibleCards();
            const maxIndex = Math.max(testimonials.length - visibleCards, 0);
            const clampedIndex = Math.min(index, maxIndex);
            const cardWidth = testimonials[0]?.getBoundingClientRect().width || 0;
            const gap = parseFloat(window.getComputedStyle(track).gap || '0');

            if (track && viewport) {
                track.style.transform = `translateX(-${clampedIndex * (cardWidth + gap)}px)`;
                track.style.transition = 'transform 0.4s ease';
            }

            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === clampedIndex);
                dot.hidden = i > maxIndex;
            });
            activeIndex = clampedIndex;
        };

        const nextSlide = direction => {
            const visibleCards = getVisibleCards();
            const maxIndex = Math.max(testimonials.length - visibleCards, 0);
            const newIndex = (activeIndex + direction + maxIndex + 1) % (maxIndex + 1);
            updateSlider(newIndex);
        };

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const dir = btn.dataset.direction === 'next' ? 1 : -1;
                nextSlide(dir);
                resetAutoplay();
            });
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index, 10);
                updateSlider(index);
                resetAutoplay();
            });
        });

        window.addEventListener('resize', () => updateSlider(activeIndex));

        const startAutoplay = () => {
            autoplay = setInterval(() => nextSlide(1), 6000);
        };

        const resetAutoplay = () => {
            clearInterval(autoplay);
            startAutoplay();
        };

        updateSlider(activeIndex);
        startAutoplay();
    }

});

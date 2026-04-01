document.addEventListener('DOMContentLoaded', () => {
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

    const comicNav = document.querySelector('.comic-radio-group');
    const navInputs = comicNav?.querySelectorAll('input[type="radio"]');
    const navLabels = comicNav?.querySelectorAll('label[data-target]');

    if (comicNav && navInputs?.length && navLabels?.length) {
        const setActiveNav = index => {
            comicNav.style.setProperty('--active-index', index);
            navInputs[index].checked = true;
        };

        navLabels.forEach((label, index) => {
            label.addEventListener('click', event => {
                event.preventDefault();
                const sectionId = label.dataset.target;
                const section = document.getElementById(sectionId);
                setActiveNav(index);
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        const navSections = [...navLabels]
            .map((label, index) => ({
                element: document.getElementById(label.dataset.target),
                index
            }))
            .filter(item => item.element);

        if (navSections.length) {
            const navObserver = new IntersectionObserver(entries => {
                const visibleEntry = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (!visibleEntry) return;

                const match = navSections.find(item => item.element === visibleEntry.target);
                if (match) setActiveNav(match.index);
            }, {
                threshold: [0.35, 0.55, 0.75],
                rootMargin: '-20% 0px -45% 0px'
            });

            navSections.forEach(item => navObserver.observe(item.element));
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
    }

    const whyCards = document.querySelectorAll('.why .glass');
    if (whyCards.length) {
        whyCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('show');
            }, index * 200);

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

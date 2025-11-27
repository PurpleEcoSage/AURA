document.addEventListener('DOMContentLoaded', () => {

    // --- 0. PRELOADER ---
    const counter = document.querySelector('.counter');
    const loaderLine = document.querySelector('.loader-line');
    const preloader = document.querySelector('.preloader');
    let count = 0;
    const interval = setInterval(() => {
        if(count === 100) {
            clearInterval(interval);
            setTimeout(() => { preloader.style.transform = 'translateY(-100%)'; }, 500);
            return;
        }
        count++;
        if(counter) counter.textContent = count + '%';
        if(loaderLine) loaderLine.style.width = count + '%';
    }, 15);

    // --- 1. CURSOR ---
    if (window.matchMedia("(min-width: 769px)").matches) {
        const cursor = document.querySelector('.cursor-blob');
        let mouseX = 0, mouseY = 0, posX = 0, posY = 0;
        document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
        document.querySelectorAll('a, button, .faq-item, .gallery-item, .stream-item, .price-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
        function animateCursor() { 
            posX += (mouseX - posX) * 0.1; posY += (mouseY - posY) * 0.1; 
            if(cursor) { cursor.style.left = posX + 'px'; cursor.style.top = posY + 'px'; }
            requestAnimationFrame(animateCursor); 
        }
        animateCursor();
    }

    // --- LOGO SCROLL TOP ---
    const logo = document.querySelector('.logo');
    if(logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 2. SCROLL ANIMATIONS ---
    const heroLines = document.querySelectorAll('.breathing-text .line');
    const portalContainer = document.querySelector('.portal-container');
    const portalMask = document.querySelector('.portal-mask');
    const portalImage = document.querySelector('.portal-image');
    const step1 = document.querySelector('.step-1');
    const step2 = document.querySelector('.step-2');

    function handleVerticalScroll() {
        const s = window.scrollY;
        const p1 = Math.min(s / window.innerHeight, 1);
        heroLines.forEach((l, i) => { 
            l.style.transform = `translateX(${p1 * 20 * (i%2?-1:1)}px)`; 
            l.style.opacity = Math.max(1 - p1*1.5, 0); 
            l.style.filter = `blur(${p1*10}px)`; 
        });

        if (portalContainer && portalMask) {
            const sectionTop = portalContainer.offsetTop;
            const sectionHeight = portalContainer.offsetHeight;
            const windowHeight = window.innerHeight;
            const distanceScrolled = s - sectionTop;
            const maxScroll = sectionHeight - windowHeight;
            
            if (s >= sectionTop && s <= sectionTop + sectionHeight) {
                let progress = distanceScrolled / maxScroll;
                progress = Math.max(0, Math.min(1, progress));
                let openProgress = Math.min(progress / 0.4, 1);
                portalMask.style.clipPath = `circle(${openProgress * 150}% at 50% 50%)`;
                portalImage.style.transform = `scale(${1.2 - (openProgress * 0.2)})`;

                if (progress < 0.3) {
                    step1.style.opacity = 1; step1.style.transform = 'translateY(0)';
                    step2.style.opacity = 0;
                } else if (progress >= 0.3 && progress < 0.6) {
                    let fadeOut = (progress - 0.3) / 0.3; 
                    step1.style.opacity = 1 - fadeOut;
                    step1.style.transform = `translateY(-${fadeOut * 50}px)`;
                    step2.style.opacity = 0;
                } else {
                    step1.style.opacity = 0;
                    let fadeIn = (progress - 0.6) / 0.3; 
                    fadeIn = Math.min(fadeIn, 1);
                    step2.style.opacity = fadeIn;
                    step2.style.transform = `translateY(${50 - (fadeIn * 50)}px)`;
                }
            }
        }
    }

    // --- 3. HORIZONTAL GALLERY ---
    const hSection = document.querySelector('.horizontal-section');
    const hTrack = document.querySelector('.horizontal-track');
    function handleHorizontalScroll() {
        if (window.innerWidth <= 768 || !hSection) return;
        const top = hSection.offsetTop;
        const height = hSection.offsetHeight;
        const s = window.scrollY;
        if (s >= top && s <= top + height) {
            const target = (hTrack.scrollWidth - window.innerWidth) * Math.min((s - top) / (height - window.innerHeight), 1);
            hTrack.style.transform = `translate3d(-${target}px, 0, 0)`;
        }
    }

    // --- 4. REVEAL ---
    const manifestoTexts = document.querySelectorAll('.manifesto-text p');
    const processSteps = document.querySelectorAll('.process-step');
    function handleScrollReveals() {
        const triggerBottom = window.innerHeight * 0.85;
        manifestoTexts.forEach(p => {
            if(p.getBoundingClientRect().top < triggerBottom) p.classList.add('active');
            else p.classList.remove('active');
        });
        processSteps.forEach(step => {
            if(step.getBoundingClientRect().top < triggerBottom) step.classList.add('active');
        });
    }

    // --- 5. FAQ ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            if(item.classList.contains('active')) answer.style.height = answer.scrollHeight + 'px';
            else answer.style.height = '0';
        });
    });

    // --- 6. PRICING OVERLAY & FORM ---
    const startBtn = document.getElementById('start-btn');
    const pricingOverlay = document.getElementById('pricing-overlay');
    const closeBtn = document.querySelector('.close-pricing');
    const contactSection = document.getElementById('contact');
    const messageInput = document.getElementById('form-message');
    const offerButtons = document.querySelectorAll('.select-offer');
    const contactForm = document.getElementById('contactForm');

    // Open Pricing
    if(startBtn && pricingOverlay) {
        startBtn.addEventListener('click', () => {
            const rect = startBtn.getBoundingClientRect();
            pricingOverlay.style.clipPath = `circle(0% at ${rect.left + rect.width/2}px ${rect.top + rect.height/2}px)`;
            setTimeout(() => { pricingOverlay.style.clipPath = `circle(150% at ${rect.left + rect.width/2}px ${rect.top + rect.height/2}px)`; pricingOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }, 50);
        });
        closeBtn.addEventListener('click', () => {
            pricingOverlay.classList.remove('active');
            pricingOverlay.style.clipPath = `circle(0% at 90% 5%)`;
            document.body.style.overflow = '';
        });
    }

    // Select Offer
    offerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const offerName = btn.getAttribute('data-offer');
            if(pricingOverlay) {
                pricingOverlay.classList.remove('active');
                pricingOverlay.style.clipPath = `circle(0% at 90% 5%)`;
                document.body.style.overflow = '';
            }
            contactSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                messageInput.value = `Bonjour, je souhaite démarrer un projet avec l'offre ${offerName}.\n\nVoici quelques détails sur mon besoin :`;
                messageInput.focus();
            }, 800);
        });
    });

    // Send Form (Mailto)
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;
            const myEmail = "votre-email@gmail.com"; // CHANGEZ CECI
            const subject = `Nouveau projet AURA : ${name}`;
            const body = `Nom: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            window.location.href = `mailto:${myEmail}?subject=${subject}&body=${body}`;
        });
    }

    // --- LOOP ---
    function loop() {
        handleVerticalScroll();
        handleHorizontalScroll();
        handleScrollReveals();
        requestAnimationFrame(loop);
    }
    loop();
});
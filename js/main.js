document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const closeNavBtn = document.getElementById('closeNavBtn');
    const slideNav = document.getElementById('slideNav');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');

    function openNav() {
        slideNav.classList.remove('-translate-x-full');
        navOverlay.classList.remove('opacity-0', 'pointer-events-none');
        navOverlay.classList.add('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        slideNav.classList.add('-translate-x-full');
        navOverlay.classList.add('opacity-0', 'pointer-events-none');
        navOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openNav);
    closeNavBtn.addEventListener('click', closeNav);
    navOverlay.addEventListener('click', closeNav);

    navLinks.forEach(function (link) {
        link.addEventListener('click', closeNav);
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 10;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // Contact form submission
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim()
        };

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showFormStatus('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(formData.email)) {
            showFormStatus('Please enter a valid email address.', 'error');
            return;
        }

        if (SUPABASE_URL.includes('YOUR_PROJECT')) {
            showFormStatus(
                'Supabase is not configured yet. Please set your Supabase credentials in <strong>js/supabase.js</strong> and create a <code>contacts</code> table. See the setup instructions below.',
                'info'
            );
            return;
        }

        setLoading(true);
        showFormStatus('', '');

        try {
            await submitContactForm(formData);
            showFormStatus('Thank you! Your message has been sent successfully. I will get back to you within 24 hours.', 'success');
            contactForm.reset();
        } catch (err) {
            console.error('Form submission error:', err);
            showFormStatus('Something went wrong. Please try again later or email me directly at edleymathias@tolmai.uk', 'error');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(loading) {
        submitBtn.disabled = loading;
        submitText.style.display = loading ? 'none' : 'inline';
        submitSpinner.style.display = loading ? 'inline' : 'none';
    }

    function showFormStatus(message, type) {
        formStatus.className = 'font-body-md text-sm ' + (type === 'error' ? 'text-red-400' : type === 'success' ? 'text-site-teal' : type === 'info' ? 'text-walnut-warmth' : '');
        formStatus.innerHTML = message;
        formStatus.style.display = message ? 'block' : 'none';
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Scroll reveal with IntersectionObserver
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section > div').forEach(el => {
        if (!el.closest('#contact')) {
            el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
            observer.observe(el);
        }
    });
});

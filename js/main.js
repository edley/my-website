document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // Mobile nav toggle
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile nav on outside click
    document.addEventListener('click', function (e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
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

        // Client-side validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showFormStatus('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(formData.email)) {
            showFormStatus('Please enter a valid email address.', 'error');
            return;
        }

        // Check if Supabase is configured
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
        formStatus.className = 'form-status ' + type;
        formStatus.innerHTML = message;
        formStatus.style.display = message ? 'block' : 'none';
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Smooth scroll offset for fixed navbar
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
});
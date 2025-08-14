// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('header');
const revealElements = document.querySelectorAll('.reveal-text');
const yearElement = document.getElementById('currentYear');

// Set current year in footer
yearElement.textContent = new Date().getFullYear();

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Header scroll effect
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
    } else {
        header.style.boxShadow = 'none';
    }

    if (currentScrollY > lastScrollY) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }

    // Only update if there's a significant change to reduce jitter
    if (Math.abs(currentScrollY - lastScrollY) > 10) {
        lastScrollY = currentScrollY;
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for reveal animations
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
);

// Observe all reveal elements
revealElements.forEach(element => {
    revealObserver.observe(element);
});

// GSAP Animations
// Hero section video parallax effect
gsap.timeline({
    scrollTrigger: {
        trigger: '.hero',
        start: "top top", 
        end: "bottom top",
        scrub: true
    }
})
.to('.video-background', { 
    y: 100,
    ease: "none"
})
.to('.video-overlay', {
    opacity: 0.9,
    ease: "none"
}, 0);

// Project cards staggered animation
gsap.set('.project-card', { y: 50, opacity: 0 });
ScrollTrigger.batch('.project-card', {
    interval: 0.1,
    batchMax: 4, 
    onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
    }),
    start: "top 80%"
});

// Contact form animation
gsap.set('.contact-form', { y: 30, opacity: 0 });
ScrollTrigger.create({
    trigger: '.contact-form',
    start: "top 80%",
    onEnter: () => gsap.to('.contact-form', {
        duration: 0.8,
        y: 0,
        opacity: 1,
        ease: "power3.out"
    })
});

// Social links staggered animation
gsap.set('.social-link', { scale: 0, opacity: 0 });
ScrollTrigger.create({
    trigger: '.social-links',
    start: "top 85%",
    onEnter: () => gsap.to('.social-link', {
        duration: 0.6,
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        ease: "back.out(1.7)"
    })
});

// Form submission handler (placeholder)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the data to a server
        console.log('Form submission:', { name, email, message });
        
        // Show submission confirmation
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Basic form validation enhancements
const formInputs = document.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    // Add focus class for styling
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
        // Add 'filled' class if the input has a value
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('filled');
        } else {
            input.parentElement.classList.remove('filled');
        }
    });
});

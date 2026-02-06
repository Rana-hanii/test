/**
 * Contact Page JavaScript
 * Handles: Form validation, Map integration
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // Contact Form Validation
    // ========================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = contactForm.querySelector('[name="name"]');
            const email = contactForm.querySelector('[name="email"]');
            const message = contactForm.querySelector('[name="message"]');
            
            let isValid = true;
            
            if (name && !name.value.trim()) {
                isValid = false;
                name.classList.add('error');
            }
            
            if (email && !email.value.trim()) {
                isValid = false;
                email.classList.add('error');
            }
            
            if (message && !message.value.trim()) {
                isValid = false;
                message.classList.add('error');
            }
            
            if (isValid) {
                // Submit form - backend will handle this
                console.log('Form is valid, submitting...');
                // this.submit();
            }
        });
    }

    // ========================================
    // WOW.js Animations
    // ========================================
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }

    // ========================================
    // BACKEND CUSTOM LOGIC
    // Add your custom API calls and dynamic content below
    // ========================================

});

/**
 * Event Detail Page JavaScript
 * Handles: Event countdown, registration
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // Event Countdown (if needed)
    // ========================================
    const countdownElement = document.querySelector('.event-countdown');
    if (countdownElement) {
        const eventDate = countdownElement.getAttribute('data-date');
        if (eventDate) {
            // Countdown logic here
        }
    }

    // ========================================
    // Event Slider
    // ========================================
    if (document.querySelector('.event-slider')) {
        new Swiper('.event-slider', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
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

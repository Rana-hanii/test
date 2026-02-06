/**
 * About Page JavaScript
 * Handles: Team Slider, Counter animations, WOW animations
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // Partners Slider
    // ========================================
    if (document.querySelector('.partners-slider')) {
        new Swiper('.partners-slider', {
            slidesPerView: 2,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            breakpoints: {
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                992: { slidesPerView: 5 },
                1200: { slidesPerView: 6 },
            },
        });
    }

    // ========================================
    // Testimonial Slider
    // ========================================
    if (document.querySelector('.testimonial-slider')) {
        new Swiper('.testimonial-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            speed: 5000,
            freeMode: true,
            breakpoints: {
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
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

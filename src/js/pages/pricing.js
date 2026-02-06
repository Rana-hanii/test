/**
 * Pricing Page JavaScript
 * Handles: Price toggle, range slider
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // Pricing Toggle (Monthly/Yearly)
    // ========================================
    const pricingToggle = document.querySelector('.pricing-switch input');
    if (pricingToggle) {
        const monthlyPrices = document.querySelectorAll('.monthly-price');
        const yearlyPrices = document.querySelectorAll('.yearly-price');
        const monthlyLabel = document.querySelector('.pricing-switch h5:first-of-type');
        const yearlyLabel = document.querySelector('.pricing-switch h5:last-of-type');

        pricingToggle.addEventListener('change', function() {
            if (this.checked) {
                monthlyPrices.forEach(el => el.style.display = 'none');
                yearlyPrices.forEach(el => el.style.display = 'block');
                monthlyLabel?.classList.remove('active');
                yearlyLabel?.classList.add('active');
            } else {
                monthlyPrices.forEach(el => el.style.display = 'block');
                yearlyPrices.forEach(el => el.style.display = 'none');
                monthlyLabel?.classList.add('active');
                yearlyLabel?.classList.remove('active');
            }
        });
    }

    // ========================================
    // Pricing Slider
    // ========================================
    if (document.querySelector('.pricing-slider')) {
        new Swiper('.pricing-slider', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
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

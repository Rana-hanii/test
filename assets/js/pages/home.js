/**
 * Home Page JavaScript
 * Handles: Sliders, Counters, Isotope filtering, WOW animations
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

    if (document.querySelector('.testimonial-slider-2')) {
        new Swiper('.testimonial-slider-2', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true,
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
    // Professional Instructor Slider
    // ========================================
    if (document.querySelector('.professional-instructor-slider')) {
        new Swiper('.professional-instructor-slider', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
            },
        });
    }

    // ========================================
    // Isotope Filtering (Top Courses)
    // ========================================
    if (typeof Isotope !== 'undefined' && document.querySelector('.grid')) {
        const grid = document.querySelector('.grid');
        const iso = new Isotope(grid, {
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
        });

        const filterButtons = document.querySelectorAll('.top-course-list .list-btn');
        filterButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');
                iso.arrange({ filter: filterValue });
            });
        });
    }

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

/**
 * Courses Grid Page JavaScript
 * Handles: Course filtering, pagination, WOW animations
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ========================================
    // Isotope Filtering
    // ========================================
    if (typeof Isotope !== 'undefined' && document.querySelector('.grid')) {
        const grid = document.querySelector('.grid');
        const iso = new Isotope(grid, {
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
        });

        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');
                iso.arrange({ filter: filterValue });
            });
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
    // Reflect Enrollment State on Grid
    // ========================================
    const courseCards = document.querySelectorAll('.common-post-card');
    const enrolledCourseId = 'course_123'; // Fixed for demo, but could be dynamic

    if (localStorage.getItem('enrolled_' + enrolledCourseId) === 'true') {
        courseCards.forEach(card => {
            const titleLink = card.querySelector('.post-content-title a');
            // In a real app, we'd check against each card's specific ID
            // For this demo, we apply it to the main cards if the user is enrolled in the core course
            if (titleLink && titleLink.textContent.includes('تسوق نفسك')) {
                titleLink.href = 'video-detail.html';
                titleLink.title = 'الذهاب للدروس (أنت مشترك)';
            }
        });

        // Update CTA button if enrolled
        const ctaBtn = document.querySelector('.apply-now-btn .sec-btn');
        if (ctaBtn) {
            const ctaSpan = ctaBtn.querySelector('span');
            if (ctaSpan) ctaSpan.textContent = 'اذهب لدروسك';
            ctaBtn.href = 'video-detail.html';
            ctaBtn.title = 'اذهب لدروسك';
        }
    }

});

/**
 * FAQ Page JavaScript
 * Handles: FAQ Accordion functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // FAQ Accordion
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item, index) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            // Set initial state
            if (index === 0) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
                answer.style.overflow = 'hidden';
            }
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(function(otherItem) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherItem.classList.remove('active');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                });
                
                // Open clicked item if it was closed
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

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

/**
 * Register Page JavaScript
 * Handles: Form validation, password strength
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ========================================
    // Password Visibility Toggle
    // ========================================
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            if (input && (input.type === 'password' || input.type === 'text')) {
                input.type = input.type === 'password' ? 'text' : 'password';
                this.classList.toggle('active');
            }
        });
    });

    // ========================================
    // Register Form Validation
    // ========================================
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            const name = this.querySelector('[name="name"]');
            const email = this.querySelector('[name="email"]');
            const password = this.querySelector('[name="password"]');
            const confirmPassword = this.querySelector('[name="confirm_password"]');

            let isValid = true;

            if (name && !name.value.trim()) {
                isValid = false;
                name.classList.add('error');
            }

            if (email && !email.value.trim()) {
                isValid = false;
                email.classList.add('error');
            }

            if (password && password.value.length < 6) {
                isValid = false;
                password.classList.add('error');
            }

            if (confirmPassword && password && confirmPassword.value !== password.value) {
                isValid = false;
                confirmPassword.classList.add('error');
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // ========================================
    // BACKEND CUSTOM LOGIC
    // Mock Registration and Redirect
    // ========================================
    const registerFormElement = document.querySelector('.register-form');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', function (e) {
            // Prevent actual form submission for this demo
            e.preventDefault();

            const name = this.querySelector('[name="name"]').value;
            const email = this.querySelector('[name="email"]').value;
            const password = this.querySelector('[name="password"]').value;

            if (name && email && password) {
                // Mock registration success
                localStorage.setItem('isLoggedIn', 'true');

                // Check for return URL
                const returnUrl = sessionStorage.getItem('returnUrl');

                if (returnUrl) {
                    sessionStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                } else {
                    // Normal registration redirect
                    window.location.href = 'index.html';
                }
            }
        });
    }

});

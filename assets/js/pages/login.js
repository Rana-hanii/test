/**
 * Login Page JavaScript
 * Handles: Form validation, password toggle
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ========================================
    // Password Visibility Toggle
    // ========================================
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const passwordInput = document.querySelector('input[type="password"], input[name="password"]');
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('active');
            }
        });
    }

    // ========================================
    // Login Form Validation
    // ========================================
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            const email = this.querySelector('[name="email"]');
            const password = this.querySelector('[name="password"]');

            let isValid = true;

            if (email && !email.value.trim()) {
                isValid = false;
                email.classList.add('error');
            }

            if (password && !password.value.trim()) {
                isValid = false;
                password.classList.add('error');
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // ========================================
    // BACKEND CUSTOM LOGIC
    // Mock Login and Redirect
    // ========================================
    const loginFormElement = document.querySelector('.login-form');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function (e) {
            // Prevent actual form submission for this demo
            e.preventDefault();

            const email = this.querySelector('[name="email"]').value;
            const password = this.querySelector('[name="password"]').value;

            if (email && password) {
                // Mock login success
                localStorage.setItem('isLoggedIn', 'true');

                // Check for return URL
                const returnUrl = sessionStorage.getItem('returnUrl');

                if (returnUrl) {
                    sessionStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                } else {
                    // Normal login redirect
                    window.location.href = 'index.html';
                }
            }
        });
    }

});

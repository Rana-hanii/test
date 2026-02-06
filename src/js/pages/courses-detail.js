/* Courses Detail Page Interaction Logic */
document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const mainJoinBtn = document.getElementById('mainJoinBtn');
    const authButtons = document.getElementById('authButtons');

    // Toggle "Subscribe Now" button to show Auth Options
    if (mainJoinBtn && authButtons) {
        // Check initial state - if authButtons is already visible (display: flex), 
        // we might want to hide mainJoinBtn or keep it. 
        // Assuming the standard flow is: Click Subscribe -> Show Options.

        mainJoinBtn.addEventListener('click', function (e) {
            e.preventDefault();
            $(this).slideUp(); // Using jQuery since it's available in the project features
            $(authButtons).css('display', 'flex').hide().slideDown();
        });
    }

    // Handle Login Button Click (Handles duplicates if present in modal)
    const loginBtns = document.querySelectorAll('#btnLogin');
    loginBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    });

    // Handle No Account (Register) Button Click (Handles duplicates)
    const noAccountBtns = document.querySelectorAll('#btnNoAccount');
    noAccountBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    });
});

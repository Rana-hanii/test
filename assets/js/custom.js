/*==========

Theme Name: Courseshub - Online Courses & Education HTML5 Template

==========*/

/*==========
----- JS INDEX -----
1.Whole Script Strict Mode Syntax
2.Loader JS
3.WoW Animation Js
4.header search button js
5.Sticky Header JS
6.Toogle Menu Mobile JS
7.Submenu Mobile JS
8.Animated Text Circle JS
9.Partners Slider JS
10.Top Course Tabbing JS
11.Testimonial Slider JS
12.Reverse Direction Testimonial Slider JS
13.Professional Instructor Slider Slider JS
14.Event Sponsor Slider JS
15.Pricing Switch JS
16.Dynamic date Js
17.FAQ Js

==========*/

jQuery(document).ready(function ($) {
    // Whole Script Strict Mode Syntax
    "use strict";

    // Detect simple pages (auth, profile) to skip heavy animations
    var isSimplePage = /\/(login|register|profile|video-detail)\.html/.test(window.location.pathname) ||
                       document.querySelector('.auth-section, .profile-section, .video-detail-section');

    // Debounce helper to prevent multiple reflows
    function debounce(func, wait) {
        var timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    // Throttle helper for scroll events
    function throttle(func, limit) {
        var inThrottle;
        return function() {
            if (!inThrottle) {
                func.apply(this, arguments);
                inThrottle = true;
                setTimeout(function() { inThrottle = false; }, limit);
            }
        };
    }

    // Cache window width to avoid forced reflows
    var cachedWindowWidth = window.innerWidth;
    $(window).on('resize', debounce(function() {
        cachedWindowWidth = window.innerWidth;
    }, 100));

    // Loader JS Start
    function hideLoader() {
        $(".loader-box").fadeOut(300, function() {
            $("body").removeClass("fixed");
        });
    }
    
    // Try to hide on window load
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        $(window).on('load', hideLoader);
    }
    
    // Fallback: hide loader after 3 seconds max
    setTimeout(hideLoader, 3000);
    // Loader JS End

    // Wow Animation JS Start - Skip on simple pages for faster load
    if (!isSimplePage && typeof WOW !== 'undefined' && $('.wow').length > 0) {
        // Defer WOW init to avoid blocking
        requestAnimationFrame(function() {
            new WOW({ mobile: false }).init();
        });
    }
    // Wow Animation JS End

    // header search button js Start
    $("body .search-icon-box a").on("click", function (e) {
        //open popup on click of search icon
        e.preventDefault(); // Prevent the default action of the anchor tag
        var $searchBox = $(".search-wp");

        if ($searchBox.hasClass("active")) {
            $(".search-wp").removeClass("active");
        } else {
            $(".search-wp").addClass("active");
        }
    });

    // Hide drop-down-search if clicked outside
    $(document).on("click", function (event) {
        var $searchBox = $(".search-wp");
        var $searchIcon = $(".search-icon-box");

        // Check if the click was outside the search box and icon
        if (!$searchBox.is(event.target) && $searchBox.has(event.target).length === 0 && !$searchIcon.is(event.target) && $searchIcon.has(event.target).length === 0) {
            if ($searchBox.hasClass("active")) {
                $searchBox.removeClass("active");
            }
        }
    });
    // header search button js End

    // Sticky Header JS Start - Optimized with throttle & RAF
    var lastScrollTop = 0;
    var isSticky = false;
    var $siteHeader = $(".site-header");
    
    function updateStickyHeader() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var shouldBeSticky = scrollTop >= 100;
        
        if (shouldBeSticky !== isSticky) {
            isSticky = shouldBeSticky;
            requestAnimationFrame(function() {
                if (isSticky) {
                    $siteHeader.addClass("sticky-header");
                } else {
                    $siteHeader.removeClass("sticky-header");
                }
            });
        }
        lastScrollTop = scrollTop;
    }
    
    // Use passive listener for better scroll performance
    window.addEventListener("scroll", throttle(updateStickyHeader, 50), { passive: true });
    // Sticky Header JS End

    // Toogle Menu Mobile JS Start
    $(".toggle-button").on("click", function () {
        $(".main-navigation").toggleClass("toggle-menu");
        $(".header-menu .black-shadow").fadeToggle();
        $(".main-navigation ul li.sub-items").removeClass("active-sub-menu").find("ul").slideUp();
    });

    $(".main-navigation ul li a").on("click", function () {
        if (!$(this).parent().hasClass("sub-items")) {
            // Close the menu when non-submenu links are clicked
            $(".main-navigation").removeClass("toggle-menu");
            $(".header-menu .black-shadow").fadeOut();
        }
    });

    $(".header-menu .black-shadow").on("click", function () {
        $(this).fadeOut();
        $(".main-navigation").removeClass("toggle-menu");
    });

    // Toogle Menu Mobile JS End

    // Submenu For Mobile JS Start - Use cached width
    if (cachedWindowWidth < 992) {
        $("body").on("click", ".main-navigation ul li.sub-items > a", function (e) {
            e.preventDefault();
            const $clickedItem = $(this).parent();
            $(".main-navigation ul li.sub-items").not($clickedItem).removeClass("active-sub-menu").find("ul").slideUp();
            $clickedItem.toggleClass("active-sub-menu").find("ul").slideToggle();
        });
    }
    // Submenu For Mobile JS End

    // Animated Text Circle JS Start - Only init if exists
    if ($(".certification-text").length > 0) {
        var $text = $(".certification-text");
        var text = $text.text().trim();
        var chars = Array.from(text);
        var totalChars = chars.length;
        var anglePerChar = 360 / totalChars;
        $text.html(
            chars.map(function (char, i) {
                return '<span style="transform:rotate(' + (i * anglePerChar) + 'deg)">' + char + '</span>';
            }).join("")
        );
    }
    // Animated Text Circle JS End

    //  Partners Slider JS Start - Only init if exists
    if ($(".partners-slider").length > 0) {
        var partners_slider = new Swiper(".partners-slider", {
            slidesPerView: 8,
            spaceBetween: 30,
            loop: true,
            speed: 1500,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            breakpoints: {
                0: { slidesPerView: 2 },
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1200: { slidesPerView: 5 },
                1400: { slidesPerView: 6 },
                1920: { slidesPerView: 8 },
            },
        });
        $(".partners-slider").hover(
            function () { partners_slider.autoplay.stop(); },
            function () { partners_slider.autoplay.start(); }
        );
    }
    //  Partners Slider JS End

    //  Top Course Tabbing JS Start - Only init if section exists
    var $box;
    if ($(".top-course-sec").length > 0 && $(".grid").length > 0) {
        $box = $(".grid").isotope({
            itemSelector: ".grid-item",
            layoutMode: "fitRows",
            onLayout: setEqualHeight,
        });

        function getColumnCount() {
            if (cachedWindowWidth >= 1200) return 3;
            if (cachedWindowWidth >= 768) return 2;
            return 1;
        }

        // Batched setEqualHeight using requestAnimationFrame
        var setEqualHeightPending = false;
        function setEqualHeight() {
            if (setEqualHeightPending) return;
            setEqualHeightPending = true;
            
            requestAnimationFrame(function() {
                var $items = $(".grid-item");
                if ($items.length === 0) {
                    setEqualHeightPending = false;
                    return;
                }
                
                // Reset heights first
                $items.css("height", "auto");
                
                // Batch read all heights
                var heights = [];
                $items.each(function() {
                    heights.push($(this).outerHeight());
                });
                
                // Group by rows and find max
                var colCount = getColumnCount();
                var rows = [];
                for (var i = 0; i < heights.length; i++) {
                    var rowIndex = Math.floor(i / colCount);
                    if (!rows[rowIndex]) rows[rowIndex] = { maxHeight: 0, items: [] };
                    rows[rowIndex].items.push($items.eq(i));
                    if (heights[i] > rows[rowIndex].maxHeight) {
                        rows[rowIndex].maxHeight = heights[i];
                    }
                }
                
                // Batch write all heights
                rows.forEach(function(row) {
                    row.items.forEach(function($item) {
                        $item.css("height", row.maxHeight + "px");
                    });
                });
                
                setEqualHeightPending = false;
            });
        }

        $(window).on("resize load", debounce(setEqualHeight, 150));

        $(".top-course-list").on("click", "button", function () {
            var filterValue = $(this).attr("data-type");
            $(".list-btn").removeClass("active");
            $(this).addClass("active");
            if (filterValue !== "*") {
                filterValue = '[data-type="' + filterValue + '"]';
            }
            $box.isotope({ filter: filterValue });
        });
    }
    //  Top Course Tabbing JS End

    //  Testimonial Slider JS Start - Only init if exists
    if ($(".testimonial-slider").length > 0) {
        var testimonials_slider = new Swiper(".testimonial-slider", {
            spaceBetween: 24,
            slidesPerView: 4,
            loop: true,
            allowTouchMove: false,
            speed: 10000,
            autoplay: { delay: 0, disableOnInteraction: false },
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 2 },
                1200: { slidesPerView: 2 },
                1400: { slidesPerView: 3 },
                1920: { slidesPerView: 4 },
            },
        });
    }
    //  Testimonial Slider JS End

    //  Reverse Direction Testimonial Slider JS Start - Only init if exists
    if ($(".testimonial-slider-2").length > 0) {
        var testimonials_slider_2 = new Swiper(".testimonial-slider-2", {
            spaceBetween: 24,
            slidesPerView: 4,
            loop: true,
            allowTouchMove: false,
            speed: 10000,
            autoplay: { delay: 0, disableOnInteraction: false, reverseDirection: true },
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 2 },
                1200: { slidesPerView: 2 },
                1400: { slidesPerView: 3 },
                1920: { slidesPerView: 4 },
            },
        });
    }
    //  Reverse Direction Testimonial Slider JS End

    //  Professional Instructor Slider JS Start - Only init if exists
    if ($(".professional-instructor-slider").length > 0) {
        var professional_instructor_slider = new Swiper(".professional-instructor-slider", {
            slidesPerView: 3,
            spaceBetween: 24,
            direction: "horizontal",
            effect: "slide",
            loop: true,
            speed: 1500,
            parallax: true,
            autoplay: { delay: 3000, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 3 },
                1920: { slidesPerView: 3 },
            },
        });
        $(".professional-instructor-slider").hover(
            function () { professional_instructor_slider.autoplay.stop(); },
            function () { professional_instructor_slider.autoplay.start(); }
        );
    }
    //  Professional Instructor Slider JS End

    //  Event Sponsor Slider JS Start - Only init if exists
    if ($(".event-sponsor-slider").length > 0) {
        var event_sponsor_slider = new Swiper(".event-sponsor-slider", {
            slidesPerView: 4,
            spaceBetween: 30,
            loop: true,
            speed: 1500,
            autoplay: { delay: 2000, disableOnInteraction: false },
            breakpoints: {
                0: { slidesPerView: 2 },
                480: { slidesPerView: 3 },
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
                1400: { slidesPerView: 4 },
                1920: { slidesPerView: 4 },
            },
        });
        $(".event-sponsor-slider").hover(
            function () { event_sponsor_slider.autoplay.stop(); },
            function () { event_sponsor_slider.autoplay.start(); }
        );
    }
    //  Event Sponsor Slider JS End

    // Pricing Switch JS Start - Only init if exists
    if ($("#price_check").length > 0) {
        function check() {
            var price_check = $("#price_check");
            var annually_text = $(".annually_text");
            var monthly_text = $(".monthly_text");
            var monthly_switch_text = $(".monthly-switch-text");
            var year_switch_text = $(".Yearly-switch-text");

            annually_text.each(function (index) {
                if (price_check.is(":checked")) {
                    $(this).hide();
                    monthly_text.eq(index).show();
                    monthly_switch_text.eq(index).removeClass("active");
                    year_switch_text.eq(index).addClass("active");
                } else {
                    $(this).show();
                    monthly_text.eq(index).hide();
                    monthly_switch_text.eq(index).addClass("active");
                    year_switch_text.eq(index).removeClass("active");
                }
            });
        }
        $(document).on("change", "#price_check", check);
        check();
    }
    // Pricing Switch JS End

    // Dynamic date Js Start
    $("#copy-right-year").html(new Date().getFullYear());
    // Dynamic date Js End

    // FAQ Js Start - Only init if exists
    if ($(".faq-accordian").length > 0) {
        $(".faq-accordian .faq-box-text").hide();
        $(".faq-accordian").each(function () {
            $(this).find("> div:eq(0)").addClass("active");
            $(this).find("> div:eq(0) .faq-box-text").slideDown();
        });
        $(".faq-accordian h3").click(function (j) {
            var dropDown = $(this).closest("div").find(".faq-box-text");
            $(this).closest(".faq-accordian").find(".faq-box-text").not(dropDown).slideUp();
            if ($(this).parent(".faq-box").hasClass("active")) {
                $(this).parent(".faq-box").removeClass("active");
            } else {
                $(this).closest(".faq-accordian").find(".faq-box.active").removeClass("active");
                $(this).parent(".faq-box").addClass("active");
            }
            dropDown.stop(false, true).slideToggle();
            j.preventDefault();
        });
    }
    // FAQ Js End

    // Profile Page JS Start - Only init if profile elements exist
    if ($(".profile-nav-link").length > 0) {
        $(".profile-nav-link").on("click", function (e) {
            e.preventDefault();
            var tabId = $(this).data("tab");
            
            // Update nav active state
            $(".profile-nav-link").removeClass("active");
            $(this).addClass("active");
            
            // Switch tab content with CSS classes for smooth animation
            $(".profile-tab-content").removeClass("active");
            $("#" + tabId).addClass("active");
        });

        $(".courses-tab-btn").on("click", function () {
            var coursesTabId = $(this).data("courses-tab");
            $(".courses-tab-btn").removeClass("active");
            $(this).addClass("active");
            $(".courses-tab-content").hide();
            $("#" + coursesTabId + "-courses").fadeIn(300);
        });

        $(".profile-form").on("submit", function (e) {
            e.preventDefault();
            var isValid = true;
            $(this).find("input[required]").each(function () {
                if ($(this).val().trim() === "") {
                    isValid = false;
                    $(this).addClass("is-invalid");
                } else {
                    $(this).removeClass("is-invalid");
                }
            });
            if (isValid) alert("تم تحديث الملف بنجاح!");
        });

        $(".password-form").on("submit", function (e) {
            e.preventDefault();
            var currentPassword = $("#currentPassword").val();
            var newPassword = $("#newPassword").val();
            var confirmNewPassword = $("#confirmNewPassword").val();
            var isValid = true;

            if (currentPassword.trim() === "") { $("#currentPassword").addClass("is-invalid"); isValid = false; }
            else { $("#currentPassword").removeClass("is-invalid"); }

            if (newPassword.trim() === "") { $("#newPassword").addClass("is-invalid"); isValid = false; }
            else { $("#newPassword").removeClass("is-invalid"); }

            if (confirmNewPassword.trim() === "") {
                $("#confirmNewPassword").addClass("is-invalid"); isValid = false;
            } else if (newPassword !== confirmNewPassword) {
                $("#confirmNewPassword").addClass("is-invalid");
                alert("كلمة المرور الجديدة غير متطابقة!"); isValid = false;
            } else { $("#confirmNewPassword").removeClass("is-invalid"); }

            if (isValid) { alert("تم تحديث كلمة المرور بنجاح!"); $(this)[0].reset(); }
        });

        $(".profile-form input, .password-form input").on("focus", function () {
            $(this).removeClass("is-invalid");
        });
    }
    // Profile Page JS End

    // Video Detail Page JS Start - Only init if video elements exist
    if ($(".video-detail-section").length > 0) {
        $(".module-header").on("click", function () {
            var $module = $(this).closest(".module-item");
            var $lessonsList = $module.find(".lessons-list");
            $module.toggleClass("active");
            $lessonsList.slideToggle(300);
            var $arrow = $(this).find(".module-arrow i");
            if ($module.hasClass("active")) {
                $arrow.removeClass("fa-chevron-down").addClass("fa-chevron-up");
            } else {
                $arrow.removeClass("fa-chevron-up").addClass("fa-chevron-down");
            }
        });

        $(".lesson-item").on("click", function () {
            $(".lesson-item").removeClass("active");
            $(this).addClass("active");
        });

        function updateCourseProgress() {
            var totalLessons = $(".lesson-item").length;
            var completedLessons = $(".lesson-item.completed").length;
            if (totalLessons > 0) {
                var progressPercent = Math.round((completedLessons / totalLessons) * 100);
                $(".video-progress-bar .progress-bar").css("width", progressPercent + "%");
                $(".video-progress-text").text(progressPercent + "% مكتمل");
            }
        }

        $(".complete-lesson-btn").on("click", function () {
            var $currentLesson = $(".lesson-item.active");
            if ($currentLesson.length) {
                $currentLesson.addClass("completed");
                $currentLesson.find(".lesson-status i").removeClass("fa-circle").addClass("fa-check-circle");
                updateCourseProgress();
                var $nextLesson = $currentLesson.next(".lesson-item");
                if ($nextLesson.length) {
                    $currentLesson.removeClass("active");
                    $nextLesson.addClass("active");
                }
                alert("تم إنهاء المحاضرة بنجاح!");
            }
        });

        updateCourseProgress();
    }
    // Video Detail Page JS End
});

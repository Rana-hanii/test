/**
 * Search Dropdown Functionality
 * Provides live search results as user types
 */

(function () {
    'use strict';

    // Sample course data - In production, this would come from an API
    const coursesData = [
        {
            id: 1,
            title: 'تطوير تطبيقات الويب',
            category: 'البرمجة',
            price: '299 ر.س',
            image: 'assets/images/top-course-1.jpg',
            url: 'courses-detail.html'
        },
        {
            id: 2,
            title: 'التسويق الرقمي المتقدم',
            category: 'التسويق',
            price: '199 ر.س',
            image: 'assets/images/top-course-2.jpg',
            url: 'courses-detail.html'
        },
        {
            id: 3,
            title: 'إدارة المشاريع الاحترافية',
            category: 'إدارة الأعمال',
            price: '399 ر.س',
            image: 'assets/images/top-course-3.jpg',
            url: 'courses-detail.html'
        },
        {
            id: 4,
            title: 'تصميم واجهات المستخدم UI/UX',
            category: 'التصميم',
            price: '249 ر.س',
            image: 'assets/images/category-image-1.jpg',
            url: 'courses-detail.html'
        },
        {
            id: 5,
            title: 'تحليل البيانات باستخدام Python',
            category: 'علوم البيانات',
            price: '349 ر.س',
            image: 'assets/images/category-image-2.jpg',
            url: 'courses-detail.html'
        },
        {
            id: 6,
            title: 'أساسيات التصوير الفوتوغرافي',
            category: 'التصوير',
            price: '149 ر.س',
            image: 'assets/images/category-image-3.jpg',
            url: 'courses-detail.html'
        }
    ];

    // Debounce function to limit API calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Search function
    function searchCourses(query) {
        if (!query || query.length < 2) {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();

        return coursesData.filter(course => {
            return (
                course.title.toLowerCase().includes(normalizedQuery) ||
                course.category.toLowerCase().includes(normalizedQuery)
            );
        });
    }

    // Render search results
    function renderResults(results, container, dropdown) {
        const resultsList = container.querySelector('.search-results-list');
        const noResults = container.querySelector('.search-no-results');
        const loading = container.querySelector('.search-loading');

        // Hide loading
        loading.style.display = 'none';

        if (results.length === 0) {
            resultsList.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        let html = results.map(course => `
            <a href="${course.url}" class="search-result-item" data-id="${course.id}">
                <div class="search-result-thumb">
                    <img src="${course.image}" alt="${course.title}" loading="lazy">
                </div>
                <div class="search-result-info">
                    <div class="search-result-title">${course.title}</div>
                    <div class="search-result-category">
                        <i class="fa-solid fa-folder"></i>
                        ${course.category}
                    </div>
                </div>
                <div class="search-result-price">${course.price}</div>
            </a>
        `).join('');

        // Add "View All" button if there are results
        html += `<a href="courses-grid.html?search=${encodeURIComponent(dropdown.searchQuery)}" class="search-view-all">
            عرض جميع النتائج (${results.length})
        </a>`;

        resultsList.innerHTML = html;
    }

    // Initialize search dropdown for an input
    function initSearchDropdown(input, dropdown) {
        if (!input || !dropdown) return;

        const loading = dropdown.querySelector('.search-loading');
        const resultsList = dropdown.querySelector('.search-results-list');
        const noResults = dropdown.querySelector('.search-no-results');

        // Store search query on dropdown for "View All" link
        dropdown.searchQuery = '';

        // Handle input
        const handleSearch = debounce(function (e) {
            const query = e.target.value.trim();
            dropdown.searchQuery = query;

            if (query.length < 2) {
                dropdown.classList.remove('show');
                return;
            }

            // Show loading
            loading.style.display = 'block';
            noResults.style.display = 'none';
            resultsList.innerHTML = '';
            dropdown.classList.add('show');

            // Simulate API delay (remove in production with real API)
            setTimeout(() => {
                const results = searchCourses(query);
                renderResults(results, dropdown, dropdown);
            }, 300);
        }, 300);

        input.addEventListener('input', handleSearch);

        // Show dropdown on focus if there's a query
        input.addEventListener('focus', function () {
            if (this.value.trim().length >= 2) {
                dropdown.classList.add('show');
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Keyboard navigation
        let activeIndex = -1;

        input.addEventListener('keydown', function (e) {
            const items = dropdown.querySelectorAll('.search-result-item');

            if (!dropdown.classList.contains('show') || items.length === 0) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    activeIndex = Math.min(activeIndex + 1, items.length - 1);
                    updateActiveItem(items, activeIndex);
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    activeIndex = Math.max(activeIndex - 1, 0);
                    updateActiveItem(items, activeIndex);
                    break;

                case 'Enter':
                    if (activeIndex >= 0 && items[activeIndex]) {
                        e.preventDefault();
                        items[activeIndex].click();
                    }
                    break;

                case 'Escape':
                    dropdown.classList.remove('show');
                    activeIndex = -1;
                    break;
            }
        });

        function updateActiveItem(items, index) {
            items.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });

            // Scroll active item into view
            if (items[index]) {
                items[index].scrollIntoView({ block: 'nearest' });
            }
        }
    }

    // Initialize all search dropdowns on page
    function init() {
        // Desktop header search
        const desktopSearchInput = document.getElementById('desktopSearchInput');
        const desktopDropdown = document.getElementById('desktopSearchDropdown');

        if (desktopSearchInput && desktopDropdown) {
            initSearchDropdown(desktopSearchInput, desktopDropdown);
        }

        // Fallback for old ID (index.html compatibility)
        const headerSearchInput = document.getElementById('headerSearchInput');
        const headerDropdown = document.getElementById('searchResultsDropdown');

        if (headerSearchInput && headerDropdown) {
            initSearchDropdown(headerSearchInput, headerDropdown);
        }

        // Mobile search (if exists with dropdown)
        const mobileSearchInputs = document.querySelectorAll('.search-input.for-mobile .form-input');
        mobileSearchInputs.forEach(input => {
            const dropdown = input.closest('.search-input-box')?.querySelector('.search-results-dropdown');
            if (dropdown) {
                initSearchDropdown(input, dropdown);
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

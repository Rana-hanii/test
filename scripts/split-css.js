/**
 * CSS Splitter Script
 * Splits style.css so each page file contains common + that page's specific CSS (no separate common.css)
 */

const fs = require('fs');
const path = require('path');

const SOURCE_CSS = path.join(__dirname, '../assets/css/style.css');
const OUTPUT_DIR = path.join(__dirname, '../src/css');

// CSS section markers and their output files
const PAGE_SECTIONS = {
    'About Us Page CSS': 'pages/about.css',
    'Courses Grid Page CSS': 'pages/courses-grid.css',
    'Courses List Page CSS': 'pages/courses-list.css',
    'Course Detail Page CSS': 'pages/courses-detail.css',
    'Event Detail Page CSS': 'pages/event-detail.css',
    'Instructor Page CSS': 'pages/instructor.css',
    'Instructor Detail Page CSS': 'pages/instructor-detail.css',
    'Pricing Page CSS': 'pages/pricing.css',
    'FAQ Page CSS': 'pages/faq.css',
    'Blog List Page CSS': 'pages/blog-list.css',
    'Blog Detail Page CSS': 'pages/blog-detail.css',
    'Contact Us Page CSS': 'pages/contact.css',
    '404 Page CSS': 'pages/404.css',
};

// All pages that get a file (common + page-specific or common only)
const ALL_PAGES = [
    'home',
    'about',
    'courses-grid',
    'courses-list',
    'courses-detail',
    'event-detail',
    'instructor',
    'instructor-detail',
    'pricing',
    'faq',
    'blog-grid',
    'blog-list',
    'blog-detail',
    'contact',
    'login',
    'register',
    'profile',
    'checkout',
    'video-detail',
    '404',
];

function splitCSS() {
    console.log('📄 Reading source CSS...');
    const css = fs.readFileSync(SOURCE_CSS, 'utf8');
    const lines = css.split('\n');

    fs.mkdirSync(path.join(OUTPUT_DIR, 'pages'), { recursive: true });

    let commonCSS = [];
    let responsiveCSS = [];
    let currentPageCSS = {};
    let currentSection = 'common';
    let inResponsive = false;

    Object.values(PAGE_SECTIONS).forEach((file) => {
        currentPageCSS[file] = [];
    });

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes('/*==========Responsive Start==========*/')) {
            inResponsive = true;
            currentSection = 'responsive';
        }

        let foundPageSection = false;
        for (const [sectionName, fileName] of Object.entries(PAGE_SECTIONS)) {
            if (line.includes(`/*==========${sectionName} Start==========*/`)) {
                currentSection = fileName;
                foundPageSection = true;
                break;
            }
            if (line.includes(`/*==========${sectionName} End==========*/`)) {
                currentSection = 'common';
                foundPageSection = true;
                break;
            }
        }

        if (inResponsive) {
            responsiveCSS.push(line);
        } else if (currentSection === 'common') {
            commonCSS.push(line);
        } else if (currentPageCSS[currentSection]) {
            currentPageCSS[currentSection].push(line);
        }
    }

    let commonContent = commonCSS.join('\n') + '\n\n' + responsiveCSS.join('\n');

    // Inner banner (.inner-banner, .banner-breadcrum) is used on ALL inner pages but lives in About Us section.
    // Extract it and add to common so every page gets it.
    const ABOUT_KEY = 'pages/about.css';
    const aboutLines = currentPageCSS[ABOUT_KEY] || [];
    let bannerStart = -1;
    let bannerEnd = -1;
    for (let i = 0; i < aboutLines.length; i++) {
        if (aboutLines[i].includes('/* Banner CSS Start */')) bannerStart = i;
        if (aboutLines[i].includes('/* Banner CSS End */')) bannerEnd = i;
    }
    if (bannerStart >= 0 && bannerEnd >= 0 && bannerEnd >= bannerStart) {
        const innerBannerBlock = aboutLines.slice(bannerStart, bannerEnd + 1).join('\n');
        commonContent += '\n\n/* Inner Banner (shared by all inner pages) */\n' + innerBannerBlock;
        currentPageCSS[ABOUT_KEY] = aboutLines.slice(0, bannerStart).concat(aboutLines.slice(bannerEnd + 1));
        console.log('  📌 Inner banner styles moved to common (all pages)');
    }

    // Each page file = common + that page's section (no separate common.css)
    for (const pageName of ALL_PAGES) {
        const fileName = `pages/${pageName}.css`;
        let pageContent = commonContent;

        const sectionKey = fileName; // e.g. pages/about.css
        const sectionLines = currentPageCSS[sectionKey];
        if (sectionLines && sectionLines.length > 0) {
            pageContent += '\n\n/* Page-specific CSS */\n' + sectionLines.join('\n');
        }

        fs.writeFileSync(path.join(OUTPUT_DIR, fileName), pageContent);
        console.log(`  ✅ ${fileName} (common + ${sectionLines?.length ? 'page' : 'shared'} styles)`);
    }

    console.log('\n🎉 CSS splitting complete! Each page file contains common + its own styles.');
}

splitCSS();

/**
 * Generate CSS and JS bundles for development
 * Creates bundled files in assets/css/bundles/ and assets/js/bundles/
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Page configurations
const PAGES = {
    'home': { features: ['swiper', 'wow', 'isotope'] },
    'home-tailwind': { features: ['swiper', 'wow', 'isotope'] },
    'about': { features: ['swiper', 'wow'] },
    'courses-grid': { features: ['wow', 'isotope'] },
    'courses-list': { features: ['wow'] },
    'courses-detail': { features: ['swiper', 'wow', 'fancybox'] },
    'event-detail': { features: ['swiper', 'wow'] },
    'instructor': { features: ['wow'] },
    'instructor-detail': { features: ['wow'] },
    'pricing': { features: ['swiper', 'wow'] },
    'faq': { features: ['wow'] },
    'blog-grid': { features: ['wow'] },
    'blog-list': { features: ['wow'] },
    'blog-detail': { features: ['wow', 'fancybox'] },
    'contact': { features: ['wow'] },
    'login': { features: [] },
    'register': { features: [] },
    'profile': { features: [] },
    'checkout': { features: [] },
    'video-detail': { features: ['wow', 'fancybox'] },
    '404': { features: [] }
};

// Base CSS files (shared libs)
const CSS_BASE_FILES = [
    'assets/css/bootstrap.min.css',
    'assets/css/fonts.css',
    'assets/css/fontawesome.min.css',
    'assets/css/swiper-bundle.min.css',
    'assets/css/fancybox.min.css',
    // 'assets/css/jquery-ui.css', // Removed for performance
    'assets/css/animate.css',
];
// Each page has its own full style: src/css/pages/<page>.css (common + page-specific, no separate common)
const CSS_PAGE_FILE = (pageName) => `src/css/pages/${pageName}.css`;
const CSS_RTL_AUTH = 'assets/css/rtl-auth.css';

// Core JS files
const CORE_JS = [
    'assets/js/jquery-3.7.1.min.js',
    'assets/js/bootstrap.min.js'
];

// Feature JS files
const FEATURE_JS = {
    'swiper': 'assets/js/swiper-bundle.min.js',
    'wow': 'assets/js/wow.min.js',
    'isotope': 'assets/js/isotope.pkgd.min.js',
    'fancybox': 'assets/js/fancybox.min.js',
    'jquery-ui': 'assets/js/jquery-ui.min.js'
};

// Custom JS files
const CUSTOM_JS = [
    'assets/js/bg-moving.js',
    'assets/js/custom-scroll-count.js',
    'assets/js/back-to-top.js',
    'assets/js/custom.js',
    'src/js/search-dropdown.js'
];

function readFile(filePath) {
    const fullPath = path.join(ROOT, filePath);
    if (fs.existsSync(fullPath)) {
        return fs.readFileSync(fullPath, 'utf8');
    }
    console.log(`  ⚠️  File not found: ${filePath}`);
    return '';
}

function fixCSSPaths(content) {
    content = content.replace(/url\(\.\.\/webfonts\//g, 'url(../../webfonts/');
    content = content.replace(/url\('\.\.\/webfonts\//g, "url('../../webfonts/");
    content = content.replace(/url\("\.\.\/webfonts\//g, 'url("../../webfonts/');
    content = content.replace(/url\(images\//g, 'url(../images/');
    content = content.replace(/url\("images\//g, 'url("../images/');
    content = content.replace(/url\('images\//g, "url('../images/");
    return content;
}

function generateCSSBundle(pageName) {
    let css = `/* ${pageName} CSS Bundle - Generated */\n\n`;

    CSS_BASE_FILES.forEach((file) => {
        let content = readFile(file);
        if (content) {
            css += `/* === ${file} === */\n${fixCSSPaths(content)}\n\n`;
        }
    });

    const pageCssFile = CSS_PAGE_FILE(pageName);
    let pageContent = readFile(pageCssFile);
    if (pageContent) {
        css += `/* === ${pageCssFile} (common + page) === */\n${fixCSSPaths(pageContent)}\n\n`;
    }

    const rtlContent = readFile(CSS_RTL_AUTH);
    if (rtlContent) {
        css += `/* === ${CSS_RTL_AUTH} === */\n${fixCSSPaths(rtlContent)}\n\n`;
    }

    return css;
}

function generateJSBundle(pageName, features) {
    let js = `/* ${pageName} JS Bundle - Generated */\n\n`;

    // Add core JS
    CORE_JS.forEach(file => {
        const content = readFile(file);
        if (content) {
            js += content + ';\n';
        }
    });

    // Add feature JS based on page requirements
    features.forEach(feature => {
        if (FEATURE_JS[feature]) {
            const content = readFile(FEATURE_JS[feature]);
            if (content) {
                js += content + ';\n';
            }
        }
    });

    // Add custom JS
    CUSTOM_JS.forEach(file => {
        const content = readFile(file);
        if (content) {
            js += content + ';\n';
        }
    });

    return js;
}

// Create directories
const cssBundleDir = path.join(ROOT, 'assets/css/bundles');
const jsBundleDir = path.join(ROOT, 'assets/js/bundles');
const jsPageDir = path.join(ROOT, 'assets/js/pages');

fs.mkdirSync(cssBundleDir, { recursive: true });
fs.mkdirSync(jsBundleDir, { recursive: true });
fs.mkdirSync(jsPageDir, { recursive: true });

console.log('🔧 Generating bundles for development...\n');

// Generate bundles for each page
for (const [pageName, config] of Object.entries(PAGES)) {
    console.log(`  📦 ${pageName}...`);

    // Generate CSS bundle
    const cssBundle = generateCSSBundle(pageName);
    fs.writeFileSync(path.join(cssBundleDir, `${pageName}.bundle.css`), cssBundle);

    // Generate JS bundle
    const jsBundle = generateJSBundle(pageName, config.features);
    fs.writeFileSync(path.join(jsBundleDir, `${pageName}.bundle.js`), jsBundle);

    // Copy page JS from src if exists
    const srcPageJs = path.join(ROOT, 'src/js/pages', `${pageName}.js`);
    const destPageJs = path.join(jsPageDir, `${pageName}.js`);
    if (fs.existsSync(srcPageJs)) {
        fs.copyFileSync(srcPageJs, destPageJs);
    } else {
        // Create placeholder
        fs.writeFileSync(destPageJs, `/* ${pageName} page logic */\ndocument.addEventListener('DOMContentLoaded', function() {\n    // Page-specific code here\n});\n`);
    }

    console.log(`     ✅ ${pageName}.bundle.css, ${pageName}.bundle.js, ${pageName}.js`);
}

console.log('\n🎉 Bundles generated successfully!');
console.log('\n📂 Output:');
console.log('   assets/css/bundles/*.bundle.css');
console.log('   assets/js/bundles/*.bundle.js');
console.log('   assets/js/pages/*.js');

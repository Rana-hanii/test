/**
 * Remove unused CSS using PurgeCSS
 * Run: node purge-css.js
 */

const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

async function main() {
    console.log('🧹 Removing unused CSS with PurgeCSS...\n');
    
    const cssPath = 'dist/assets/css/bundle.css';
    const beforeSize = fs.statSync(cssPath).size;
    
    console.log(`Before: ${(beforeSize / 1024).toFixed(1)} KB`);
    
    const purgeCSSResult = await new PurgeCSS().purge({
        content: ['dist/**/*.html'],
        css: [cssPath],
        safelist: {
            standard: [
                // Body states
                'fixed',
                'sticky-header', 
                'toggle-menu',
                'active',
                'active-sub-menu',
                'show',
                'hide',
                'open',
                'closed',
                // Bootstrap visibility
                'd-none',
                'd-block',
                'd-flex',
                // Form validation
                'is-valid',
                'is-invalid',
                'was-validated',
            ],
            // Keep entire selectors containing these patterns
            variables: [
                '--title-font',
                '--body-font',
                '--arabic-font',
            ],
            deep: [
                /active$/,
                /show$/,
                /visible$/,
            ],
            greedy: [
                // Tajawal font
                /Tajawal/,
                /font-family/,
                // RTL selectors
                /dir.*rtl/,
                // Swiper (slider)
                /swiper/,
                // WOW/Animate.css
                /wow/,
                /animate/,
                /animated/,
                /fadeIn/,
                /fadeOut/,
                /slide/,
                /zoom/,
                /bounce/,
                // FontAwesome
                /^fa-/,
                /^fa$/,
                /^fab$/,
                /^fas$/,
                /^far$/,
                // Bootstrap grid
                /^col-/,
                /^row/,
                /^container/,
                /^d-/,
                /^text-/,
                /^bg-/,
                /^btn/,
                /^nav/,
                /^dropdown/,
                /^modal/,
                /^collapse/,
                /^form-/,
                // Isotope
                /isotope/,
                // Fancybox
                /fancybox/,
                // jQuery UI
                /^ui-/,
                // intl-tel-input (phone country dropdown)
                /^iti/,
                /iti__/,
            ]
        },
        keyframes: true,
        fontFace: false,  // Keep all @font-face rules
        variables: true,
    });
    
    if (purgeCSSResult.length > 0) {
        fs.writeFileSync(cssPath, purgeCSSResult[0].css);
        
        // Append critical font rules that PurgeCSS strips (attribute selectors)
        const fontRules = `
/* Force Tajawal font - appended after PurgeCSS */
[dir=rtl] *,[dir=rtl] body,[dir=rtl] p,[dir=rtl] h1,[dir=rtl] h2,[dir=rtl] h3,[dir=rtl] h4,[dir=rtl] h5,[dir=rtl] h6,[dir=rtl] a,[dir=rtl] span,[dir=rtl] div,[dir=rtl] li,[dir=rtl] input,[dir=rtl] textarea,[dir=rtl] button,[dir=rtl] .btn,[dir=rtl] .h1-title,[dir=rtl] .h2-title,[dir=rtl] .h3-title,[dir=rtl] .h4-title,[dir=rtl] .h5-title{font-family:Tajawal,Arial,sans-serif!important}
body,html{font-family:Tajawal,Arial,sans-serif!important}
`;
        const currentCss = fs.readFileSync(cssPath, 'utf8');
        fs.writeFileSync(cssPath, currentCss + fontRules);
        console.log('✅ Appended Tajawal font rules');
        
        const afterSize = fs.statSync(cssPath).size;
        const savings = beforeSize - afterSize;
        const percentage = ((savings / beforeSize) * 100).toFixed(1);
        
        console.log(`After:  ${(afterSize / 1024).toFixed(1)} KB`);
        console.log(`\n✅ Saved ${(savings / 1024).toFixed(1)} KB (${percentage}% reduction)`);
    }
}

main().catch(console.error);

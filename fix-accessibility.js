/**
 * Fix accessibility issues:
 * 1. Add aria-label to toggle button
 * 2. Fix heading hierarchy (h4 -> h3 in footer)
 */

const fs = require('fs');
const path = require('path');

// Get all HTML files in root and dist
const rootHtmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const distHtmlFiles = fs.readdirSync('dist').filter(f => f.endsWith('.html')).map(f => path.join('dist', f));
const allHtmlFiles = [...rootHtmlFiles, ...distHtmlFiles];

console.log('🔧 Fixing accessibility issues...\n');

let fixedCount = 0;

allHtmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Fix 1: Add aria-label to toggle button
    if (content.includes('<button class="toggle-button">') && !content.includes('aria-label')) {
        content = content.replace(
            /<button class="toggle-button">/g,
            '<button class="toggle-button" aria-label="القائمة" aria-expanded="false">'
        );
        modified = true;
    }
    
    // Fix 2: Change footer h4.underline-title to h3 for proper heading hierarchy
    // Only in footer section
    const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/gi);
    if (footerMatch) {
        footerMatch.forEach(footer => {
            const fixedFooter = footer
                .replace(/<h4 class="underline-title">/g, '<h3 class="underline-title">')
                .replace(/<\/h4>(\s*<(?:div|ul))/g, '</h3>$1');
            content = content.replace(footer, fixedFooter);
            modified = true;
        });
    }
    
    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ ${file}`);
        fixedCount++;
    }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
console.log('\n📋 Accessibility fixes applied:');
console.log('  - Added aria-label="القائمة" to toggle buttons');
console.log('  - Changed footer h4 to h3 for proper heading hierarchy');

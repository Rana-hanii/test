const fs = require('fs');
const path = require('path');

/**
 * Extract Inline CSS from HTML Files
 * 
 * This script extracts all inline <style> blocks from the <body> of HTML files
 * and removes them, keeping only critical loader CSS in the <head>.
 */

// Configuration
const HTML_FILES = [
    'index.html',
    'about-us.html',
    'profile.html',
    'pricing.html',
    'courses-grid.html',
    'courses-detail.html',
    'blog-grid.html',
    'blog-list.html',
    'blog-detail.html',
    'instructor.html',
    'instructor-detail.html',
    'contact-us.html',
    'faq.html',
    'event-detail.html',
    'video-detail.html',
    'login.html',
    'register.html',
    'checkout.html',
    '404.html'
];

const EXTRACTED_CSS_DIR = path.join(__dirname, 'assets', 'css', 'extracted');
const BACKUP_DIR = path.join(__dirname, 'backup-html');

// Ensure directories exist
if (!fs.existsSync(EXTRACTED_CSS_DIR)) {
    fs.mkdirSync(EXTRACTED_CSS_DIR, { recursive: true });
}

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Extract inline CSS from a single HTML file
 */
function extractInlineCSS(htmlFile) {
    const filePath = path.join(__dirname, htmlFile);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${htmlFile}`);
        return;
    }

    console.log(`\n📄 Processing: ${htmlFile}`);
    
    // Read the HTML file
    let html = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(html, 'utf8');
    
    // Backup original file
    const backupPath = path.join(BACKUP_DIR, htmlFile);
    fs.writeFileSync(backupPath, html, 'utf8');
    console.log(`   ✅ Backup created: backup-html/${htmlFile}`);
    
    // Extract inline CSS from <body>
    const bodyStyleRegex = /<body[^>]*>\s*<style>([\s\S]*?)<\/style>/i;
    const match = html.match(bodyStyleRegex);
    
    if (match) {
        const inlineCSS = match[1];
        const cssSize = Buffer.byteLength(inlineCSS, 'utf8');
        
        // Save extracted CSS for reference
        const cssFileName = htmlFile.replace('.html', '-inline.css');
        const cssPath = path.join(EXTRACTED_CSS_DIR, cssFileName);
        fs.writeFileSync(cssPath, inlineCSS, 'utf8');
        console.log(`   📝 Extracted CSS: assets/css/extracted/${cssFileName} (${(cssSize / 1024).toFixed(2)} KB)`);
        
        // Remove inline CSS from body
        html = html.replace(bodyStyleRegex, '<body class="fixed">');
        
        // Write updated HTML
        fs.writeFileSync(filePath, html, 'utf8');
        
        const newSize = Buffer.byteLength(html, 'utf8');
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        
        console.log(`   ✅ Updated: ${htmlFile}`);
        console.log(`   📊 Size: ${(originalSize / 1024).toFixed(2)} KB → ${(newSize / 1024).toFixed(2)} KB (${reduction}% reduction)`);
    } else {
        console.log(`   ℹ️  No inline CSS found in <body>`);
    }
}

/**
 * Main execution
 */
function main() {
    console.log('🚀 Starting CSS Extraction Process...\n');
    console.log('=' .repeat(60));
    
    let totalOriginalSize = 0;
    let totalNewSize = 0;
    let processedCount = 0;
    
    HTML_FILES.forEach(htmlFile => {
        const filePath = path.join(__dirname, htmlFile);
        
        if (fs.existsSync(filePath)) {
            const originalSize = fs.statSync(filePath).size;
            extractInlineCSS(htmlFile);
            
            if (fs.existsSync(filePath)) {
                const newSize = fs.statSync(filePath).size;
                totalOriginalSize += originalSize;
                totalNewSize += newSize;
                processedCount++;
            }
        }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✨ CSS Extraction Complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   Files processed: ${processedCount}`);
    console.log(`   Total original size: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
    console.log(`   Total new size: ${(totalNewSize / 1024).toFixed(2)} KB`);
    console.log(`   Total reduction: ${((totalOriginalSize - totalNewSize) / 1024).toFixed(2)} KB (${((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1)}%)`);
    console.log(`\n📁 Backups saved to: backup-html/`);
    console.log(`📁 Extracted CSS saved to: assets/css/extracted/`);
    console.log('\n✅ All files updated successfully!');
    console.log('\n⚠️  Next steps:');
    console.log('   1. Test all pages to ensure CSS bundles are loading correctly');
    console.log('   2. Verify no visual regressions');
    console.log('   3. If everything works, you can delete backup-html/ folder');
}

// Run the script
main();

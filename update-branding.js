/**
 * Update branding from Courseshub to خمسه بلاننينج
 */

const fs = require('fs');
const path = require('path');

const htmlFiles = [
    '404.html',
    'about-us.html',
    'blog-detail.html',
    'blog-grid.html',
    'blog-list.html',
    'contact-us.html',
    'courses-detail.html',
    'courses-grid.html',
    'courses-list.html',
    'event-detail.html',
    'faq.html',
    'index.html',
    'instructor.html',
    'instructor-detail.html',
    'login.html',
    'pricing.html',
    'profile.html',
    'register.html',
    'video-detail.html'
];

console.log('Updating branding to خمسه بلاننينج...\n');

let updated = 0;

htmlFiles.forEach(file => {
    const filePath = path.join('.', file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${file} - Not found`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // 1. Replace in title
    content = content.replace(/ - Courseshub<\/title>/g, ' - خمسه بلاننينج</title>');
    content = content.replace(/Courseshub - /g, 'خمسه بلاننينج - ');
    
    // 2. Replace in meta keywords
    content = content.replace(/content="Courseshub,/g, 'content="خمسه بلاننينج,');
    
    // 3. Replace in meta description
    content = content.replace(/Courseshub - Online/g, 'خمسه بلاننينج - Online');
    content = content.replace(/in Courseshub"/g, 'in خمسه بلاننينج"');
    
    // 4. Replace footer logo with main Logo.png
    content = content.replace(
        /<img src="assets\/images\/footer-logo\.svg" width="201" height="36" alt="[^"]*">/g,
        '<img src="assets/images/Logo.png" width="150" height="96" alt="خمسه بلاننينج">'
    );
    
    // 5. Replace header logo alt text
    content = content.replace(/alt="كورسيز هب"/g, 'alt="خمسه بلاننينج"');
    content = content.replace(/alt="Courseshub"/g, 'alt="خمسه بلاننينج"');
    
    // 6. Replace copyright
    content = content.replace(/span> Courseshub<\/p>/g, 'span> خمسه بلاننينج</p>');
    
    // 7. Replace title attribute
    content = content.replace(/title="Courseshub"/g, 'title="خمسه بلاننينج"');
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ ${file} - Updated`);
        updated++;
    } else {
        console.log(`✓  ${file} - No changes needed`);
    }
});

console.log(`\n✅ Updated ${updated} files with خمسه بلاننينج branding`);

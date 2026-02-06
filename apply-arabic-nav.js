/**
 * Apply Arabic navbar to all HTML pages
 * Replaces the English menu with the Arabic one
 */

const fs = require('fs');
const path = require('path');

// Arabic navigation menu items
const arabicNavItems = `<ul>
                                            <!-- الرئيسية -->
                                            <li{{ACTIVE_HOME}}>
                                                <a href="index.html" title="الرئيسية">الرئيسية</a>
                                            </li>
                                            <!-- من نحن -->
                                            <li{{ACTIVE_ABOUT}}>
                                                <a href="about-us.html" title="من نحن">من نحن</a>
                                            </li>
                                            <!-- الدورات -->
                                            <li class="sub-items{{ACTIVE_COURSES}}">
                                                <a href="javascript:void(0);" title="الدورات">الدورات</a>
                                                <ul class="sub-menu">
                                                    <li><a href="courses-grid.html" title="شبكة الدورات">شبكة الدورات</a></li>
                                                    <li><a href="courses-list.html" title="قائمة الدورات">قائمة الدورات</a></li>
                                                    <li><a href="courses-detail.html" title="تفاصيل الدورة">تفاصيل الدورة</a></li>
                                                </ul>
                                            </li>
                                            <!-- البرامج -->
                                            <li{{ACTIVE_PROGRAMS}}>
                                                <a href="event-detail.html" title="البرامج">البرامج</a>
                                            </li>
                                            <!-- المدونة -->
                                            <li{{ACTIVE_BLOG}}>
                                                <a href="blog-grid.html" title="المدونة">المدونة</a>
                                            </li>
                                            <!-- تواصل معنا -->
                                            <li{{ACTIVE_CONTACT}}>
                                                <a href="contact-us.html" title="تواصل معنا">تواصل معنا</a>
                                            </li>
                                        </ul>`;

// Map pages to their active menu
const activeMap = {
    'index.html': 'HOME',
    'about-us.html': 'ABOUT',
    'courses-grid.html': 'COURSES',
    'courses-list.html': 'COURSES',
    'courses-detail.html': 'COURSES',
    'video-detail.html': 'COURSES',
    'event-detail.html': 'PROGRAMS',
    'blog-grid.html': 'BLOG',
    'blog-list.html': 'BLOG',
    'blog-detail.html': 'BLOG',
    'contact-us.html': 'CONTACT',
    'faq.html': 'HOME',
    'pricing.html': 'HOME',
    'instructor.html': 'HOME',
    'instructor-detail.html': 'HOME',
    '404.html': 'HOME',
    'login.html': 'HOME',
    'register.html': 'HOME',
    'profile.html': 'HOME'
};

function getNavForPage(fileName) {
    const active = activeMap[fileName] || 'HOME';
    let nav = arabicNavItems;
    
    // Replace all active placeholders
    nav = nav.replace('{{ACTIVE_HOME}}', active === 'HOME' ? ' class="active"' : '');
    nav = nav.replace('{{ACTIVE_ABOUT}}', active === 'ABOUT' ? ' class="active"' : '');
    nav = nav.replace('{{ACTIVE_COURSES}}', active === 'COURSES' ? ' active' : '');
    nav = nav.replace('{{ACTIVE_PROGRAMS}}', active === 'PROGRAMS' ? ' class="active"' : '');
    nav = nav.replace('{{ACTIVE_BLOG}}', active === 'BLOG' ? ' class="active"' : '');
    nav = nav.replace('{{ACTIVE_CONTACT}}', active === 'CONTACT' ? ' class="active"' : '');
    
    return nav;
}

function applyArabicNav(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Find the header-menu-container and replace its <ul>...</ul> content
    const containerStart = content.indexOf('<div class="header-menu-container">');
    if (containerStart === -1) return false;
    
    // Find the <ul> after header-menu-container
    const ulStart = content.indexOf('<ul>', containerStart);
    if (ulStart === -1) return false;
    
    // Find the closing </ul> for this menu (need to handle nested <ul>)
    let depth = 1;
    let pos = ulStart + 4;
    while (depth > 0 && pos < content.length) {
        const nextOpen = content.indexOf('<ul', pos);
        const nextClose = content.indexOf('</ul>', pos);
        
        if (nextClose === -1) break;
        
        if (nextOpen !== -1 && nextOpen < nextClose) {
            depth++;
            pos = nextOpen + 3;
        } else {
            depth--;
            if (depth === 0) {
                const ulEnd = nextClose + 5;
                
                // Replace the entire <ul>...</ul>
                const newNav = getNavForPage(fileName);
                content = content.substring(0, ulStart) + newNav + content.substring(ulEnd);
                
                fs.writeFileSync(filePath, content, 'utf8');
                return true;
            }
            pos = nextClose + 5;
        }
    }
    
    return false;
}

function main() {
    console.log('🌐 Applying Arabic navbar to all pages...\n');
    
    // Get all HTML files in root directory (source files)
    const sourceFiles = fs.readdirSync('.')
        .filter(f => f.endsWith('.html'));
    
    let count = 0;
    
    sourceFiles.forEach(file => {
        if (applyArabicNav(file)) {
            console.log(`✅ ${file}`);
            count++;
        } else {
            console.log(`⏭️  ${file} (no menu found)`);
        }
    });
    
    console.log(`\n✅ Applied Arabic navbar to ${count} source files`);
    console.log('\n📝 Remember to rebuild dist folder with: bash build.sh');
}

main();

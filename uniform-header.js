/**
 * Apply uniform Arabic header to all HTML pages
 * Based on index.html/register.html structure
 */

const fs = require('fs');
const path = require('path');

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

function getArabicHeader(fileName) {
    const active = activeMap[fileName] || 'HOME';
    
    // Set active classes
    const homeActive = active === 'HOME' ? ' class="active"' : '';
    const aboutActive = active === 'ABOUT' ? ' class="active"' : '';
    const coursesActive = active === 'COURSES' ? ' active' : '';
    const programsActive = active === 'PROGRAMS' ? ' class="active"' : '';
    const blogActive = active === 'BLOG' ? ' class="active"' : '';
    const contactActive = active === 'CONTACT' ? ' class="active"' : '';

    return `<!-- Header Start -->
    <header class="site-header">
        <div class="top-header">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="top-header-content-box">
                                                        <p>اشترك اليوم وطور مهاراتك مع دورات خمسة بلاننج المُصممة للتطبيق العملي</p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-header">
            <div class="container">
                <div class="row">
                    <div class="col-xxl-3 col-lg-2">
                        <div class="site-branding">
                            <a href="index.html" title="Courseshub">
                                <img src="assets/images/Logo.png" alt="كورسيز هب" width="150" height="96">
                            </a>
                        </div>
                    </div>
                    <div class="col-xxl-9 col-lg-10">
                        <div class="header-menu">
                            <nav class="main-navigation">
                                <button class="toggle-button" aria-label="القائمة" aria-expanded="false">
                                    <span></span>
                                </button>
                                <div class="mobile-menu-box">
                                    <div class="search-input for-mobile">
                                        <div class="search-input-box">
                                            <form>
                                                <input type="text" name="search" class="form-input" placeholder="ابحث هنا..." required="">
                                                <button type="submit" class="sec-btn">
                                                    <span><img src="assets/images/search-icon.svg" width="18" height="18" alt="أيقونة البحث"></span>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div class="header-menu-container">
                                        <ul>
                                            <!-- الرئيسية -->
                                            <li${homeActive}>
                                                <a href="index.html" title="الرئيسية">الرئيسية</a>
                                            </li>
                                            <!-- من نحن -->
                                            <li${aboutActive}>
                                                <a href="about-us.html" title="من نحن">من نحن</a>
                                            </li>
                                            <!-- الدورات -->
                                            <li class="sub-items${coursesActive}">
                                                <a href="javascript:void(0);" title="الدورات">الدورات</a>
                                                <ul class="sub-menu">
                                                    <li><a href="courses-grid.html" title="شبكة الدورات">شبكة الدورات</a></li>
                                                    <li><a href="courses-list.html" title="قائمة الدورات">قائمة الدورات</a></li>
                                                    <li><a href="courses-detail.html" title="تفاصيل الدورة">تفاصيل الدورة</a></li>
                                                </ul>
                                            </li>
                                            <!-- البرامج -->
                                            <li${programsActive}>
                                                <a href="event-detail.html" title="البرامج">البرامج</a>
                                            </li>
                                            <!-- المدونة -->
                                            <li${blogActive}>
                                                <a href="blog-grid.html" title="المدونة">المدونة</a>
                                            </li>
                                            <!-- تواصل معنا -->
                                            <li${contactActive}>
                                                <a href="contact-us.html" title="تواصل معنا">تواصل معنا</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <!-- Search Icon -->
                                <div class="header-icon-wp">
                                    <div class="search-wp">
                                        <div class="search-icon-box">
                                            <a href="javascript:void(0);" class="search-icon">
                                                <img src="assets/images/search-icon.svg" width="20" height="20" alt="أيقونة البحث">
                                            </a>
                                        </div>
                                        <div class="search-input">
                                            <div class="search-input-box">
                                                <form>
                                                    <input type="text" name="search" class="form-input" placeholder="ابحث هنا..." required="">
                                                    <button type="submit" class="sec-btn">
                                                        <span><img src="assets/images/search-icon.svg" width="18" height="18" alt="أيقونة البحث"></span>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Login | Register Button -->
                                      <div class="header-btn header-auth-links sec-btn">
                                    <a href="login.html" class="header-auth-link" title="تسجيل الدخول"><span>تسجيل الدخول</span></a>
                                    <span class="header-auth-sep" aria-hidden="true">|</span>
                                    <a href="register.html" class="header-auth-link" title="إنشاء حساب"><span>إنشاء حساب</span></a>
                                </div>
                            </nav>
                            <div class="black-shadow"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- Header End -->`;
}

function applyUniformHeader(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Find and replace the entire header section
    const headerRegex = /<!-- Header Start -->[\s\S]*?<!-- Header End -->/;
    
    if (headerRegex.test(content)) {
        const newHeader = getArabicHeader(fileName);
        content = content.replace(headerRegex, newHeader);
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

function main() {
    console.log('🌐 Applying uniform Arabic header to all pages...\n');
    
    // Get all HTML files in root directory
    const sourceFiles = fs.readdirSync('.')
        .filter(f => f.endsWith('.html'));
    
    let count = 0;
    
    sourceFiles.forEach(file => {
        if (applyUniformHeader(file)) {
            console.log(`✅ ${file}`);
            count++;
        } else {
            console.log(`⏭️  ${file} (no header found)`);
        }
    });
    
    console.log(`\n✅ Applied uniform Arabic header to ${count} source files`);
    console.log('\n📋 Header elements uniformed:');
    console.log('  - Arabic top banner: "عرض خاص! احصل على خصم -50% على جميع الدورات"');
    console.log('  - Logo: Logo.png with alt="كورسيز هب"');
    console.log('  - Search placeholder: "ابحث هنا..."');
    console.log('  - Login button: "تسجيل الدخول | إنشاء حساب"');
    console.log('  - Removed cart icon');
    console.log('\n📝 Remember to rebuild dist folder with: bash build.sh');
}

main();

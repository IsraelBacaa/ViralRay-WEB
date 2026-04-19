const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Collect console errors
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
    });
    
    try {
        // Navigate to the page
        await page.goto(`file://${__dirname}/index.html`);
        
        // Wait for the page to load
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        // Check if main elements exist
        const header = await page.$('.header');
        const hero = await page.$('.hero');
        const products = await page.$('.featured-products');
        const footer = await page.$('.footer');
        
        console.log('=== Page Load Test ===');
        console.log('Header found:', !!header);
        console.log('Hero section found:', !!hero);
        console.log('Products section found:', !!products);
        console.log('Footer found:', !!footer);
        
        // Test carousel functionality
        const leftArrow = await page.$('.carousel-arrow.left');
        const rightArrow = await page.$('.carousel-arrow.right');
        console.log('Carousel arrows found:', !!leftArrow && !!rightArrow);
        
        // Test navigation links
        const navLinks = await page.$$('.nav-link');
        console.log('Navigation links found:', navLinks.length);
        
        // Test product cards
        const productCards = await page.$$('.product-card');
        console.log('Product cards found:', productCards.length);
        
        // Test trust badges
        const badges = await page.$$('.badge');
        console.log('Trust badges found:', badges.length);
        
        console.log('\n=== Console Errors ===');
        if (errors.length === 0) {
            console.log('No console errors detected!');
        } else {
            errors.forEach((error, index) => {
                console.log(`Error ${index + 1}:`, error);
            });
        }
        
        console.log('\n=== Test Complete ===');
        
    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();

const fs = require('fs');

async function fixConfig() {
    const adminKey = process.env.VITE_ADMIN_API_KEY || "YOUR_KEY_HERE"; // We'll get it from env later
    
    // Read env for key
    const envContent = fs.readFileSync('.env', 'utf-8');
    const match = envContent.match(/VITE_ADMIN_API_KEY=(.*)/);
    const key = match ? match[1].trim() : '';

    const res = await fetch('http://localhost:5000/api/data/export');
    const data = await res.json();
    let config = data.adminConfig;
    
    function cleanString(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/\|\|\|/g, '').replace(/\|\|\|\|/g, '').replace(/\|/g, '').trim();
    }
    
    // Clean top level strings
    config.brochureTitle = cleanString(config.brochureTitle);
    config.brochureSubtitle = cleanString(config.brochureSubtitle);
    config.brochureServicesTitle = cleanString(config.brochureServicesTitle);
    config.brochurePricingNotes = cleanString(config.brochurePricingNotes);
    
    // Clean Pricing
    let pricing = JSON.parse(config.brochurePricing || '[]');
    for (let p of pricing) {
        p.service = cleanString(p.service);
        if (Array.isArray(p.features)) {
            p.features = p.features.map(f => cleanString(f));
        }
        p.note = cleanString(p.note);
    }
    config.brochurePricing = JSON.stringify(pricing);
    
    // Clean Manual Projects
    let manual = JSON.parse(config.brochureManualProjects || '[]');
    for (let p of manual) {
        p.title = cleanString(p.title);
        p.description = cleanString(p.description);
    }
    config.brochureManualProjects = JSON.stringify(manual);
    
    // Clean Sections
    let sections = JSON.parse(config.brochureSections || '[]');
    for (let s of sections) {
        s.title = cleanString(s.title);
        if (Array.isArray(s.items)) {
            for (let i of s.items) {
                i.title = cleanString(i.title);
                i.text = cleanString(i.text);
            }
        }
    }
    config.brochureSections = JSON.stringify(sections);

    const postRes = await fetch('http://localhost:5000/api/data/config', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}` 
        },
        body: JSON.stringify(config)
    });
    
    console.log("Status:", postRes.status);
}

fixConfig().catch(console.error);

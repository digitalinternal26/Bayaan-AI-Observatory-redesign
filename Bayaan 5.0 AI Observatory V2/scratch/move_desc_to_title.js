const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const regex = /<article([^>]*class="space-card[^>]*)>([\s\S]*?)<\/article>/g;

content = content.replace(regex, (match, attrs, inner) => {
    // Check if there's a desc
    const descMatch = inner.match(/<p class="space-card-desc">\s*(.*?)\s*<\/p>/s);
    if (descMatch) {
        const descText = descMatch[1].trim().replace(/"/g, '&quot;');
        
        // Remove the p tag
        const newInner = inner.replace(/<p class="space-card-desc">[\s\S]*?<\/p>/, '');
        
        // Add title to attrs
        // We shouldn't already have a title attribute, but just in case
        let newAttrs = attrs;
        if (!newAttrs.includes('title=')) {
            newAttrs = ` title="${descText}"` + newAttrs;
        }
        
        return `<article${newAttrs}>${newInner}</article>`;
    }
    return match;
});

fs.writeFileSync('index.html', content, 'utf8');
console.log("Moved descriptions to title tooltips");

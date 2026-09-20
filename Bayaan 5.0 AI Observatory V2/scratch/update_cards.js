const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');
const startIdx = content.indexOf('<div class="space-grid is-collapsed" id="spaceGrid">');
const endIdx = content.indexOf('</div>\n                </section>', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const block = content.substring(startIdx, endIdx);
    
    const articles = block.split('<article');
    const newArticles = [articles[0]];
    
    for (let i = 1; i < articles.length; i++) {
        let article = articles[i];
        
        // Extract desc
        const descMatch = article.match(/<p class="space-card-desc">\s*([\s\S]*?)\s*<\/p>/);
        if (descMatch) {
            let descText = descMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ');
            article = ` title="${descText}"` + article;
            article = article.replace(/<p class="space-card-desc">\s*[\s\S]*?\s*<\/p>/, '');
        }
        
        // Remove span
        article = article.replace(/<span class="space-card-action"[^>]*>[\s\S]*?<\/span>/, '');
        
        newArticles.push(article);
    }
    
    const newBlock = newArticles.join('<article');
    content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
    
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Updated index.html");
} else {
    console.log("Block not found");
}

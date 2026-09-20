const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="space-grid is-collapsed" id="spaceGrid">([\s\S]*?)<\/div>\s*<\/section>/;
const match = content.match(regex);

if (match) {
    const block = match[1];
    
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
    content = content.replace(regex, `<div class="space-grid is-collapsed" id="spaceGrid">${newBlock}</div>\n                </section>`);
    
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Updated index.html");
} else {
    console.log("Block not found");
}

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
        
        // Extract title attribute
        const titleMatch = article.match(/title="([^"]+)"/);
        if (titleMatch) {
            let descText = titleMatch[1];
            
            // Remove title attribute
            article = article.replace(/title="[^"]+"/, '');
            
            // Insert <p> after </h3>
            article = article.replace(/<\/h3>/, `</h3>\n                      <p class="space-card-desc">\n                        ${descText}\n                      </p>`);
        }
        
        newArticles.push(article);
    }
    
    const newBlock = newArticles.join('<article');
    content = content.replace(regex, `<div class="space-grid is-collapsed" id="spaceGrid">${newBlock}</div>\n                </section>`);
    
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Restored descriptions in index.html");
} else {
    console.log("Block not found");
}

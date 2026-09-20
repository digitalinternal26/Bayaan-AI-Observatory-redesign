import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Find the spaceGrid block
start_idx = content.find('<div class="space-grid is-collapsed" id="spaceGrid">')
end_idx = content.find('</div>\n                </section>', start_idx)

if start_idx != -1 and end_idx != -1:
    block = content[start_idx:end_idx]
    
    # Process each article
    articles = block.split('<article')
    new_articles = [articles[0]]
    
    for article in articles[1:]:
        # extract description text
        desc_match = re.search(r'<p class="space-card-desc">\s*(.*?)\s*</p>', article, re.DOTALL)
        if desc_match:
            desc_text = desc_match.group(1).replace('\n', ' ')
            desc_text = re.sub(r'\s+', ' ', desc_text)
            
            # add title to <article (which is now just the attributes part because we split on <article)
            # insert title after the first > (or rather, add it to the opening tag)
            article = f' title="{desc_text}"' + article
            
            # remove <p>
            article = re.sub(r'<p class="space-card-desc">\s*.*?\s*</p>', '', article, flags=re.DOTALL)
        
        # remove span space-card-action
        article = re.sub(r'<span class="space-card-action"[^>]*>.*?</span>', '', article, flags=re.DOTALL)
        
        new_articles.append(article)
        
    new_block = '<article'.join(new_articles)
    content = content[:start_idx] + new_block + content[end_idx:]
    
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated index.html")
else:
    print("Could not find block")

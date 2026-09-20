const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const recentStart = content.indexOf('<!-- Recent — populated by renderSpaceRecent()');
const recentEnd = content.indexOf('</section>', recentStart) + 10;
const recentBlock = content.substring(recentStart, recentEnd);

content = content.substring(0, recentStart) + content.substring(recentEnd);

const exploreStart = content.indexOf('<section class="space-section">', recentStart);
const exploreEnd = content.indexOf('</section>', exploreStart) + 10;

content = content.substring(0, exploreEnd) + '\n                ' + recentBlock + content.substring(exploreEnd);

fs.writeFileSync('index.html', content, 'utf8');
console.log("Swapped successfully");

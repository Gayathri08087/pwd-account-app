const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}
const files = walk('c:/Users/rajni/OneDrive/Desktop/PWD/pwd-account-app/src/pages');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('eyebrow')) {
    content = content.replace(/.*className=["']eyebrow["'].*\n/g, '');
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  }
});

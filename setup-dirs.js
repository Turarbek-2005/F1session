const fs = require('fs');
const path = require('path');

const dirs = [
  'store/slices',
  'api',
  'types',
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`Created: ${fullPath}`);
});

console.log('Directory structure created successfully!');

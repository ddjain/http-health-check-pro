const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

// Check if node_modules exists
if (!existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
} 
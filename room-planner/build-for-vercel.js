// A robust build script for Vercel deployment that avoids MIME type issues
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run the standard build first
console.log('Running standard Vite build...');
execSync('npm run build', { stdio: 'inherit' });

// Now modify the output for Vercel compatibility
console.log('Modifying build output for Vercel compatibility...');

// Create a new index.html that doesn't use ES modules
const createCompatibleHtml = () => {
  // Find the JS and CSS files
  const assetsDir = path.join(__dirname, 'dist', 'assets');
  const files = fs.readdirSync(assetsDir);
  
  const jsFile = files.find(file => file.endsWith('.js'));
  const cssFile = files.find(file => file.endsWith('.css'));
  
  if (!jsFile || !cssFile) {
    console.error('Could not find JS or CSS files in the dist/assets directory');
    process.exit(1);
  }
  
  // Create a new index.html with standard script tags
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>3D Room Planner</title>
    <link rel="stylesheet" href="./assets/${cssFile}">
  </head>
  <body>
    <div id="root"></div>
    <script src="./assets/${jsFile}"></script>
  </body>
</html>`;

  // Write the new index.html
  fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), htmlContent);
  console.log(`Created compatible index.html with references to ${jsFile} and ${cssFile}`);
};

// Convert ES modules to standard JS if needed
const convertToStandardJs = () => {
  const assetsDir = path.join(__dirname, 'dist', 'assets');
  const files = fs.readdirSync(assetsDir);
  
  const jsFile = files.find(file => file.endsWith('.js'));
  if (!jsFile) return;
  
  const jsPath = path.join(assetsDir, jsFile);
  let content = fs.readFileSync(jsPath, 'utf8');
  
  // Remove any import.meta references that might cause issues
  content = content.replace(/import\.meta\.url/g, '"/assets"');
  content = content.replace(/import\.meta\.env/g, 'window.env || {}');
  
  // Add a compatibility header
  content = `/* ES Module compatibility wrapper */
(function() {
  window.env = {
    MODE: "production",
    PROD: true,
    DEV: false
  };
${content}
})();`;

  fs.writeFileSync(jsPath, content);
  console.log(`Modified ${jsFile} for compatibility`);
};

// Run the modifications
createCompatibleHtml();
convertToStandardJs();

console.log('Build for Vercel completed successfully!');

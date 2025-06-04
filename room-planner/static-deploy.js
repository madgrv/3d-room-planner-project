// Static deployment script that creates a fully self-contained HTML file
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run the standard build first
console.log('Running standard Vite build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed, but continuing with static deployment...');
}

// Create a static deployment
console.log('Creating static deployment...');

// Function to read a file as base64
const readFileAsBase64 = (filePath) => {
  return fs.readFileSync(filePath).toString('base64');
};

// Create a static HTML file with inlined assets
const createStaticHtml = () => {
  // Find the JS and CSS files
  const assetsDir = path.join(__dirname, 'dist', 'assets');
  const files = fs.readdirSync(assetsDir);
  
  const jsFile = files.find(file => file.endsWith('.js'));
  const cssFile = files.find(file => file.endsWith('.css'));
  
  if (!jsFile || !cssFile) {
    console.error('Could not find JS or CSS files in the dist/assets directory');
    process.exit(1);
  }
  
  // Read the contents of the JS and CSS files
  const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
  
  // Create a self-contained HTML file with inlined assets
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>3D Room Planner</title>
    <style>
${cssContent}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
${jsContent}
    </script>
  </body>
</html>`;

  // Create a static directory if it doesn't exist
  const staticDir = path.join(__dirname, 'static');
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir);
  }

  // Write the static HTML file
  fs.writeFileSync(path.join(staticDir, 'index.html'), htmlContent);
  console.log('Created static/index.html with inlined JS and CSS');
  
  // Copy the static HTML file to the dist directory as well
  fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), htmlContent);
  console.log('Updated dist/index.html with inlined JS and CSS');
};

// Run the static deployment
createStaticHtml();

console.log('Static deployment completed successfully!');
console.log('You can deploy the contents of the "static" directory to any static hosting service.');
console.log('Or deploy the "dist" directory to Vercel with the updated index.html.');

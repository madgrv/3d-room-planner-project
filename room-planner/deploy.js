// Simple deployment helper script
const fs = require('fs');
const path = require('path');

// Function to copy the dist directory to a deployment-ready structure
function prepareForDeployment() {
  console.log('Preparing for deployment...');
  
  // Get the list of files in the dist/assets directory
  const assetsDir = path.join(__dirname, 'dist', 'assets');
  const files = fs.readdirSync(assetsDir);
  
  // Find the JS and CSS files
  const jsFile = files.find(file => file.endsWith('.js'));
  const cssFile = files.find(file => file.endsWith('.css'));
  
  if (!jsFile || !cssFile) {
    console.error('Could not find JS or CSS files in the dist/assets directory');
    process.exit(1);
  }
  
  // Create a deployment-ready index.html
  const deploymentHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>3D Room Planner</title>
    <link rel="stylesheet" href="./assets/${cssFile}">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./assets/${jsFile}"></script>
  </body>
</html>`;

  // Write the deployment-ready index.html to the dist directory
  fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), deploymentHtml);
  
  console.log('Deployment preparation complete!');
  console.log(`JS file: ${jsFile}`);
  console.log(`CSS file: ${cssFile}`);
}

// Run the deployment preparation
prepareForDeployment();

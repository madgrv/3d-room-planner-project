// Enhanced deployment helper script to work around MIME type issues
const fs = require('fs');
const path = require('path');

// Function to prepare the deployment with MIME type workaround
function prepareForDeployment() {
  console.log('Preparing for deployment with MIME type workaround...');
  
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
  
  // Create a deployment-ready index.html that avoids module MIME type issues
  // We use a standard script tag instead of type="module" to avoid MIME type errors
  const deploymentHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>3D Room Planner</title>
    <link rel="stylesheet" href="./assets/${cssFile}">
    <!-- Using a standard script tag to avoid MIME type errors -->
    <script>
      // This ensures the script loads after the page is ready
      window.addEventListener('DOMContentLoaded', function() {
        // Dynamically create a script element
        var script = document.createElement('script');
        // Use standard script type instead of module to avoid MIME type errors
        script.src = './assets/${jsFile}';
        document.body.appendChild(script);
      });
    </script>
  </head>
  <body>
    <div id="root"></div>
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

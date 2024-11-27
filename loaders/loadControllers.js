const fs = require('fs');
const path = require('path');

function loadControllers(dir) {
    const normalizedPath = path.join(__dirname, dir);
    fs.readdirSync(normalizedPath).forEach(file => {
        const filePath = path.join(normalizedPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            loadControllers(path.join(dir, file)); // Recursively load subdirectories
        } else if (file.indexOf('.js') !== -1) {
            require(filePath); // Require the .js file
        }
    });
}

module.exports = loadControllers;

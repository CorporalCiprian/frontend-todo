const { app } = require('@azure/functions');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.ico': 'image/x-icon'
};

app.http('serveReact', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: '{*filePath}',
    handler: async (request, context) => {
        
        let filePath = request.params.filePath || 'index.html';
        
        let fullPath = path.join(__dirname, '../../dist', filePath);

        if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
            fullPath = path.join(__dirname, '../../dist', 'index.html');
        }

        const ext = path.extname(fullPath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        try {
            const fileContent = fs.readFileSync(fullPath);
            return {
                status: 200,
                body: fileContent,
                headers: {
                    'Content-Type': contentType
                }
            };
        } catch (error) {
            return {
                status: 500,
                body: "Error loading file: " + error.message
            };
        }
    }
});
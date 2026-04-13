const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    // Simple static file serving for this small project
    if (req.method === "GET") {
        // Redirect root or /login to the actual login file so relative paths work
        if (req.url === "/" || req.url === "/login") {
            res.writeHead(302, { 'Location': '/views/login/login.html' });
            res.end();
            return;
        }

        // Serve other files from project root (index.html, css, js, views, img...)
        // normalize url
        const safePath = path.normalize(req.url).replace(/^\/+/, '');
        const filePath = path.join(__dirname, safePath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.webp': 'image/webp',
            }[ext] || 'application/octet-stream';
            const data = fs.readFileSync(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
            return;
        }

        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
        return;
    }

    if (req.method === "POST" && req.url === "/login") {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                const username = payload.username;
                const password = payload.password;

                const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')));
                const user = users.find(u => u.username === username || u.email === username);

                if (user && user.password === password) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, name: user.name }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false }));
                }
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'invalid_request' }));
            }
        });
        return;
    }

    // Fallback
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
});

server.listen(3000, () => { 
    console.log("Server läuft auf http://localhost:3000"); 
});
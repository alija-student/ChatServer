const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    // Simple static file serving for this small project
    if (req.method === "GET") {
        // Redirect root or /login to the actual login file so relative paths work
        if (req.url === "/" || req.url === "/login") {
            res.writeHead(302, { 'Location': '/login.html' });
            res.end();
            return;
        }

        // API: return stored broadcast messages
        if (req.url === '/messages') {
            try {
                    console.log('GET /messages');
                const msgFile = path.join(__dirname, 'broadcast_messages.json');
                if (!fs.existsSync(msgFile)) {
                    fs.writeFileSync(msgFile, JSON.stringify([]));
                }
                const messages = JSON.parse(fs.readFileSync(msgFile));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(messages));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'could_not_read_messages' }));
            }
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

    // Persist and broadcast messages
    if (req.method === 'POST' && req.url === '/messages') {
        const chunks = [];
        req.on('data', chunk => { chunks.push(Buffer.from(chunk)); });
        req.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8');
            console.log('POST /messages raw length', raw.length);
            try {
                if (!raw || raw.trim().length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'empty_body' }));
                    return;
                }
                let payload;
                try {
                    payload = JSON.parse(raw);
                } catch (parseErr) {
                    console.error('JSON parse failed for /messages body:', raw);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'invalid_json', body: raw }));
                    return;
                }

                const text = String(payload.text || '').trim();
                const user = String(payload.user || 'Anonym');

                if (!text) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'empty_message' }));
                    return;
                }

                const msgFile = path.join(__dirname, 'broadcast_messages.json');
                let messages = [];
                if (fs.existsSync(msgFile)) {
                    try {
                        messages = JSON.parse(fs.readFileSync(msgFile));
                        if (!Array.isArray(messages)) messages = [];
                    } catch (e) {
                        console.error('Could not parse existing messages file, resetting.', e);
                        messages = [];
                    }
                }
                const message = { id: Date.now(), user: user, text: text, ts: new Date().toISOString() };
                messages.push(message);
                fs.writeFileSync(msgFile, JSON.stringify(messages, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message }));
            } catch (err) {
                console.error('POST /messages unexpected error', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'server_error' }));
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
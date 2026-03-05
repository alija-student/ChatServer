//to run server.js type "node server.js" into console
//in order to run server.js you need to install Node.js 
//Server now runs on http://localhost:3000


const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) =>{

    if (req.method === "GET" && req.url ==="/")
    {
        const html = fs.readFileSync("index.html");
        res.writeHead(200, {"Content-Type": "text/html"});
    }
    else if (req.method === "POST" && req.url === "/login")
    {
        let body = "";
        req.on("data", chunk => {body.url === "/login"});

        req.on
        ("end", chunk => 
            {
                const data = JSON.parse(body); 
                const users = JSON.parse(fs.readFileSync("users.json"));
                const user = users.find(u => u.username === data.username && u.username === data.password);

                res.writeHead(200, {"Content-Type": "application/json"});

                if (user)
                {
                    res.end(JSON.stringify({success: true, name: user.name}));
                }
                else
                {
                    res.end(JSON.stringify({success: false}));
                }
            }
        )
    }
    server.listen(3000, () => { console.log("Server läuft auf http://localhost:3000")});
})
setTimeout(() => {console.log("Nach 2 Sekunden");}, 2000);
require('dotenv').config();
var http = require('http');
var url = require('url');
var fs = require('fs');

const port = process.env.PORT;
const appHost = process.env.APP_HOST;
const appPort = process.env.APP_PORT;

const server = http.createServer(function (req, res) {
    let u = url.parse(req.url, true);
    if (u.pathname === "/transit"){
        let q = u.query;
        let filename = `./data/${q.region}/${q.location}.json`;
        fs.readFile(filename, function(err, data) {
            if (err) {
                res.writeHead(404, {
                    "Content-Type": "text/html",
                    "Access-Control-Allow-Origin": `http://${appHost}:${appPort}`,
                    "Access-Control-Allow-Methods": "GET",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                });
                return res.end();
            }
            res.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": `http://${appHost}:${appPort}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            });
            res.write(data);
            return res.end();
        });
    } else {
        res.writeHead(404, {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": `http://${appHost}:${appPort}`,
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        });
        res.end();
    }
});

server.listen(port, () => {
    const address = server.address();
    console.log(`Server listening on port ${address.port}`);
});


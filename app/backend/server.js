var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
    let u = url.parse(req.url, true);
    if (u.pathname === "/transit"){
        let q = u.query;
        let filename = `./data/${q.region}/${q.location}.json`;
        fs.readFile(filename, function(err, data) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end();
            }
            //console.log(req.headers.host);
            res.writeHead(200, {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://130.216.217.4:8080",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            });
            res.write(data);
            return res.end();
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end();
    }
}).listen(8081);
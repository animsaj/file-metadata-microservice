var http = require('http');
var fs = require("fs");
var Busboy = require('busboy');

http.createServer(function (req, res) {
   if(req.url === '/' && req.method == "GET") {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('index.html').pipe(res);
    } else if(req.method === "POST") {
        var busboy = new Busboy({ headers: req.headers });
        var fileBuffer = [];
        var size;
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            file.on('data', function(data) {
                fileBuffer.push(data.length);
            });
            file.on('end', function() {
                size = fileBuffer.reduce( (a, b) => a + b);
            });
        });
        busboy.on('finish', function() {
            res.end(JSON.stringify({ fileSize: size }));
        });
    req.pipe(busboy);
    } else {
        res.end("Page not found");
    }
}).listen(process.env.PORT || 8080);
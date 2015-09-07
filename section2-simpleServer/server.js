// Require Modules
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

// Array of Mime Types
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/ipeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

// Create Server
http.createServer(function(req, res) {
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(), unescape(uri));     // cwd: current work directory
    console.log('Loading ' + uri);
    var stats;

    try {
        stats = fs.lstatSync(fileName);
        // catch error
    } catch(e) {
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;
    }

    // Check if file or directory
    if (stats.isFile()) {
        // get the mimeType
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        // 200 means OK, success
        res.writeHead(200, {'Content-type': mimeType});

        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        // 302 means redirect
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else {
        // not a file and not directory
        // 500 means internal error
        res.writeHead(500, {'Content-type': 'text/plain'});
        res.write('500 Internal Error');
        res.end();
    }
}).listen(3000);

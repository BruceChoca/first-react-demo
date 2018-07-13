const http = require('http')
const path = require('path')
const url = require('url');
const fs = require('fs');

const port = process.env.HTTPPORT || '80';
const mime = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

http.createServer(function(request, response) {
    let requestUrl = request.url;
    let pathName = url.parse(requestUrl).pathname;
    pathName = pathName.replace('/bruce', '');
    if(pathName === '/' || pathName.length === 0) { pathName = '/index.html'; }
    pathName = '\\build\\' + decodeURI(pathName);

    let filePath = path.resolve(__dirname + pathName);
    console.log(filePath);
    
    let ext = path.extname(pathName);
    ext = ext ? ext.slice(1) : 'unknown';
    let contentType = mime[ext] || "text/plain";

    fs.stat(filePath, (err, stats) => {
        if (err) {
            // contentType = "text/html";
            // filePath = path.resolve(__dirname + '/build/index.html');

            let url = 'http://' + request.headers['host'] + '/bruce';
            response.writeHead(307, { 'location': url });
            response.end();
            return;
        }
        response.writeHead(200, { "content-type": contentType });

        let stream = fs.createReadStream(filePath);
        stream.pipe(response);
    });
}).listen(port, function () {
    console.log('Http server listening on port ' + port);
    
});
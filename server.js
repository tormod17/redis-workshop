var http = require('http');
var port = process.env.PORT || 3000;
var redis = require("redis");

var client = redis.createClient();
client.del('favourites');
http.createServer(handler).listen(port, function serverStarted() {
    console.log("I'm ready");
});

function handler(request, response) {
    if (request.url === '/') {
        if (request.method === 'GET') {
            serveRedis(response);        
        } else if (request.method === 'POST') {
            postData(request, response);
        }
    }
}

function postData(request, response) {
    var chunk = '';
    request.on('data', function(data) {
        chunk += data;
    });
    request.on('end', function() {
        // TODO: make sure add command finishes first
        addToRedis(chunk.split('=')[1]);
        serveRedis(response);
    });
}

function serveRedis(res) {
    getRedis(function(error, reply){
        res.writeHead(200, {"Content-Type": "text/html"})
        res.end(createIndexHTML(reply));
    });
}

function addToRedis(chunk) {
    client.rpush(["favourites", chunk])
}

function getRedis(callback) {
    client.lrange('favourites', 0, -1, callback);
}

function createIndexHTML(favourites) {
	var out = 
        "<!DOCTYPE html>"+
		"<html lang='en'>"+
    		"<head> <meta charset='UTF-8'>"+
    		  "<title>Document</title>"+
            "</head>"+
    		"<body>" +
        		"<h5>My Favourite Things</h5>"+
        		"<form method=\"POST\" action=\"/\">"+
            		"<input type=\"text\" name=\"item\" ></input>"+
            		"<input type=\"submit\" ></input>"+
        		"</form>"+
        		"<ul>";
    favourites.forEach(function(elem) {
        out += 
                "<li>" + 
                    elem + 
                "</li>";
    });
    out += 
                "</ul>"+
            "</body>" +
        "</html>"; 
		return out;
}

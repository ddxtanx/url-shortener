var express = require('express');
var app = express();
var fs = require('fs');
//Instead of going through a database, I decided a text file would be more reliable and easier
function getRandomNumber(max){
    return Math.floor(Math.random()*max);
}
app.get('/new/*', function(req,res){
    var url = req.url;
    if(url.slice(0, 4)=="/new"){
        console.log("Creating new string");
        var url = req.url.slice(5, req.url.length);
        var random = getRandomNumber(10000)+10000 //Ensures it will be at least 5 characters long
        var writeString = url+","+random+"\n";
        fs.appendFile("./urls.txt", writeString, 'utf-8', function(err, data){
            if(err) throw err;
            var json = {
                'original-url': url,
                'short-url': 'http://free-code-school-ddxtanx.c9users.io/'+random
            }
            res.writeHead(200, {'Content-Type': 'text/json'});
            res.end(JSON.stringify(json));
        });
    } else{
        next();
    }
});
app.get("/:id", function(req, res){
    var id = req.params.id;
    fs.readFile("./urls.txt", function(err, data){
        if (err) throw err;
        var lines = data.toString().split("\n");
        for(var x = 0; x<lines.length; x++){
            var writtenId = lines[x].split(",")[1];
            if(writtenId==id){
                res.redirect(lines[x].split(",")[0]);
                res.end();
            }
        }
    })
})

app.listen(8080)
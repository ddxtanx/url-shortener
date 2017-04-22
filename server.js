var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
//This is the mongodb version
function getRandomNumber(max){
    return Math.floor(Math.random()*max);
}
app.get('/new/*', function(req,res){
    var url = req.url;
    if(url.slice(0, 4)=="/new"){
        console.log("Creating new string");
        var url = req.url.slice(5, req.url.length);
        if(url.includes("http://")){
            var random = getRandomNumber(10000)+10000 //Ensures it will be at least 5 characters long
            var writeString = url+","+random+"\n";
            mongo.connect('mongodb://admin:password@ds115071.mlab.com:15071/urls', function(err, db){
                if(err) throw err;
                var shortens = db.collection('shortens');
                var insdata = {
                    'url': url,
                    'id': random
                }
                shortens.insert(insdata, function(err, data){
                    if(err) throw err;
                    res.writeHead(200, {'Content-Type': 'text/json'});
                    var reply = {
                        'original-url': url,
                        'shortened-url': "https://free-code-school-ddxtanx.c9users.io/"+random
                    }
                    res.end(JSON.stringify(reply));
                })
            })
        } else{
            res.writeHead(404, {'Content-Type': 'text/json'});
            res.end("{'error': 'Please input a valid url'");
        }
    }
});
app.get("/:id", function(req, res){
    var id = req.params.id;
    console.log(id);
    mongo.connect('mongodb://admin:password@ds115071.mlab.com:15071/urls', function(err, db){
        if(err) throw err;
        var shortens = db.collection('shortens');
        shortens.find({
            id: parseInt(id) 
        }).toArray(function(err, data){
            if(err) throw err;
            console.log(data);
            if(data.length!==0){
                res.redirect(data[0]['url']);
            }
            res.end();
            db.close();
        });
    })
});

app.listen(process.env.PORT || 8080)
var express = require('express');
var fs = require('fs');
var path = require('path');
var urlTool = require('url');
var util = require('util');
var app = express();
var jsonDataFile = path.join(__dirname, 'url.json');

Array.prototype.findIdByUrl = function (url) {
    for(var i = 0; i < this.length; ++i) {
        if(this[i][1] == url) {
            return this[i][0];
        }
    }
    return false;
};
Array.prototype.findUrlById = function (id) {
    for(var i = 0; i < this.length; ++i) {
        if(this[i][0] == id) {
            return this[i][1];
        }
    }
    return false;
};

app.set('port', (process.env.PORT || 5000));

app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );

app.set('views', require('path').join(__dirname, 'views'));
app.use(express.static(require('path').join(__dirname, 'public')));


app.get('/', function(request, response) {
    response.render('pages/index');
});
app.get('/new/',function(req,res){
    res.send({
        error:"Please provide URL"
    });
});


app.get('/:id', function (req, res) {
    fs.readFile(jsonDataFile, function(err, data) {
        if (err) {
            res.send(err);
            return;
        }
        var jsonData = JSON.parse(data);
        if (util.isArray(jsonData['urls'])) {
            var url = jsonData['urls'].findUrlById(req.params.id);
            if (url) {
                res.redirect(url);
                return;
            }
        }
        res.send({"error":"No short url found for given input"});
    });

});

app.get('/new/:url', function (req, res) {

    var regex = /^((http|https):\/\/)?([\w!@#$%^&*()-=_\+]+\.[^\/])+[\w!@#$%^&*()-=_\+]+$/ig;
    var url = req.params.url;

    if(!regex.test(url)) {
        res.send({"error":"URL invalid"});
        return false;
    }
    fs.readFile(jsonDataFile, function(err, data){
        if (err) {
            res.send(err);
            return;
        }

        var jsonData = JSON.parse(data);
        if (util.isArray(jsonData['urls'])) {
            var id = jsonData['urls'].findIdByUrl(url);
            if (id) {
                res.send( { "original_url": url, "short_url": req.protocol + '://' + req.get('host') + '/' + id } );
                return true;
            } else {
                var preId = jsonData['urls'][jsonData['urls'].length - 1][0];
                var newId = jsonData['urls'].length;
                newId = newId > preId ? newId : (preId+1);
                jsonData['urls'].push([newId, url]);

                console.log(id,preId,newId);
                res.send( { "original_url": url, "short_url": req.protocol + '://' + req.get('host') + '/' + newId} );
            }
        } else {
            jsonData = {
                urls: [
                    [1, url]
                ]
            };
            res.send( { "original_url": url, "short_url": req.protocol + '://' + req.get('host') + '/' + 1 } );
        }

        fs.writeFile(jsonDataFile, JSON.stringify(jsonData), function (err) {
            if (err) throw err;
            console.log("Export Account Success!");
        });
    });
});





app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});



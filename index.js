var express = require('express');
var fs = require('fs');
var path = require('path');
var url = require('url');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );

app.set('views', require('path').join(__dirname, 'views'));
app.use(express.static(require('path').join(__dirname, 'public')));


app.get('/', function(request, response) {
    response.render('pages/index');
});
app.get('/new/:url(*)', function (req, res) {

    //res.send(req.params.url);







    var data = {
        urls: [
            [1,'http://www.baidu.com'],
            [2,'http://www.google.com']
        ]
    }
    fs.writeFile(path.join(__dirname, 'url.json'), JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log("Export Account Success!");
    });
    res.send('ok');
});
app.get('/:id', function (req, res) {
    var sDate = decodeURI(req.params.id);
    sDate = decodeURI(sDate);
    if(sDate.match(/^\d+$/)){
        sDate = parseInt(sDate);
    }
    var date = new Date(sDate);
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if(date.toString() == 'Invalid Date'){
        res.send('null');
    } else {
        var data = {
            "unix": date.getTime(),
            "natural": months[date.getMonth()] + ' ' + date.getDate() + ',' + date.getFullYear()
        }
    }

    res.send(data);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});



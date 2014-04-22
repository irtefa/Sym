var express = require('express');
var jade = require('jade');
var http = require('http');
var _ = require('underscore');

var app = express();

app.listen(process.env.PORT || 3000);

app.configure(function() {
    app.use(express.bodyParser());
});

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(express.static(__dirname + '/public'))

app.set('view options', {
    layout: false
});

app.get('/', function(req, res) {
    res.render('index.jade', {
        title: 'sym'
    });
});

app.get('/test', function(req, res) {
    res.render('test.jade', {
        title: 'sym'
    });
});

app.post('/search', function(req, res) {
    var querystring = '';
    _.each(req.body.query, function(q) {
        querystring += '+symptoms:'+q+'*&';
    })

    var options = {
        host: 'localhost',
        path: '/symptom/data/_search?q='+querystring+'pretty=true&size=100',
        port: 9200,
        method: 'GET'
    };

    console.log('/symptom/data/_search?q='+querystring+'*&pretty=true&size=100')

    callback = function(response) {
        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });
        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            str.replace(/\s+/g, ' ');
            res.send(str);
        });
    }
    var request = http.request(options, callback);
    request.on('error', function(err){
       console.log(err);
       res.send("");
    });
    request.end();
});


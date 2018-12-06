var express = require("express");
var path = require('path');

var app = express();

var server = app.listen(8081, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});

app.use(express.static('Line Chart_files/'))
app.use(express.static('index.js'))

// requests will never reach this route
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/Line Chart.html'));
});

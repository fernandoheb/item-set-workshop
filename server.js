const express = require('express');

// Instantiate server
var app = express();

// Common configuration
var port = process.argv[2] || 3000;

// Configure routing resources
app.use(express.static('app'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/app/' + 'index.html');
});


// Start server
app.listen(port);

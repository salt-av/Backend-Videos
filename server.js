const express = require('express');

const app = express();
const port = 8080;

// sendFile will go here
app.get('/', function(req, res) {
    res.sendFile(path.join('./index.html'));
  });

app.listen(port);
console.log('Server started at http://localhost:' + port);
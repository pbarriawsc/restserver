require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { request } = require('express')
const Sequelize=require('sequelize')
const cors = require('cors')
const fileupload = require("express-fileupload");
const fs = require('fs');
const https = require('https');
const http = require('http');
/*
var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 
}

*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use(cors())
app.use(fileupload());
app.use(require('./routes/index'))

app.get('/', function (req, res) {
  res.json('Bienvenido al server express')
})

/*http.createServer({}, app).listen(3001, function(){
  console.log("My HTTP server listening on port 3001...");
});*/

https.createServer({
  key: fs.readFileSync('../wscargo/cargows.key'),
  cert: fs.readFileSync('../wscargo/cargows.crt')
}, app).listen(process.env.PORT, function(){
  console.log("My HTTPS server listening on port " + process.env.PORT + "...");
});
 

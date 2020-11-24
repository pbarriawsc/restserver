require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { request } = require('express')
const Sequelize=require('sequelize')
var sqlz = new Sequelize('postgres://postgres:wsc2020@localhost:5432/wscargo');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use(require('./routes/index'))

sqlz
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });
 
app.get('/', function (req, res) {
  res.json('Bienvenido al server express')
})
 
app.listen(process.env.PORT,()=>{
    console.log('escuchando puerto 3000');
})
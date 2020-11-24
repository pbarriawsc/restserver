require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { request } = require('express')
const Sequelize=require('sequelize')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use(require('./routes/index'))

app.get('/', function (req, res) {
  res.json('Bienvenido al server express')
})
 
app.listen(process.env.PORT,()=>{
    console.log('escuchando puerto 3000');
})
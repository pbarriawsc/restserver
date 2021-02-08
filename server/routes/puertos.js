const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/puertos';
const puertosController=require('../controllers/puertosCtrl');

app.get(`${prefix}`,verifyToken,puertosController.list);

module.exports=app;

const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/tipoContacto';
const tipoContactoController=require('../controllers/tipoContactoCtrl');

app.get(`${prefix}`,verifyToken,tipoContactoController.list);


module.exports=app;
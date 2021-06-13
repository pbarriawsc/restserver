const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/recepcion_chile/confirmacion';
const recepcionChileController=require('../controllers/recepcionChileCtrl');

app.post(`${prefix}/simple`,verifyToken,recepcionChileController.createSimple);
app.post(`${prefix}/bodega`,verifyToken,recepcionChileController.createBodega);
app.post(`${prefix}/transporte`,verifyToken,recepcionChileController.createTransporte);

module.exports=app;
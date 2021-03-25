const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/bodegas_ubicaciones';
const bodegasUbicacionesController=require('../controllers/bodegas_ubicacionesCtrl');

app.get(`${prefix}`,verifyToken,bodegasUbicacionesController.list);

module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/bodega_ubicaciones_detalle';
const bodegaUbicacionesDetalleController=require('../controllers/bodegas_ubicaciones_detalleCtrl');

app.get(`${prefix}`,verifyToken, bodegaUbicacionesDetalleController.list);
module.exports=app;
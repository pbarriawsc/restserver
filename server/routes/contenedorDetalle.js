const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/contenedorDetalle';
const contenedorDetalleController=require('../controllers/contenedorDetalleCtrl');

app.post(`${prefix}/:id`,verifyToken, contenedorDetalleController.create);
app.get(`${prefix}/contenedor/:id`,verifyToken, contenedorDetalleController.listByContenedor);

module.exports=app;
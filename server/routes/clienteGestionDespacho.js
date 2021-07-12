const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/cliente_gestion_despacho';
const clienteGestionDespachoController=require('../controllers/clienteGestionDespachoCtrl');

app.post(`${prefix}`,verifyToken, clienteGestionDespachoController.create);
app.get(`${prefix}/contenedor/:id`,verifyToken, clienteGestionDespachoController.listByContenedor);

module.exports=app;
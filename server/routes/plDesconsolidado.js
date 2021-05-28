const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/pl_desconsolidado';
const plDesconsolidadoController=require('../controllers/plDesconsolidadoCtrl');

app.get(`${prefix}`,verifyToken,plDesconsolidadoController.list);

app.get(`${prefix}/:id`,verifyToken, plDesconsolidadoController.findOneBy)

app.get(`${prefix}/contenedor/:fk_contenedor`,verifyToken, plDesconsolidadoController.findOneByContenedor)

app.post(`${prefix}`,verifyToken, plDesconsolidadoController.create)

app.delete(`${prefix}/:id`,verifyToken, plDesconsolidadoController.delete)

app.put(`${prefix}/:id`,verifyToken, plDesconsolidadoController.update)


module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/consolidados';
const consolidadosController=require('../controllers/consolidadosCtrl');

app.post(`${prefix}`,verifyToken, consolidadosController.create);
app.get(`${prefix}/tracking/cliente/:id`,verifyToken, consolidadosController.listTrackingConsolidadoByClient);
app.get(`${prefix}/cliente/:id`,verifyToken, consolidadosController.listByClient);
app.get(`${prefix}/:id/trackings`,verifyToken, consolidadosController.listTrackingConsolidadoById);
app.put(`${prefix}/:id`,verifyToken, consolidadosController.update);
app.get(`${prefix}/propuestasComerciales/cliente/:id`,verifyToken, consolidadosController.listGcConsolidadoByClient);
app.put(`${prefix}/cargaContenedor/:id`,verifyToken, consolidadosController.updateStateToCharge);

module.exports=app;
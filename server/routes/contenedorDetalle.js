const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/contenedorDetalle';
const contenedorDetalleController=require('../controllers/contenedorDetalleCtrl');

app.post(`${prefix}/:id`,verifyToken, contenedorDetalleController.create);
app.get(`${prefix}/contenedor/:id`,verifyToken, contenedorDetalleController.listByContenedor);
app.put(`${prefix}/estadoTracking/:id`,verifyToken, contenedorDetalleController.updateEstadoTracking);
app.delete(`${prefix}/:id`,verifyToken, contenedorDetalleController.delete);
app.get(`${prefix}/contenedornoplanificado/:id`,verifyToken, contenedorDetalleController.listByContenedorNoPlanificado);
app.get(`${prefix}/contenedor/:fk_contenedor/cliente/:fk_cliente`,verifyToken, contenedorDetalleController.getByClientAndContainer);



module.exports=app;
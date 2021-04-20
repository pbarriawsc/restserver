const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const contenedorTrackingCtrl=require('../controllers/contenedorTrackingCtrl');
const prefix='/api/contenedor_tracking';

app.get(`${prefix}/contenedor/:fk_contenedor`,verifyToken,contenedorTrackingCtrl.listByContenedorActivo);
app.post(`${prefix}/:fk_contenedor`,verifyToken,contenedorTrackingCtrl.create);
app.delete(`${prefix}/:id`,verifyToken,contenedorTrackingCtrl.delete);
module.exports=app;

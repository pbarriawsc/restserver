const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/ordenes_transporte';
const ordenesTransporteController=require('../controllers/ordenesTransporteCtrl');

app.get(`${prefix}`,verifyToken,ordenesTransporteController.list);
app.post(`${prefix}`,verifyToken,ordenesTransporteController.create);
app.delete(`${prefix}/:id`,verifyToken,ordenesTransporteController.delete);

module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/trackingDetalle';
const trackingDetalleController=require('../controllers/trackingDetalleCtrl');

app.put(`${prefix}/:id`,verifyToken, trackingDetalleController.update)

module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/trackingDetalle';
const trackingDetalleController=require('../controllers/trackingDetalleCtrl');

app.put(`${prefix}/:id`,verifyToken, trackingDetalleController.update);
app.post(`${prefix}/tracking/:id/upload/:uploadId`,verifyToken, trackingDetalleController.uploadFilesDetail);
app.get(`${prefix}/photo1/:id`,[], trackingDetalleController.getPhoto1);
app.get(`${prefix}/photo2/:id`,[], trackingDetalleController.getPhoto2);
app.get(`${prefix}/photo3/:id`,[], trackingDetalleController.getPhoto3);

module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/trackingObservaciones';
const trackingObservacionesController=require('../controllers/trackingObservacionesCtrl');

app.post(`${prefix}/:id`,verifyToken, trackingObservacionesController.create);
app.get(`${prefix}/:id`,verifyToken, trackingObservacionesController.list);

module.exports=app;
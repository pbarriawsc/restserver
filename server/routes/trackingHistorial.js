const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/trackingHistorial';
const trackingHistorialController=require('../controllers/trackingHistorialCtrl');

app.get(`${prefix}/:id`,verifyToken, trackingHistorialController.list)

module.exports=app;
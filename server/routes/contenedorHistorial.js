const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/contenedorHistorial';
const contenedorHistorialController=require('../controllers/contenedorHistorialCtrl');

app.get(`${prefix}/:id`,verifyToken, contenedorHistorialController.list);

module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/lineas_navieras';
const lineasNavierasController=require('../controllers/lineasNavierasCtrl');

app.get(`${prefix}`,verifyToken,lineasNavierasController.list);

module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/gc_propuestas_estados';
const gcPropuestasEstadosController=require('../controllers/gc_propuestas_estadosCtrl');

app.get(`${prefix}`,verifyToken,gcPropuestasEstadosController.list);

module.exports=app;
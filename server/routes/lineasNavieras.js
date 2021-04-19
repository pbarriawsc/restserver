const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/lineas_navieras';
const lineasNavierasController=require('../controllers/lineasNavierasCtrl');

app.get(`${prefix}`,verifyToken,lineasNavierasController.list);
app.get(`${prefix}/estado/:estado`,verifyToken,lineasNavierasController.listByEstado);
app.post(`${prefix}`,verifyToken,lineasNavierasController.create);
app.put(`${prefix}/:id`,verifyToken,lineasNavierasController.update);
app.delete(`${prefix}/:id`,verifyToken,lineasNavierasController.delete);

module.exports=app;
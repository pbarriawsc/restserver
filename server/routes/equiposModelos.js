const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/equipos_modelos';
const equiposModelosController=require('../controllers/equiposModelosCtrl');

app.get(`${prefix}`,verifyToken,equiposModelosController.list);

app.get(`${prefix}/:id`,verifyToken, equiposModelosController.findOneBy)

app.post(`${prefix}`,verifyToken, equiposModelosController.create)

app.put(`${prefix}`,verifyToken, equiposModelosController.update)

app.delete(`${prefix}/:id`,verifyToken, equiposModelosController.delete)

module.exports=app;

const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/equipos_marcas';
const equiposMarcasController=require('../controllers/equiposMarcasCtrl');

app.get(`${prefix}`,verifyToken,equiposMarcasController.list);

app.get(`${prefix}/:id`,verifyToken, equiposMarcasController.findOneBy)

app.post(`${prefix}`,verifyToken, equiposMarcasController.create)

app.put(`${prefix}`,verifyToken, equiposMarcasController.update)

app.delete(`${prefix}/:id`,verifyToken, equiposMarcasController.delete)

module.exports=app;
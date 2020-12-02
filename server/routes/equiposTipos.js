const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/equipos_tipos';
const equiposTiposController=require('../controllers/equiposTiposCtrl');

app.get(`${prefix}`,verifyToken,equiposTiposController.list);

app.get(`${prefix}/:id`,verifyToken, equiposTiposController.findOneBy)

app.post(`${prefix}`,verifyToken, equiposTiposController.create)

app.put(`${prefix}`,verifyToken, equiposTiposController.update)

app.delete(`${prefix}/:id`,verifyToken, equiposTiposController.delete)

module.exports=app;
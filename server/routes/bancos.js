const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/bancos';
const bancosController=require('../controllers/bancosCtrl');

app.get(`${prefix}`,verifyToken,bancosController.list);

app.get(`${prefix}/:id`,verifyToken, bancosController.findOneBy)

app.post(`${prefix}`,verifyToken, bancosController.create)

app.put(`${prefix}`,verifyToken, bancosController.update)

app.delete(`${prefix}/:id`,verifyToken, bancosController.delete)

module.exports=app;

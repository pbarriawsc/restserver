const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/impuestos';
const impuestosController=require('../controllers/impuestosCtrl');

app.get(`${prefix}`,verifyToken,impuestosController.list);

app.get(`${prefix}/:id`,verifyToken, impuestosController.findOneBy)

app.post(`${prefix}`,verifyToken, impuestosController.create)

app.put(`${prefix}`,verifyToken, impuestosController.update)

app.delete(`${prefix}/:id`,verifyToken, impuestosController.delete)

module.exports=app;
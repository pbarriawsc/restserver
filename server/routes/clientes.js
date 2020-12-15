const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/clientes';
const clientesController=require('../controllers/clientesCtrl');

app.get(`${prefix}`,verifyToken,clientesController.list);

app.get(`${prefix}/:id`,verifyToken, clientesController.findOneBy)

app.post(`${prefix}`,verifyToken, clientesController.create)

app.put(`${prefix}`,verifyToken, clientesController.update)

app.delete(`${prefix}/:id`,verifyToken, clientesController.delete)

module.exports=app;

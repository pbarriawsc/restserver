const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/comunas';
const comunasController=require('../controllers/comunasCtrl');

app.get(`${prefix}`,verifyToken,comunasController.list);

app.get(`${prefix}/:id`,verifyToken, comunasController.findOneBy)

app.post(`${prefix}`,verifyToken, comunasController.create)

app.put(`${prefix}`,verifyToken, comunasController.update)

app.delete(`${prefix}/:id`,verifyToken, comunasController.delete)

module.exports=app;
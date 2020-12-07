const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/familias_arancelarias_productos';
const familiasArancelariasProductosController=require('../controllers/familiasArancelariasProductosCtrl');

app.get(`${prefix}`,verifyToken,familiasArancelariasProductosController.list);

app.get(`${prefix}/:id`,verifyToken, familiasArancelariasProductosController.findOneBy)

app.post(`${prefix}`,verifyToken, familiasArancelariasProductosController.create)

app.put(`${prefix}`,verifyToken, familiasArancelariasProductosController.update)

app.delete(`${prefix}/:id`,verifyToken, familiasArancelariasProductosController.delete)

module.exports=app;
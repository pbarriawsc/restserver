const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/familias_comerciales_productos';
const familiasComercialesProductosController=require('../controllers/familiasComercialesProductosCtrl');

app.get(`${prefix}`,verifyToken,familiasComercialesProductosController.list);

app.get(`${prefix}/:id`,verifyToken, familiasComercialesProductosController.findOneBy)

app.post(`${prefix}`,verifyToken, familiasComercialesProductosController.create)

app.put(`${prefix}`,verifyToken, familiasComercialesProductosController.update)

app.delete(`${prefix}/:id`,verifyToken, familiasComercialesProductosController.delete)

module.exports=app;
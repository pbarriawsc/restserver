const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/proveedores';
const proveedoresController=require('../controllers/proveedoresCtrl');

app.get(`${prefix}`,verifyToken,proveedoresController.list);

app.get(`${prefix}/:id`,verifyToken, proveedoresController.findOneBy)

app.post(`${prefix}`,verifyToken, proveedoresController.create)

app.put(`${prefix}`,verifyToken, proveedoresController.update)

app.delete(`${prefix}/:id`,verifyToken, proveedoresController.delete)

module.exports=app;

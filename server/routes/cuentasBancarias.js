const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/cuentas_bancarias';
const cuentasBancariasController=require('../controllers/cuentasBancariasCtrl');

app.get(`${prefix}`,verifyToken,cuentasBancariasController.list);

app.get(`${prefix}/:id`,verifyToken, cuentasBancariasController.findOneBy)

app.post(`${prefix}`,verifyToken, cuentasBancariasController.create)

app.put(`${prefix}`,verifyToken, cuentasBancariasController.update)

app.delete(`${prefix}/:id`,verifyToken, cuentasBancariasController.delete)

module.exports=app;
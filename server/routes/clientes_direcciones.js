const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/clientes_direcciones';
const prefixById='/api/clientes_direcciones_byid';
const prefixByClientes='/api/clientes_direcciones_byidclientes'
const PFCLIDR_GetDireccion='/api/clientes_direcciones_get_direccion';

const clientes_direccionesCtrl=require('../controllers/clientes_direccionesCtrl');

app.get(`${PFCLIDR_GetDireccion}/:id`,verifyToken, clientes_direccionesCtrl.GetDireccion)

app.get(`${prefix}`,verifyToken,clientes_direccionesCtrl.list);

app.get(`${prefix}/:id`,verifyToken, clientes_direccionesCtrl.list)

app.get(`${prefixById}/:id`,verifyToken, clientes_direccionesCtrl.prefixById)

app.post(`${prefixByClientes}`,verifyToken, clientes_direccionesCtrl.listByIdsClientes)

app.post(`${prefix}`,verifyToken, clientes_direccionesCtrl.create)

app.put(`${prefix}`,verifyToken, clientes_direccionesCtrl.update)

app.delete(`${prefix}/:id`,verifyToken, clientes_direccionesCtrl.delete)

module.exports=app;

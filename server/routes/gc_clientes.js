const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/gc_clientes';
const prefixClientes='/api/gc_clientes_clientes';
const prefixDirecciones='/api/gc_clientes_direcciones';

const gc_clientesCtrl=require('../controllers/gc_clientesCtrl');

app.get(`${prefix}/:id`,verifyToken, gc_clientesCtrl.list);

app.get(`${prefixDirecciones}/:id`,verifyToken, gc_clientesCtrl.listDirecciones);

app.get(`${prefixClientes}`,verifyToken, gc_clientesCtrl.listClientes);

app.post(`${prefix}`,verifyToken, gc_clientesCtrl.create)

app.delete(`${prefix}/:id`,verifyToken, gc_clientesCtrl.delete)

module.exports=app;

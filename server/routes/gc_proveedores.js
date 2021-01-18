const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/gc_proveedores';
const prefixProveedores='/api/gc_proveedores_proveedores';

const gc_proveedoresCtrl=require('../controllers/gc_proveedoresCtrl');

app.get(`${prefix}/:id`,verifyToken, gc_proveedoresCtrl.list);

app.get(`${prefixProveedores}`,verifyToken, gc_proveedoresCtrl.listProveedores);

app.post(`${prefix}`,verifyToken, gc_proveedoresCtrl.create)

app.delete(`${prefix}/:id`,verifyToken, gc_proveedoresCtrl.delete)

module.exports=app;

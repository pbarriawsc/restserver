const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const contenedorProformaCtrl=require('../controllers/contenedorProformaCtrl');
const prefix='/api/contenedor_proforma';

app.get(`${prefix}/estado/:estado`,verifyToken,contenedorProformaCtrl.listByEstado);
app.post(`${prefix}`,verifyToken,contenedorProformaCtrl.create);
app.put(`${prefix}/:id`,verifyToken,contenedorProformaCtrl.update);
app.delete(`${prefix}/:id`,verifyToken,contenedorProformaCtrl.delete);
app.put(`${prefix}/confirmar/:id`,verifyToken,contenedorProformaCtrl.confirmContenedor);

module.exports=app;
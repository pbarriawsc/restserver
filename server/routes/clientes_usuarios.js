const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const clientes_usuariosCtrl=require('../controllers/clientes_usuariosCtrl');
const CLIUSU_GetList='/api/clientes_usuarios_get_list';
const CLINOUSU_GetList='/api/clientes_nousuarios_get_list';
const CLIUSU_PostNuevo='/api/clientes_usuarios_post_nuevo';
const CLINOUSU_PostNuevo='/api/clientes_nousuarios_post_nuevo';
const CLIUSU_DELETE='/api/clientes_usuarios_delete';

app.get(`${CLIUSU_GetList}/:id`,verifyToken,clientes_usuariosCtrl.CLIUSU_GetList);
app.get(`${CLINOUSU_GetList}/:id`,verifyToken,clientes_usuariosCtrl.CLINOUSU_GetList);
app.post(`${CLIUSU_PostNuevo}`,verifyToken,clientes_usuariosCtrl.CLIUSU_PostNuevo);
app.post(`${CLINOUSU_PostNuevo}`,verifyToken,clientes_usuariosCtrl.CLINOUSU_PostNuevo);
app.delete(`${CLIUSU_DELETE}/:id`,verifyToken,clientes_usuariosCtrl.CLIUSU_DELETE);

module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/perfilcliente';
const PERCLI_GetList='/api/clienteperfil_get_list';
const PERCLI_GetInfo='/api/clienteperfil_getinfocliente';

const perfilClienteController=require('../controllers/perfilclienteCtrl');

app.get(`${PERCLI_GetList}`,verifyToken, perfilClienteController.PERCLI_GetList);
app.get(`${PERCLI_GetInfo}/:id`,verifyToken, perfilClienteController.PERCLI_GetInfo);

module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/clientes';
const PFCLI_GetClientesList='/api/clientes_get_list_clientes';
const PFCLI_GetCliente='/api/clientes_get_cliente';
const PFCLI_PostCliente='/api/clientes_post_cliente';
const PFCLI_GetComercialesList='/api/clientes_get_list_comerciales';
const PFCLI_PutCliente='/api/clientes_put_cliente';
const PFCLI_DeleteCliente='/api/clientes_delete_cliente';
const PFCLI_GetInfoQr='/api/clientes_get_infoqr';
const PFCLI_UploadFile='/api/clientes_uploadfile';
const PFCLI_Cedula_1='/api/cliente_cedula_1';
const PFCLI_Cedula_2='/api/cliente_cedula_2';
const PFCLI_PoderSimple_1='/api/cliente_podersimple_1';
const PFCLI_PoderSimple_2='/api/cliente_podersimple_2';

const clientesController=require('../controllers/clientesCtrl');

app.get(`${PFCLI_GetClientesList}/:id`,verifyToken, clientesController.GetClientesList);
app.get(`${PFCLI_GetCliente}/:id`,verifyToken, clientesController.GetCliente);
app.post(`${PFCLI_PostCliente}`,verifyToken, clientesController.PostCliente);
app.get(`${PFCLI_GetComercialesList}`,verifyToken, clientesController.GetComercialesList);
app.post(`${PFCLI_PutCliente}`,verifyToken, clientesController.PutCliente);
app.get(`${PFCLI_DeleteCliente}/:id`,verifyToken, clientesController.DeleteCliente);
app.get(`${PFCLI_GetInfoQr}/:id`,verifyToken, clientesController.GetInfoQr);
app.get(`${prefix}`,verifyToken,clientesController.list);
app.get(`${prefix}/codigo/:codigo`,verifyToken, clientesController.findOneByCodigo);
app.put(`${prefix}`,verifyToken, clientesController.update);
app.delete(`${prefix}/:id`,verifyToken, clientesController.delete);
app.post(`${PFCLI_UploadFile}`,verifyToken, clientesController.PFCLI_UploadFile);
app.get(`${PFCLI_Cedula_1}/:id`,[], clientesController.PFCLI_Cedula_1);
app.get(`${PFCLI_Cedula_2}/:id`,[], clientesController.PFCLI_Cedula_2);
app.get(`${PFCLI_PoderSimple_1}/:id`,[], clientesController.PFCLI_PoderSimple_1);
app.get(`${PFCLI_PoderSimple_2}/:id`,[], clientesController.PFCLI_PoderSimple_2);

module.exports=app;
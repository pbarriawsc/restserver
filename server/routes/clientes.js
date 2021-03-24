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



const clientesController=require('../controllers/clientesCtrl');

app.get(`${PFCLI_GetClientesList}/:id`,verifyToken, clientesController.GetClientesList);
app.get(`${PFCLI_GetCliente}/:id`,verifyToken, clientesController.GetCliente);
app.post(`${PFCLI_PostCliente}`,verifyToken, clientesController.PostCliente);
app.get(`${PFCLI_GetComercialesList}`,verifyToken, clientesController.GetComercialesList);
app.post(`${PFCLI_PutCliente}`,verifyToken, clientesController.PutCliente);
app.get(`${PFCLI_DeleteCliente}/:id`,verifyToken, clientesController.DeleteCliente);


app.get(`${prefix}`,verifyToken,clientesController.list);
app.get(`${prefix}/codigo/:codigo`,verifyToken, clientesController.findOneByCodigo);
app.put(`${prefix}`,verifyToken, clientesController.update);
app.delete(`${prefix}/:id`,verifyToken, clientesController.delete);

module.exports=app;

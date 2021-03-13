const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/proveedores';
const prefixList='/api/proveedores_List';
const PF_GetClientes='/api/proveedores_get_clientes';
const PF_GetProveedoresClientes='/api/proveedores_get_proveedores_clientes';
const PF_Post='/api/proveedores_post';
const PF_GetProveedor='/api/proveedores_get_proveedor';
const PF_Put='/api/proveedores_put';
const PF_PostProvCliente='/api/proveedores_post_proveedorcliente';
const PF_GetListProvCliente='/api/proveedores_get_list_proveedorcliente';
const PF_DeleteProveedor='/api/proveedores_delete_proveedor';
const PF_DeleteProveedorPropuesta='/api/proveedores_delete_proveedorpropuesta';
const PF_GetProveedorPropuesta='/api/proveedores_get_proveedorpropuesta';
const PF_PutProvCliente='/api/proveedores_put_proveedorcliente';
const PF_GetInfoQr='/api/proveedores_get_infoqr';



const proveedoresController=require('../controllers/proveedoresCtrl');

app.get(`${PF_GetClientes}`,verifyToken,proveedoresController.GetClientes);

app.get(`${PF_GetProveedoresClientes}/:id`,verifyToken,proveedoresController.GetProveedoresClientes);

app.post(`${PF_Post}`,verifyToken, proveedoresController.Create)

app.get(`${PF_GetProveedor}/:id`,verifyToken,proveedoresController.GetProveedor);

app.post(`${PF_Put}`,verifyToken, proveedoresController.Update);

app.post(`${PF_PostProvCliente}`,verifyToken, proveedoresController.PostProvCliente);

app.get(`${PF_GetListProvCliente}/:id`,verifyToken,proveedoresController.GetListProvCliente);

app.get(`${PF_DeleteProveedor}/:id`,verifyToken,proveedoresController.DeleteProveedor);

app.post(`${PF_DeleteProveedorPropuesta}`,verifyToken,proveedoresController.DeleteProveedorPropuesta);

app.get(`${PF_GetProveedorPropuesta}/:id`,verifyToken,proveedoresController.GetProveedorPropuesta);

app.post(`${PF_PutProvCliente}`,verifyToken, proveedoresController.PutProvCliente);

app.get(`${PF_GetInfoQr}/:id`,verifyToken,proveedoresController.GetInfoQr);

app.get(`${prefix}`,verifyToken,proveedoresController.list);

app.get(`${prefix}/:id`,verifyToken, proveedoresController.findOneBy)

app.get(`${prefixList}/:id`,verifyToken, proveedoresController.findList)

app.delete(`${prefix}/:id`,verifyToken, proveedoresController.delete)

module.exports=app;

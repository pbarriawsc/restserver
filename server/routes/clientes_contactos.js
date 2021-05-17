const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const clientes_contactosCtrl=require('../controllers/clientes_contactosCtrl');
const CLICONT_GetList='/api/clientes_contactos_list';
const CLICONT_Post='/api/clientes_contactos_post';
const CLICONT_Delete='/api/clientes_contactos_delete';
const CLICONT_Get='/api/clientes_contactos_get_contacto';
const CLICONT_Put='/api/clientes_contactos_put';
const CLICONT_GetTipos='/api/clientes_contactostipos_get';
const CLICONT_UploadFile='/api/clientes_contactos_uploadfile';
const CLICONT_Cedula_1='/api/clientes_contactos_cedula_1';
const CLICONT_Cedula_2='/api/clientes_contactos_cedula_2';
const CLICONT_PoderSimple_1='/api/clientes_contactos_podersimple_1';
const CLICONT_PoderSimple_2='/api/clientes_contactos_podersimple_2';
const CLICONT_CrearUsuario='/api/clientes_contactos_crear_usuario';

app.get(`${CLICONT_GetList}/:id`,verifyToken,clientes_contactosCtrl.CLICONT_GetList);
app.delete(`${CLICONT_Delete}/:id`,verifyToken,clientes_contactosCtrl.CLICONT_Delete);
app.get(`${CLICONT_Get}/:id`,verifyToken,clientes_contactosCtrl.CLICONT_Get);
app.post(`${CLICONT_Post}`,verifyToken,clientes_contactosCtrl.CLICONT_Post);
app.put(`${CLICONT_Put}`,verifyToken,clientes_contactosCtrl.CLICONT_Put);
app.get(`${CLICONT_GetTipos}`,verifyToken,clientes_contactosCtrl.CLICONT_GetTipos);
app.post(`${CLICONT_UploadFile}`,verifyToken, clientes_contactosCtrl.CLICONT_UploadFile);
app.get(`${CLICONT_Cedula_1}/:id`,[], clientes_contactosCtrl.CLICONT_Cedula_1);
app.get(`${CLICONT_Cedula_2}/:id`,[], clientes_contactosCtrl.CLICONT_Cedula_2);
app.get(`${CLICONT_PoderSimple_1}/:id`,[], clientes_contactosCtrl.CLICONT_PoderSimple_1);
app.get(`${CLICONT_PoderSimple_2}/:id`,[], clientes_contactosCtrl.CLICONT_PoderSimple_2);
app.post(`${CLICONT_CrearUsuario}`,verifyToken,clientes_contactosCtrl.CLICONT_CrearUsuario);

module.exports=app;

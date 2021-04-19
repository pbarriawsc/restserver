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

app.get(`${CLICONT_GetList}/:id`,verifyToken,clientes_contactosCtrl.CLICONT_GetList);
app.delete(`${CLICONT_Delete}/:id`,verifyToken,clientes_contactosCtrl.CLICONT_Delete);
app.get(`${CLICONT_Get}/:id`,verifyToken,clientes_contactosCtrl.CLICONT_Get);
app.post(`${CLICONT_Post}`,verifyToken,clientes_contactosCtrl.CLICONT_Post);
app.put(`${CLICONT_Put}`,verifyToken,clientes_contactosCtrl.CLICONT_Put);
app.get(`${CLICONT_GetTipos}`,verifyToken,clientes_contactosCtrl.CLICONT_GetTipos);


module.exports=app;

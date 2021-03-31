const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const bodegasubicacionesCtrl=require('../controllers/bodegasubicacionesCtrl');
const BODUBI_GetList='/api/bodegasubicaciones_get_list';
const BODUBI_Post='/api/bodegasubicaciones_post';
const BODUBI_Delete='/api/bodegasubicaciones_delete';
const BODUBI_Get='/api/bodegasubicaciones_get';
const BODUBI_Put='/api/bodegasubicaciones_put';
const BODUBI_GetLista='/api/bodegasubicaciones_get_ubiacionesbodegas';

app.get(`${BODUBI_GetList}`,verifyToken,bodegasubicacionesCtrl.GetList);
app.get(`${BODUBI_Delete}/:id`,verifyToken,bodegasubicacionesCtrl.Delete);
app.get(`${BODUBI_Get}/:id`,verifyToken,bodegasubicacionesCtrl.Get);
app.post(`${BODUBI_Post}`,verifyToken,bodegasubicacionesCtrl.Post);
app.post(`${BODUBI_Put}`,verifyToken,bodegasubicacionesCtrl.Put);
app.get(`${BODUBI_GetLista}/:id`,verifyToken,bodegasubicacionesCtrl.GetLista);

module.exports=app;

const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const equiposCtrl=require('../controllers/equiposCtrl');
const EQP_GetList='/api/equipos_get_list';
const EQP_Post='/api/equipos_post';
const EQP_Delete='/api/equipos_delete';
const EQP_Get='/api/equipos_get';
const EQP_Put='/api/equipos_put';

app.get(`${EQP_GetList}`,verifyToken,equiposCtrl.GetList);
app.get(`${EQP_Delete}/:id`,verifyToken,equiposCtrl.Delete);
app.get(`${EQP_Get}/:id`,verifyToken,equiposCtrl.Get);
app.post(`${EQP_Post}`,verifyToken,equiposCtrl.Post);
app.post(`${EQP_Put}`,verifyToken,equiposCtrl.Put);

module.exports=app;

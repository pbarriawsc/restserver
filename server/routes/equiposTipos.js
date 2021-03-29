const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const equiposTiposCtrl=require('../controllers/equiposTiposCtrl');
const ET_GetList='/api/equipostipos_get_list';
const ET_Post='/api/equipostipos_post';
const ET_Delete='/api/equipostipos_delete';
const ET_Get='/api/equipostipos_get';
const ET_Put='/api/equipostipos_put';

app.get(`${ET_GetList}`,verifyToken,equiposTiposCtrl.GetList);
app.get(`${ET_Delete}/:id`,verifyToken,equiposTiposCtrl.Delete);
app.get(`${ET_Get}/:id`,verifyToken,equiposTiposCtrl.Get);
app.post(`${ET_Post}`,verifyToken,equiposTiposCtrl.Post);
app.post(`${ET_Put}`,verifyToken,equiposTiposCtrl.Put);

module.exports=app;

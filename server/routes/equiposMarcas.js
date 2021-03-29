const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const equiposMarcasCtrl=require('../controllers/equiposMarcasCtrl');
const ET_GetList='/api/equiposmarcas_get_list';
const ET_Post='/api/equiposmarcas_post';
const ET_Delete='/api/equiposmarcas_delete';
const ET_Get='/api/equiposmarcas_get';
const ET_Put='/api/equiposmarcas_put';

app.get(`${ET_GetList}`,verifyToken,equiposMarcasCtrl.GetList);
app.get(`${ET_Delete}/:id`,verifyToken,equiposMarcasCtrl.Delete);
app.get(`${ET_Get}/:id`,verifyToken,equiposMarcasCtrl.Get);
app.post(`${ET_Post}`,verifyToken,equiposMarcasCtrl.Post);
app.post(`${ET_Put}`,verifyToken,equiposMarcasCtrl.Put);

module.exports=app;

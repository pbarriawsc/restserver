const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const puertosCtrl=require('../controllers/puertosCtrl');
const PTO_GetList='/api/puertos_get_list';
const PTO_Post='/api/puertos_post';
const PTO_Delete='/api/puertos_delete';
const PTO_Get='/api/puertos_get';
const PTO_Put='/api/puertos_put';

app.get(`${PTO_GetList}`,verifyToken,puertosCtrl.GetList);
app.get(`${PTO_Delete}/:id`,verifyToken,puertosCtrl.Delete);
app.get(`${PTO_Get}/:id`,verifyToken,puertosCtrl.Get);
app.post(`${PTO_Post}`,verifyToken,puertosCtrl.Post);
app.post(`${PTO_Put}`,verifyToken,puertosCtrl.Put);

module.exports=app;

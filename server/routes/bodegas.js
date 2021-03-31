const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const bodegasCtrl=require('../controllers/bodegasCtrl');
const BODE_GetList='/api/bodegas_get_list';
const BODE_Post='/api/bodegas_post';
const BODE_Delete='/api/bodegas_delete';
const BODE_Get='/api/bodegas_get';
const BODE_Put='/api/bodegas_put';

app.get(`${BODE_GetList}`,verifyToken,bodegasCtrl.GetList);
app.get(`${BODE_Delete}/:id`,verifyToken,bodegasCtrl.Delete);
app.get(`${BODE_Get}/:id`,verifyToken,bodegasCtrl.Get);
app.post(`${BODE_Post}`,verifyToken,bodegasCtrl.Post);
app.post(`${BODE_Put}`,verifyToken,bodegasCtrl.Put);

module.exports=app;

const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const monedasCtrl=require('../controllers/monedasCtrl');
const MONE_GetList='/api/monedas_get_list';
const MONE_Post='/api/monedas_post';
const MONE_Delete='/api/monedas_delete';
const MONE_Get='/api/monedas_get';
const MONE_Put='/api/monedas_put';

app.get(`${MONE_GetList}`,verifyToken,monedasCtrl.GetList);
app.get(`${MONE_Delete}/:id`,verifyToken,monedasCtrl.Delete);
app.get(`${MONE_Get}/:id`,verifyToken,monedasCtrl.Get);
app.post(`${MONE_Post}`,verifyToken,monedasCtrl.Post);
app.post(`${MONE_Put}`,verifyToken,monedasCtrl.Put);

module.exports=app;

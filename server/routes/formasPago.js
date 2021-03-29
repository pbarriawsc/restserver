const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const formasDePagoCtrl=require('../controllers/formasPagoCtrl');
const FOPAG_GetList='/api/formasdepago_get_list';
const FOPAG_Post='/api/formasdepago_post';
const FOPAG_Delete='/api/formasdepago_delete';
const FOPAG_Get='/api/formasdepago_get';
const FOPAG_Put='/api/formasdepago_put';

app.get(`${FOPAG_GetList}`,verifyToken,formasDePagoCtrl.GetList);
app.get(`${FOPAG_Delete}/:id`,verifyToken,formasDePagoCtrl.Delete);
app.get(`${FOPAG_Get}/:id`,verifyToken,formasDePagoCtrl.Get);
app.post(`${FOPAG_Post}`,verifyToken,formasDePagoCtrl.Post);
app.post(`${FOPAG_Put}`,verifyToken,formasDePagoCtrl.Put);

module.exports=app;

const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const impuestosCtrl=require('../controllers/impuestosCtrl');
const IMPT_GetList='/api/impuestos_get_list';
const IMPT_Post='/api/impuestos_post';
const IMPT_Delete='/api/impuestos_delete';
const IMPT_Get='/api/impuestos_get';
const IMPT_Put='/api/impuestos_put';

app.get(`${IMPT_GetList}`,verifyToken,impuestosCtrl.GetList);
app.get(`${IMPT_Delete}/:id`,verifyToken,impuestosCtrl.Delete);
app.get(`${IMPT_Get}/:id`,verifyToken,impuestosCtrl.Get);
app.post(`${IMPT_Post}`,verifyToken,impuestosCtrl.Post);
app.post(`${IMPT_Put}`,verifyToken,impuestosCtrl.Put);

module.exports=app;

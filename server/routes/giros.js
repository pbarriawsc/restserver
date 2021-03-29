const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const girosCtrl=require('../controllers/girosCtrl');
const GIR_GetList='/api/giros_get_list';
const GIR_Post='/api/giros_post';
const GIR_Delete='/api/giros_delete';
const GIR_Get='/api/giros_get';
const GIR_Put='/api/giros_put';

app.get(`${GIR_GetList}`,verifyToken,girosCtrl.GetList);
app.get(`${GIR_Delete}/:id`,verifyToken,girosCtrl.Delete);
app.get(`${GIR_Get}/:id`,verifyToken,girosCtrl.Get);
app.post(`${GIR_Post}`,verifyToken,girosCtrl.Post);
app.post(`${GIR_Put}`,verifyToken,girosCtrl.Put);

module.exports=app;

const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const equiposModelosCtrl=require('../controllers/equiposModelosCtrl');
const EMO_GetList='/api/equiposmodelos_get_list';
const EMO_Post='/api/equiposmodelos_post';
const EMO_Delete='/api/equiposmodelos_delete';
const EMO_Get='/api/equiposmodelos_get';
const EMO_Put='/api/equiposmodelos_put';

app.get(`${EMO_GetList}`,verifyToken,equiposModelosCtrl.GetList);
app.get(`${EMO_Delete}/:id`,verifyToken,equiposModelosCtrl.Delete);
app.get(`${EMO_Get}/:id`,verifyToken,equiposModelosCtrl.Get);
app.post(`${EMO_Post}`,verifyToken,equiposModelosCtrl.Post);
app.post(`${EMO_Put}`,verifyToken,equiposModelosCtrl.Put);

module.exports=app;

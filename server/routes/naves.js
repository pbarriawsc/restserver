const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const navesCtrl=require('../controllers/navesCtrl');
const NAV_GetList='/api/naves_get_list';
const NAV_Post='/api/naves_post';
const NAV_Delete='/api/naves_delete';
const NAV_Get='/api/naves_get';
const NAV_Put='/api/naves_put';

app.get(`${NAV_GetList}`,verifyToken,navesCtrl.GetList);
app.get(`${NAV_Delete}/:id`,verifyToken,navesCtrl.Delete);
app.get(`${NAV_Get}/:id`,verifyToken,navesCtrl.Get);
app.post(`${NAV_Post}`,verifyToken,navesCtrl.Post);
app.post(`${NAV_Put}`,verifyToken,navesCtrl.Put);

module.exports=app;

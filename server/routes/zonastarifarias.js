const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const zonastarifariasCtrl=require('../controllers/zonastarifariasCtrl');
const ZONTAR_GetList='/api/zonastarifarias_get_list';
const ZONTAR_Post='/api/zonastarifarias_post';
const ZONTAR_Delete='/api/zonastarifarias_delete';
const ZONTAR_Get='/api/zonastarifarias_get';
const ZONTAR_Put='/api/zonastarifarias_put';
const ZONTAR_GetRegionPais='/api/zonastarifarias_get_regionpais';

app.get(`${ZONTAR_GetList}`,verifyToken,zonastarifariasCtrl.GetList);
app.get(`${ZONTAR_Delete}/:id`,verifyToken,zonastarifariasCtrl.Delete);
app.get(`${ZONTAR_Get}/:id`,verifyToken,zonastarifariasCtrl.Get);
app.post(`${ZONTAR_Post}`,verifyToken,zonastarifariasCtrl.Post);
app.post(`${ZONTAR_Put}`,verifyToken,zonastarifariasCtrl.Put);
app.get(`${ZONTAR_GetRegionPais}/:id`,verifyToken,zonastarifariasCtrl.GetRegionPais);

module.exports=app;

const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const subFamiliasComercialesProductosCtrl=require('../controllers/subFamiliasComercialesProductosCtrl');
const SFAMCOM_GetList='/api/subfamiliascomerciales_get_list';
const SFAMCOM_Post='/api/subfamiliascomerciales_post';
const SFAMCOM_Delete='/api/subfamiliascomerciales_delete';
const SFAMCOM_Get='/api/subfamiliascomerciales_get';
const SFAMCOM_Put='/api/subfamiliascomerciales_put';

app.get(`${SFAMCOM_GetList}`,verifyToken,subFamiliasComercialesProductosCtrl.GetList);
app.get(`${SFAMCOM_Delete}/:id`,verifyToken,subFamiliasComercialesProductosCtrl.Delete);
app.get(`${SFAMCOM_Get}/:id`,verifyToken,subFamiliasComercialesProductosCtrl.Get);
app.post(`${SFAMCOM_Post}`,verifyToken,subFamiliasComercialesProductosCtrl.Post);
app.post(`${SFAMCOM_Put}`,verifyToken,subFamiliasComercialesProductosCtrl.Put);

module.exports=app;

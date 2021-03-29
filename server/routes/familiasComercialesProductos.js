const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const familiasComercialesCtrl=require('../controllers/familiasComercialesProductosCtrl');
const FAMCOM_GetList='/api/familiasComerciales_get_list';
const FAMCOM_Post='/api/familiasComerciales_post';
const FAMCOM_Delete='/api/familiasComerciales_delete';
const FAMCOM_Get='/api/familiasComerciales_get';
const FAMCOM_Put='/api/familiasComerciales_put';

app.get(`${FAMCOM_GetList}`,verifyToken,familiasComercialesCtrl.GetList);
app.get(`${FAMCOM_Delete}/:id`,verifyToken,familiasComercialesCtrl.Delete);
app.get(`${FAMCOM_Get}/:id`,verifyToken,familiasComercialesCtrl.Get);
app.post(`${FAMCOM_Post}`,verifyToken,familiasComercialesCtrl.Post);
app.post(`${FAMCOM_Put}`,verifyToken,familiasComercialesCtrl.Put);

module.exports=app;

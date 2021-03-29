const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const contactosTiposCtrl=require('../controllers/contactosTiposCtrl');
const CT_GetList='/api/contactostipos_get_list';
const CT_Post='/api/contactostipos_post';
const CT_Delete='/api/contactostipos_delete';
const CT_Get='/api/contactostipos_get_contacto';
const CT_Put='/api/contactostipos_put';

app.get(`${CT_GetList}`,verifyToken,contactosTiposCtrl.GetList);
app.get(`${CT_Delete}/:id`,verifyToken,contactosTiposCtrl.Delete);
app.get(`${CT_Get}/:id`,verifyToken,contactosTiposCtrl.Get);
app.post(`${CT_Post}`,verifyToken,contactosTiposCtrl.Post);
app.post(`${CT_Put}`,verifyToken,contactosTiposCtrl.Put);



module.exports=app;

const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/gc_registrocontactos';
const prefixGetComerciales='/api/gc_registrocontactos_get_comerciales';
const gc_registrocontactosController=require('../controllers/gc_registrocontactosCtrl');

app.get(`${prefix}`,verifyToken,gc_registrocontactosController.list);

app.get(`${prefixGetComerciales}`,verifyToken,gc_registrocontactosController.ListComerciales);

app.get(`${prefix}/:id`,verifyToken, gc_registrocontactosController.findOneBy)

app.post(`${prefix}`,verifyToken, gc_registrocontactosController.create)

app.put(`${prefix}`,verifyToken, gc_registrocontactosController.update)

app.delete(`${prefix}/:id`,verifyToken, gc_registrocontactosController.delete)

module.exports=app;

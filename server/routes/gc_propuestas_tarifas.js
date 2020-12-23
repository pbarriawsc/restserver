const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/gc_propuestaTar';
const prefixList='/api/gc_propuestaTar_List';
const gc_registrocontactosController=require('../controllers/gc_propuestas_tarifasCtrl');

app.get(`${prefix}`,verifyToken,gc_registrocontactosController.list);

app.get(`${prefix}/:id`,verifyToken, gc_registrocontactosController.findOneBy)

app.get(`${prefixList}/:id`,verifyToken, gc_registrocontactosController.findByCabecera)

app.post(`${prefix}`,verifyToken, gc_registrocontactosController.create)

app.put(`${prefix}`,verifyToken, gc_registrocontactosController.update)

app.delete(`${prefix}/:id`,verifyToken, gc_registrocontactosController.delete)

module.exports=app;

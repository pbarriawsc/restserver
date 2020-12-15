const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/gc_contactos_tipos';
const gc_contactos_tiposController=require('../controllers/gc_contactos_tiposCtrl');

app.get(`${prefix}`,verifyToken,gc_contactos_tiposController.list);

module.exports=app;
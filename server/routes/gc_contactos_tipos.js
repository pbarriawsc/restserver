const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const gc_contactos_tiposController=require('../controllers/gc_contactos_tiposCtrl');
const PF_ContactosTipos='/api/gc_contactos_tipos';


app.get(`${PF_ContactosTipos}`,verifyToken,gc_contactos_tiposController.GetContactosTipos);

app.post(`${PF_ContactosTipos}`,verifyToken,gc_contactos_tiposController.PostContactosTipos);

app.put(`${PF_ContactosTipos}`,verifyToken,gc_contactos_tiposController.PutContactosTipos);

app.get(`${PF_ContactosTipos}/:id`,verifyToken,gc_contactos_tiposController.GetContactoTipo);

app.delete(`${PF_ContactosTipos}/:id`,verifyToken,gc_contactos_tiposController.DeleteContactoTipo);

module.exports=app;

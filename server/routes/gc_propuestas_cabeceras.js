const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/gc_propuestaCab';
const prefixList='/api/gc_propuestaCab_List';
const prefixPdfCab='/api/gc_propuestaPdf_Cab';
const prefixPdfTar='/api/gc_propuestaPdf_Tar';
const prefixPdfSerAd='/api/gc_propuestaPdf_SerAd';
const prefixAprobar='/api/set_propuestapdf_aprobar';

const gc_propuestas_cabecerasController=require('../controllers/gc_propuestas_cabecerasCtrl');

app.get(`${prefix}`,verifyToken,gc_propuestas_cabecerasController.list);

app.get(`${prefix}/:id`,verifyToken, gc_propuestas_cabecerasController.findOneBy)

app.get(`${prefixList}/:id`,verifyToken, gc_propuestas_cabecerasController.findByContacto)

app.get(`${prefixPdfCab}/:id`,verifyToken, gc_propuestas_cabecerasController.findByPdfCabecera)

app.get(`${prefixPdfTar}/:id`,verifyToken, gc_propuestas_cabecerasController.findByPdfTarifa)

app.get(`${prefixPdfSerAd}/:id`,verifyToken, gc_propuestas_cabecerasController.findByPdfSerAd)

app.post(`${prefix}`,verifyToken, gc_propuestas_cabecerasController.create)

app.put(`${prefix}`,verifyToken, gc_propuestas_cabecerasController.update)

app.put(`${prefixAprobar}/:id`,verifyToken, gc_propuestas_cabecerasController.Aprobar)

app.delete(`${prefix}/:id`,verifyToken, gc_propuestas_cabecerasController.delete)

module.exports=app;

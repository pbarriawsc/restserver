const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/tracking';
const prefix2='/api/tracking-chn';
const trackingController=require('../controllers/trackingCtrl');

app.post(`${prefix}`,verifyToken, trackingController.create);
app.get(`${prefix}`,verifyToken, trackingController.list);
app.get(`${prefix}/:id`,verifyToken, trackingController.listById);
app.get(`${prefix}/cliente/:id`,verifyToken, trackingController.listByClient);
app.get(`${prefix}/estado/:estado`,verifyToken, trackingController.listByEstado);
app.get(`${prefix}/cargaContenedor/:estado`,verifyToken, trackingController.listByReadyToCharge);
app.put(`${prefix}/:id`,verifyToken, trackingController.update);
app.post(`${prefix}/uploadFiles/:id`,verifyToken, trackingController.uploadFiles);
app.post(`${prefix}/uploadFiles/packingList/invoice/:id`,verifyToken, trackingController.uploadFilesPackingInvoice);
app.get(`${prefix}/photo1/:id`,[], trackingController.getPhoto1);
app.get(`${prefix}/photo2/:id`,[], trackingController.getPhoto2);
app.get(`${prefix}/photo3/:id`,[], trackingController.getPhoto3);
app.get(`${prefix}/photo4/:id`,[], trackingController.getPhoto4);
app.get(`${prefix}/photo5/:id`,[], trackingController.getPhoto5);
app.get(`${prefix}/packingList1/:id`,[], trackingController.getPackingList1);
app.get(`${prefix}/packingList2/:id`,[], trackingController.getPackingList2);
app.get(`${prefix}/invoice1/:id`,[], trackingController.getInvoice1);
app.get(`${prefix}/invoice2/:id`,[], trackingController.getInvoice1);
app.get(`${prefix2}`,verifyToken, trackingController.listChn);
app.delete(`${prefix}/:id`,verifyToken, trackingController.delete);
app.get(`/api/tracking-import`,[],trackingController.exports_excel);
app.put(`${prefix}/despacho/comercial/:id`,verifyToken, trackingController.updateDespachoComercial);
/*
app.put(`${prefix}/:id`, function (req, res) {
    let id=req.params.id;
    res.json({id})
})

app.delete(`${prefix}`, function (req, res) {
    res.json('Método delete Usuarios')
})*/

module.exports=app;
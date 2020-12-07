const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/formas_pago';
const formasPagoController=require('../controllers/formasPagoCtrl');

app.get(`${prefix}`,verifyToken,formasPagoController.list);

app.get(`${prefix}/:id`,verifyToken, formasPagoController.findOneBy)

app.post(`${prefix}`,verifyToken, formasPagoController.create)

app.put(`${prefix}`,verifyToken, formasPagoController.update)

app.delete(`${prefix}/:id`,verifyToken, formasPagoController.delete)

module.exports=app;
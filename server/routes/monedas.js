const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/monedas';
const monedasController=require('../controllers/monedasCtrl');

app.get(`${prefix}`,verifyToken,monedasController.list);

app.get(`${prefix}/:id`,verifyToken, monedasController.findOneBy)

app.post(`${prefix}`,verifyToken, monedasController.create)

app.put(`${prefix}`,verifyToken, monedasController.update)

app.delete(`${prefix}/:id`,verifyToken, monedasController.delete)

module.exports=app;
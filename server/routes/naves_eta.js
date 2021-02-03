const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/navesEta';
const navesEtaController=require('../controllers/navesEtaCtrl');

app.get(`${prefix}/:fk_nave`,verifyToken,navesEtaController.findOneBy);
app.post(`${prefix}`,verifyToken,navesEtaController.create);
app.put(`${prefix}/:id`,verifyToken,navesEtaController.update);
module.exports=app;
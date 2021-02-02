const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/navesEta';
const navesEtaController=require('../controllers/navesEtaCtrl');

app.get(`${prefix}/:id`,verifyToken,navesEtaController.findOneBy);

module.exports=app;
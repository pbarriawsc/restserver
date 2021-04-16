const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/embarcadoras';
const embarcadorasController=require('../controllers/embarcadorasCtrl');

app.get(`${prefix}`,verifyToken,embarcadorasController.list);


module.exports=app;
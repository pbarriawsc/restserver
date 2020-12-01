const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/tipoDireccion';
const tipoDireccionController=require('../controllers/tipoDireccionCtrl');

app.get(`${prefix}`,verifyToken,tipoDireccionController.list);


module.exports=app;
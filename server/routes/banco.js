const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/bancos';
const bancoController=require('../controllers/bancoCtrl');

app.get(`${prefix}`,verifyToken,bancoController.list);


module.exports=app;
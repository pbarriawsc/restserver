const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/kardex';
const kardexController=require('../controllers/kardexCtrl');

app.get(`${prefix}`,verifyToken,kardexController.list);

module.exports=app;
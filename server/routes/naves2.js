const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/naves2';
const naves2Controller=require('../controllers/naves2Ctrl');

app.get(`${prefix}`,verifyToken,naves2Controller.list);

module.exports=app;
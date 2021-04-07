const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const currierCtrl=require('../controllers/currierCtrl');
const prefix='/api/currier';
app.get(`${prefix}`,verifyToken,currierCtrl.list);
module.exports=app;
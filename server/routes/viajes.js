const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/viajes';
const viajesController=require('../controllers/viajesCtrl');

app.get(`${prefix}`,verifyToken,viajesController.list);
app.post(`${prefix}`,verifyToken,viajesController.create);
app.delete(`${prefix}/:id`,verifyToken,viajesController.delete);


module.exports=app;

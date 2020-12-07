const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/giros';
const girosController=require('../controllers/girosCtrl');

app.get(`${prefix}`,verifyToken,girosController.list);

app.get(`${prefix}/:id`,verifyToken, girosController.findOneBy)

app.post(`${prefix}`,verifyToken, girosController.create)

app.put(`${prefix}`,verifyToken, girosController.update)

app.delete(`${prefix}/:id`,verifyToken, girosController.delete)

module.exports=app;
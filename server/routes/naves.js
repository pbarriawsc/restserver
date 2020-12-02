const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/naves';
const navesController=require('../controllers/navesCtrl');

app.get(`${prefix}`,verifyToken,navesController.list);

app.get(`${prefix}/:id`,verifyToken, navesController.findOneBy)

app.post(`${prefix}`,verifyToken, navesController.create)

app.put(`${prefix}`,verifyToken, navesController.update)

app.delete(`${prefix}/:id`,verifyToken, navesController.delete)

module.exports=app;
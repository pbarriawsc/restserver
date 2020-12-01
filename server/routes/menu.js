const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/menu';
const menuController=require('../controllers/menuCtrl');

app.get(`${prefix}`,verifyToken,menuController.list);

app.get(`${prefix}/:id`,verifyToken, menuController.findOneBy)

app.post(`${prefix}`,verifyToken, menuController.create)

app.put(`${prefix}`,verifyToken, menuController.update)

app.delete(`${prefix}/:id`,verifyToken, menuController.delete)

module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/pais';
const paisController=require('../controllers/paisCtrl');

app.get(`${prefix}`,verifyToken,paisController.list);

app.get(`${prefix}/:id`,verifyToken, paisController.findOneBy)

app.post(`${prefix}`,verifyToken, paisController.create)

app.put(`${prefix}`,verifyToken, paisController.update)

app.delete(`${prefix}/:id`,verifyToken, paisController.delete)

module.exports=app;
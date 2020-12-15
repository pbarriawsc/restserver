const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/roles';
const rolesController=require('../controllers/rolesCtrl');

app.get(`${prefix}`,verifyToken,rolesController.list);

app.get(`${prefix}/:id`,verifyToken, rolesController.findOneBy)

app.post(`${prefix}`,verifyToken, rolesController.create)

app.put(`${prefix}`,verifyToken, rolesController.update)

app.delete(`${prefix}/:id`,verifyToken, rolesController.delete)

module.exports=app;

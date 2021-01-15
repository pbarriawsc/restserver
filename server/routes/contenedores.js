const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/contenedores';
const contenedoresController=require('../controllers/contenedoresCtrl');

app.get(`${prefix}`,verifyToken,contenedoresController.list);
app.post(`${prefix}`,verifyToken, contenedoresController.create)
app.delete(`${prefix}/:id`,verifyToken, contenedoresController.delete)
app.put(`${prefix}/:id`,verifyToken, contenedoresController.update)

module.exports=app;
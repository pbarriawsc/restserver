const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/region';
const prefix_pais='/api/region_pais';
const prefix_comuna='/api/region_comuna';
const regionController=require('../controllers/regionCtrl');

app.get(`${prefix}`,verifyToken,regionController.list);

app.get(`${prefix}/:id`,verifyToken, regionController.findOneBy)

app.get(`${prefix_pais}/:id`,verifyToken, regionController.list_pais)

app.get(`${prefix_comuna}/:id`,verifyToken, regionController.list_comuna)

app.post(`${prefix}`,verifyToken, regionController.create)

app.put(`${prefix}`,verifyToken, regionController.update)

app.delete(`${prefix}/:id`,verifyToken, regionController.delete)

module.exports=app;
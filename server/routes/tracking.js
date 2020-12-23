const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/tracking';
const trackingController=require('../controllers/trackingCtrl');

app.post(`${prefix}`,verifyToken, trackingController.create)
app.get(`${prefix}`,verifyToken, trackingController.list)
app.get(`${prefix}/cliente/:id`,verifyToken, trackingController.listByClient)
app.put(`${prefix}/:id`,verifyToken, trackingController.update)

/*
app.put(`${prefix}/:id`, function (req, res) {
    let id=req.params.id;
    res.json({id})
})

app.delete(`${prefix}`, function (req, res) {
    res.json('Método delete Usuarios')
})*/

module.exports=app;
const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/usuario';
const usuarioController=require('../controllers/usuariosCtrl');

app.get(`${prefix}`,verifyToken,usuarioController.list);

app.get(`${prefix}/:id`,verifyToken, usuarioController.findOneBy)

app.post(`${prefix}`,verifyToken, usuarioController.create)
/*
app.put(`${prefix}/:id`, function (req, res) {
    let id=req.params.id;
    res.json({id})
})

app.delete(`${prefix}`, function (req, res) {
    res.json('Método delete Usuarios')
})*/

module.exports=app;
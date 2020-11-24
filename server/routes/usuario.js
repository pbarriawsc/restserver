const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const client = require('../config/db.client');
const prefix='/api/usuario';

//app.get('/usuario',verifyToken,usuarioController.list);

app.get(`${prefix}`,verifyToken,function (req, res) {
    client.query('SELECT * FROM public.usuario', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
})

app.get(`${prefix}/:id`, function (req, res) {
    const id=req.params.id;
    client.query('SELECT * FROM public.usuario where id = $1', [id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    
})

app.post(`${prefix}`, function (req, res) {
    let body=req.body;
    if(body.nombre===undefined){
        res.status(400).json({
            success:false,
            message:"El nombre es necesario"
        })
    }else{
        res.json({persona:body})
    }
})

app.put(`${prefix}/:id`, function (req, res) {
    let id=req.params.id;
    res.json({id})
})

app.delete(`${prefix}`, function (req, res) {
    res.json('Método delete Usuarios')
})

module.exports=app;
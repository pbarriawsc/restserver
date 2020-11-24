const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');


const { Client } = require('pg');
var connectionString = "postgres://postgres:wsc2020@localhost:5432/wscargo";
const client = new Client({
    connectionString: connectionString
});

client.connect();

app.get('/usuario',verifyToken,function (req, res) {
    client.query('SELECT * FROM public.usuarios', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    
})

app.get('/usuario/:id', function (req, res) {
    const id=req.params.id;
    client.query('SELECT * FROM public.usuarios where id = $1', [id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    
})

app.post('/usuario', function (req, res) {
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

app.put('/usuario/:id', function (req, res) {
    let id=req.params.id;
    res.json({id})
})

app.delete('/usuario', function (req, res) {
    res.json('Método delete Usuarios')
})

module.exports=app;
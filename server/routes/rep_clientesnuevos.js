const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const rep_clientesnuevosCtrl=require('../controllers/rep_clientesnuevosCtrl');

// app.get('/api/rep_clientesnuevos_generar/:id', verifyToken,rep_clientesnuevosCtrl.Post);

app.post('/api/rep_clientesnuevos_generar/', verifyToken,rep_clientesnuevosCtrl.Post);

app.get('/api/rep_clientesnuevos_generar_url/:id',[], rep_clientesnuevosCtrl.Post);

module.exports=app;
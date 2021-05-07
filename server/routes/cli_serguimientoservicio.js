const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const SLISEGSER_GetTodosList='/api/cli_serguimientoservicio_get_todoslist';
const SLISEGSER_GetPorDespacharList='/api/cli_serguimientoservicio_get_pordespacharlist';
const SLISEGSER_GetEnTransitoList='/api/cli_serguimientoservicio_get_entransitolist';

const perfilClienteController=require('../controllers/cli_serguimientoservicioCtrl');

app.get(`${SLISEGSER_GetTodosList}`,verifyToken, perfilClienteController.SLISEGSER_GetTodosList);
app.get(`${SLISEGSER_GetPorDespacharList}`,verifyToken, perfilClienteController.SLISEGSER_GetPorDespacharList);
app.get(`${SLISEGSER_GetEnTransitoList}`,verifyToken, perfilClienteController.SLISEGSER_GetEnTransitoList);

module.exports=app;
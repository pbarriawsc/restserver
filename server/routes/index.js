const express = require('express')
const app = express()

app.use(require('./menu'))
app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./tipoDireccion'))
app.use(require('./direccionesTipos'))
app.use(require('./pais'))
app.use(require('./naves'))
app.use(require('./equiposTipos'))
app.use(require('./equiposMarcas'))
app.use(require('./tipoContacto'))
app.use(require('./pais'))
app.use(require('./banco'))
app.use(require('./tipoCuentaBancaria'))
app.use(require('./usuarioDirecciones'))
app.use(require('./usuarioContactos'));
app.use(require('./usuarioCuentasBancarias'));
app.use(require('./usuarioNotas'));

module.exports=app;
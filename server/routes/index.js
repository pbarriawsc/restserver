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

module.exports=app;
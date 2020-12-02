const express = require('express')
const app = express()

app.use(require('./menu'))
app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./tipoDireccion'))
app.use(require('./tipoContacto'))
app.use(require('./pais'))
app.use(require('./banco'))
app.use(require('./tipoCuentaBancaria'))
app.use(require('./usuarioDirecciones'))

module.exports=app;
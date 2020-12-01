const express = require('express')
const app = express()

app.use(require('./menu'))
app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./tipoDireccion'))
app.use(require('./tipoContacto'))
app.use(require('./pais'))

module.exports=app;
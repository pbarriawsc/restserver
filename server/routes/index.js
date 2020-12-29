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
app.use(require('./equiposModelos'))
app.use(require('./tipoContacto'))
app.use(require('./pais'))
app.use(require('./tipoCuentaBancaria'))
app.use(require('./usuarioDirecciones'))
app.use(require('./bancos'))
app.use(require('./cuentasBancarias'))
app.use(require('./monedas'))
app.use(require('./impuestos'))
app.use(require('./formasPago'))
app.use(require('./giros'))
app.use(require('./familiasArancelariasProductos'))
app.use(require('./familiasComercialesProductos'))
app.use(require('./usuarioContactos'));
app.use(require('./usuarioCuentasBancarias'));
app.use(require('./region'));
app.use(require('./comunas'));
app.use(require('./proveedores'));
app.use(require('./usuarioNotas'));
app.use(require('./tracking'));
app.use(require('./roles'));
app.use(require('./gc_registrocontactos'));
app.use(require('./gc_contactos_tipos'));
app.use(require('./clientes'));
app.use(require('./gc_propuestas_cabeceras'));
app.use(require('./gc_propuestas_tarifas'));
app.use(require('./gc_propuestas_serviciosadicionales'));
app.use(require('./trackingDetalle'));

module.exports=app;

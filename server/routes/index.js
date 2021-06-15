const express = require('express')
const app = express()

app.use(require('./rep_clientesnuevos'))
app.use(require('./cli_serguimientoservicio'))
app.use(require('./perfilcliente'))
app.use(require('./bodegas_ubicaciones'))
app.use(require('./bodegas'))
app.use(require('./zonastarifarias'))
app.use(require('./empresas'))
app.use(require('./menu'))
app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./tipoDireccion'))
app.use(require('./pais'))
app.use(require('./naves'))
app.use(require('./equipos'))
app.use(require('./naves2'))
app.use(require('./equiposTipos'))
app.use(require('./equiposMarcas'))
app.use(require('./equiposModelos'))
app.use(require('./tipoContacto'))
app.use(require('./pais'))
app.use(require('./puertos'))
app.use(require('./tipoCuentaBancaria'))
app.use(require('./usuarioDirecciones'))
app.use(require('./bancos'))
app.use(require('./cuentasBancarias'))
app.use(require('./monedas'))
app.use(require('./impuestos'))
app.use(require('./formasPago'))
app.use(require('./giros'))
app.use(require('./familiasArancelariasProductos'))
app.use(require('./subFamiliasArancelariasProductos'))
app.use(require('./subFamiliasComercialesProductos'))
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
app.use(require('./contactosTipos'));
app.use(require('./clientes'));
app.use(require('./gc_propuestas_cabeceras'));
app.use(require('./gc_propuestas_tarifas'));
app.use(require('./gc_propuestas_serviciosadicionales'));
app.use(require('./gc_clientes'));
app.use(require('./clientes_usuarios'));
app.use(require('./clientes_contactos'));
app.use(require('./clientes_direcciones'));
app.use(require('./trackingDetalle'));
app.use(require('./trackingHistorial'));
app.use(require('./contenedores'));
app.use(require('./contenedorDetalle'));
app.use(require('./gc_proveedores'));
app.use(require('./gc_packingList'));
app.use(require('./trackingObservaciones'));
app.use(require('./naves_eta'));
app.use(require('./contenedorHistorial'));
app.use(require('./puertos'));
app.use(require('./consolidados'));
app.use(require('./bodegasUbicaciones'));
app.use(require('./viajes'));
app.use(require('./currier'));
app.use(require('./gc_propuestas_estados'));
app.use(require('./lineasNavieras'));
app.use(require('./embarcadoras'));
app.use(require('./contenedorTracking'));
app.use(require('./contenedorProforma'));
app.use(require('./plDesconsolidado'));
app.use(require('./ordenesTransporte'));
app.use(require('./recepcionChile'));
app.use(require('./kardex'));
app.use(require('./bodegaUbicacionesDetalle'));
module.exports=app;

const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefixTiposServicios='/api/gc_propuestacomercial_get_tiposdeservicios';
const prefixZonasTarifarias='/api/gc_propuestacomercial_get_zonastarifarias';
const prefixFormasPago='/api/gc_propuestacomercial_get_formasdepago';
const prefixPropuestaDesarrollo='/api/gc_propuestacomercial_desarrollo';



const prefix='/api/gc_propuestacomercial';
const prefixList='/api/gc_propuestaCab_List';
const prefixPdfCab='/api/gc_propuestaPdf_Cab';
const prefixPdfTar='/api/gc_propuestaPdf_Tar';
const prefixPdfSerAd='/api/gc_propuestaPdf_SerAd';
const prefixAprobar='/api/set_propuestapdf_aprobar';

const gc_propuestas_cabecerasController=require('../controllers/gc_propuestas_cabecerasCtrl');

app.get(`${prefixTiposServicios}`,verifyToken,gc_propuestas_cabecerasController.ListServiciosTipos);

app.get(`${prefixZonasTarifarias}`,verifyToken,gc_propuestas_cabecerasController.ListZonasTarifarias);

app.get(`${prefixFormasPago}`,verifyToken,gc_propuestas_cabecerasController.ListFormasPago);

app.get(`${prefixPropuestaDesarrollo}/:id`,verifyToken, gc_propuestas_cabecerasController.findByDesarrollo)

app.post(`${prefix}`,verifyToken, gc_propuestas_cabecerasController.create)

app.put(`${prefix}`,verifyToken, gc_propuestas_cabecerasController.update)






app.get(`${prefix}`,verifyToken,gc_propuestas_cabecerasController.list);

app.get(`${prefix}/:id`,verifyToken, gc_propuestas_cabecerasController.findOneBy)

app.get(`${prefixList}/:id`,verifyToken, gc_propuestas_cabecerasController.findByContacto)

app.get(`${prefixPdfCab}/:id`,verifyToken, gc_propuestas_cabecerasController.findByPdfCabecera)

app.get(`${prefixPdfTar}/:id`,verifyToken, gc_propuestas_cabecerasController.findByPdfTarifa)

app.get(`${prefixPdfSerAd}/:id`,verifyToken, gc_propuestas_cabecerasController.findByPdfSerAd)



app.put(`${prefixAprobar}/:id`,verifyToken, gc_propuestas_cabecerasController.Aprobar)

app.delete(`${prefix}/:id`,verifyToken, gc_propuestas_cabecerasController.delete)

module.exports=app;

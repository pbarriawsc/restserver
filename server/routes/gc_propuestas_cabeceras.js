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
const prefixGetList='/api/gc_propuestacomercial_get_list';
const prefixPostSerAd='/api/gc_propuestacomercial_postserad';
const prefixSerAdList='/api/gc_propuestacomercial_serad_list';
const prefixDelete='/api/gc_propuestacomercial_delete';
const prefixSerAdDelete='/api/gc_propuestacomercial_serad_delete';
const prefixGetClientesList='/api/cg_pc_get_clientes_list';
const prefixGetDireccionesList='/api/cg_pc_get_clientes_direcciones';
const prefixGetProveedoresList='/api/gc_propuestacomercial_get_proveedores';
const prefixPostProv='/api/gc_propuestacomercial_postprov';
const prefixPostProvList='/api/gc_propuestacomercial_proveedores_list';
const prefixProAprobar='/api/gc_propuestacomercial_aprobar';


const gc_propuestas_cabecerasController=require('../controllers/gc_propuestas_cabecerasCtrl');

app.get(`${prefixTiposServicios}`,verifyToken,gc_propuestas_cabecerasController.ListServiciosTipos);

app.get(`${prefixZonasTarifarias}`,verifyToken,gc_propuestas_cabecerasController.ListZonasTarifarias);

app.get(`${prefixFormasPago}`,verifyToken,gc_propuestas_cabecerasController.ListFormasPago);

app.get(`${prefixGetClientesList}`,verifyToken,gc_propuestas_cabecerasController.ListClientes);

app.get(`${prefixGetProveedoresList}`,verifyToken,gc_propuestas_cabecerasController.ListProveedores);

app.get(`${prefixPostProvList}/:id`,verifyToken,gc_propuestas_cabecerasController.ListProv);

app.get(`${prefixProAprobar}/:id`,verifyToken,gc_propuestas_cabecerasController.ProAprobar);

app.get(`${prefixPropuestaDesarrollo}/:id`,verifyToken, gc_propuestas_cabecerasController.findByDesarrollo)

app.get(`${prefixGetDireccionesList}/:id`,verifyToken, gc_propuestas_cabecerasController.listDirecciones)

app.post(`${prefix}`,verifyToken, gc_propuestas_cabecerasController.create)

app.post(`${prefixPostProv}`,verifyToken, gc_propuestas_cabecerasController.createProv)

app.put(`${prefix}`,verifyToken, gc_propuestas_cabecerasController.update)

app.post(`${prefixPostSerAd}`,verifyToken, gc_propuestas_cabecerasController.createSerAd)

app.get(`${prefixSerAdList}/:id`,verifyToken,gc_propuestas_cabecerasController.SerAdList);

app.get(`${prefixGetList}/:id`,verifyToken,gc_propuestas_cabecerasController.GetList);

app.get(`${prefixSerAdDelete}/:id`,verifyToken,gc_propuestas_cabecerasController.SerAdDelete);

app.get(`${prefixDelete}/:id`,verifyToken,gc_propuestas_cabecerasController.ProComDelete);

app.get(`${prefix}`,verifyToken,gc_propuestas_cabecerasController.list);

app.get(`${prefix}/:id`,verifyToken, gc_propuestas_cabecerasController.findOneBy)

app.get(`${prefixList}/:id`,verifyToken, gc_propuestas_cabecerasController.findByContacto)

app.get(`${prefixPdfCab}/:id`,verifyToken, gc_propuestas_cabecerasController.findByPdfCabecera)

app.get(`${prefixPdfTar}/:id`,verifyToken, gc_propuestas_cabecerasController.findByPdfTarifa)

app.get(`${prefixPdfSerAd}/:id`,verifyToken, gc_propuestas_cabecerasController.findByPdfSerAd)



app.put(`${prefixAprobar}/:id`,verifyToken, gc_propuestas_cabecerasController.Aprobar)


module.exports=app;

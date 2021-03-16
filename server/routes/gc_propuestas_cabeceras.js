const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const gc_propuestas_cabecerasController=require('../controllers/gc_propuestas_cabecerasCtrl');

const PFPC_GetListPropuestaComercial='/api/propuestas_get_list_propuestascomerciales';
const PFPC_GetPropuestaComercial='/api/propuestas_get_propuestacomercial';
const PFPC_GetClientes='/api/propuestas_get_clientes';
const PFPC_GetDirecciones='/api/propuestas_get_direcciones';
const PFPC_GetTiposServicios='/api/propuestas_get_tiposdeservicios';
const PFPC_GetZonasTarifarias='/api/propuestas_get_zonastarifarias';
const PFPC_GetFormasDePago='/api/propuestas_get_formasdepago';
const PFPC_PostPropuestaComercial='/api/gc_propuestacomercial_post_propuestacomercial';
const PFPC_PutPropuestaComercial='/api/gc_propuestacomercial_put_propuestacomercial';
const PFPC_GetServiciosAdicionales='/api/propuestas_get_list_serviciosadicionales';
const PFPC_PostServiciosAdicionales='/api/gc_propuestacomercial_post_servicioadicional';
const PFPC_DeleteServiciosAdicionales='/api/propuestas_delete_serviciosadicionales';
const PFPC_DeletePropuestaComercial='/api/propuestas_delete_propuestacomercial';
const PFPC_GetPropuestaBase='/api/propuestas_get_propuestabase';
const PFPC_TerminarPropuesta='/api/propuestas_terminar_propuesta';
const PFPC_AprobarPropuesta='/api/propuestas_aprobar_propuesta';
const PFPC_RechazarPropuesta='/api/propuestas_rechazar_propuesta';
const PFPC_AnularPropuesta='/api/propuestas_anular_propuesta';
const PFPC_GetPropuestaPdfCab='/api/propuestas_get_propuestapdf_cab';
const PFPC_GetPropuestaPdfSerAd='/api/propuestas_get_propuestapdf_serad';




app.get(`${PFPC_GetListPropuestaComercial}/:id`,verifyToken,gc_propuestas_cabecerasController.GetListPropuestaComercial);
app.get(`${PFPC_GetPropuestaComercial}/:id`,verifyToken,gc_propuestas_cabecerasController.GetPropuestaComercial);
app.get(`${PFPC_GetClientes}`,verifyToken,gc_propuestas_cabecerasController.GetClientes);
app.get(`${PFPC_GetDirecciones}/:id`,verifyToken,gc_propuestas_cabecerasController.GetDirecciones);
app.get(`${PFPC_GetTiposServicios}`,verifyToken,gc_propuestas_cabecerasController.GetTiposServicios);
app.get(`${PFPC_GetZonasTarifarias}`,verifyToken,gc_propuestas_cabecerasController.GetZonasTarifarias);
app.get(`${PFPC_GetFormasDePago}`,verifyToken,gc_propuestas_cabecerasController.GetFormasDePago);
app.post(`${PFPC_PostPropuestaComercial}`,verifyToken,gc_propuestas_cabecerasController.PostPropuestaComercial);
app.post(`${PFPC_PutPropuestaComercial}`,verifyToken,gc_propuestas_cabecerasController.PutPropuestaComercial);
app.get(`${PFPC_GetServiciosAdicionales}/:id`,verifyToken,gc_propuestas_cabecerasController.GetServiciosAdicionales);
app.post(`${PFPC_PostServiciosAdicionales}`,verifyToken,gc_propuestas_cabecerasController.PostServiciosAdicionales);
app.get(`${PFPC_DeleteServiciosAdicionales}/:id`,verifyToken,gc_propuestas_cabecerasController.DeleteServiciosAdicionales);
app.get(`${PFPC_DeletePropuestaComercial}/:id`,verifyToken,gc_propuestas_cabecerasController.DeletePropuestaComercial);
app.get(`${PFPC_GetPropuestaBase}`,verifyToken,gc_propuestas_cabecerasController.GetPropuestaBase);
app.get(`${PFPC_AprobarPropuesta}/:id`,verifyToken,gc_propuestas_cabecerasController.AprobarPropuesta);
app.get(`${PFPC_TerminarPropuesta}/:id`,verifyToken,gc_propuestas_cabecerasController.TerminarPropuesta);
app.get(`${PFPC_RechazarPropuesta}/:id`,verifyToken,gc_propuestas_cabecerasController.RechazarPropuesta);
app.get(`${PFPC_AnularPropuesta}/:id`,verifyToken,gc_propuestas_cabecerasController.AnularPropuesta);
app.get(`${PFPC_GetPropuestaPdfCab}/:id`,verifyToken,gc_propuestas_cabecerasController.GetPropuestaPdfCab);
app.get(`${PFPC_GetPropuestaPdfSerAd}/:id`,verifyToken,gc_propuestas_cabecerasController.GetPropuestaPdfSerAd);













module.exports=app;

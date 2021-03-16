const client = require('../config/db.client');
const jwt=require('jsonwebtoken');


/************************************************************/
/************************************************************/
exports.GetListPropuestaComercial = async (req,res) =>{

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    try {

        var condicion = ` `;

        if(parseInt(req.params.id)!=1)
        {
            var condicion = ` and cabe.id=-1 `;
        }

        if(req.usuario.fk_rol==2)
        {
            var innerJoin = ` `;
        }

        let Lista = await client.query(`
        SELECT
        cabe.id
        , TO_CHAR(cabe."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
        , coalesce(cabe."nombreCliente",'') as nombreCliente
        , coalesce(cabe."atencionA",'') as atencionA
        , coalesce(cabe."fk_tipoDeServicio",0) as fk_tipoDeServicio
        , coalesce(cabe."tipoDeCarga",'') as tipoDeCarga
        , cabe.fk_cliente
        , cabe."volumenEstimado" as volumenEstimado
        , cabe."pesoEstimado" as pesoEstimado
        , coalesce(cabe."fk_zonaDespacho",0) as fk_zonaDespacho
        , coalesce(cabe.direccion,'') as direccion
        , coalesce(cabe."fk_formaDePago",0) as fk_formaDePago
        , TO_CHAR(cabe."fechaValidez", 'DD-MM-YYYY HH24:MI') as fechaValidez
        , coalesce(cabe."fk_zonaOrigen",0) as fk_zonaOrigen
        , coalesce(cabe."fk_zonaAlmacenaje",0) as fk_zonaAlmacenaje
        , coalesce(cabe."fk_zonaDestino",0) as fk_zonaDestino
        , cabe."cmbPeso" as cmbPeso
        , cabe."unidadesACobrar" as unidadesACobrar
        , cabe."valorUnitarioUsd" as valorUnitarioUsd
        , cabe."valorBaseUsd" as valorBaseUsd
        , cabe."tarifaUsd" as tarifaUsd
        , est.nombre as estado_nombre
        FROM public.gc_propuestas_cabeceras as cabe
        inner join public.gc_propuestas_estados as est on est.id=cabe.estado
        WHERE
        cabe.estado!=999
        and cabe.estado!=4
        `+condicion+`
        order by cabe.id desc
        `);

        res.status(200).send(Lista.rows);
        res.end(); res.connection.destroy();

    } catch (error) {
        console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
        res.status(400).send({
            message: "ERROR AL GUARDAR INFORMACIÓN ",
            success:false,
        });
        res.end(); res.connection.destroy();

    }

};
/************************************************************/
/************************************************************/
exports.GetPropuestaComercial = async (req,res) =>{

    try {

        let Lista = await client.query(`
        SELECT
        cabe.id
        , cabe.estado
        , est.nombre as estadonombre
        , coalesce(cabe."nombreCliente",'') as nombreCliente
        , coalesce(cabe."atencionA",'') as atencionA
        , coalesce(cabe."fk_tipoDeServicio",0) as fk_tipoDeServicio
        , coalesce(cabe."tipoDeCarga",'') as tipoDeCarga
        , cabe.fk_cliente
        , coalesce(cabe.fk_direccion,0) as fk_direccion
        , cabe."cantProveedores" as cantproveedores
        , cabe."volumenEstimado" as volumenEstimado
        , cabe."pesoEstimado" as pesoEstimado
        , coalesce(cabe."fk_zonaDespacho",0) as fk_zonaDespacho
        , coalesce(cabe.direccion,'') as direccion
        , coalesce(cabe."fk_formaDePago",0) as fk_formaDePago
        , coalesce(cabe."fk_zonaOrigen",0) as fk_zonaOrigen
        , coalesce(cabe."fk_zonaAlmacenaje",0) as fk_zonaAlmacenaje
        , coalesce(cabe."fk_zonaDestino",0) as fk_zonaDestino
        , TO_CHAR(cabe."fechaValidez", 'DD-MM-YYYY HH24:MI') as fechaValidez
        , cabe."diasValidez" as diasValidez
        , case when cabe."cmbPeso"=0 THEN (SELECT "cmbPeso" FROM public.gc_propuestas_cabeceras WHERE id=1 ) else cabe."cmbPeso" end as cmbPeso
        , case when cabe."valorUnitarioUsd"=0 THEN (SELECT "valorUnitarioUsd" FROM public.gc_propuestas_cabeceras WHERE id=1 ) else cabe."valorUnitarioUsd" end as valorUnitarioUsd
        , case when cabe."valorBaseUsd"=0 THEN (SELECT "valorBaseUsd" FROM public.gc_propuestas_cabeceras WHERE id=1 ) else cabe."valorBaseUsd" end as valorBaseUsd
        , (SELECT "unidadesACobrar" FROM public.gc_propuestas_cabeceras WHERE id=1 ) as PB_unidadesACobrar
        , cabe."unidadesACobrar" as unidadesACobrar
        , cabe."tarifaUsd" as tarifaUsd
        FROM public.gc_propuestas_cabeceras as cabe
        left join public.gc_propuestas_estados as est on cabe.estado=est.id
        WHERE cabe.
        id=`+parseInt(req.params.id)+`
        LIMIT 1`);

        res.status(200).send(Lista.rows);
        res.end(); res.connection.destroy();

    } catch (error) {
        console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
        res.status(400).send({
            message: "ERROR AL CARGAR INFORMACIÓN ",
            success:false,
        });
        res.end(); res.connection.destroy();

    }

};
/************************************************************/
/************************************************************/
exports.GetClientes = async (req,res) =>{
try {
    let Lista = await client.query(` SELECT * FROM public.clientes order by codigo asc`);
    res.status(200).send(Lista.rows);
    res.end(); res.connection.destroy();

  } catch (error) {
      console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
      res.status(400).send({
          message: "ERROR AL CARGAR CLIENTES ",
          success:false,
      });
      res.end(); res.connection.destroy();

  }
};
/************************************************************/
/************************************************************/
exports.GetDirecciones = async (req,res) =>{
try {
    let Lista = await client.query(`
    SELECT
    dir.nombre
    , dir.fk_cliente
    , dir.fk_tipo
    , dir_tipo.nombre as tipo_nombre
    , dir.fk_pais
    , pais.nombre as pais_nombre
    , dir.fk_region
    , region.nombre as region_nombre
    , dir.fk_comuna
    , comunas.nombre as comuna_nombre
    , dir.direccion
    , dir.numero
    , dir.radio
    , dir."codigoPostal"
    , dir.referencia
    , dir.lat
    , dir.lon
    , dir.comentario
    , dir."fechaCreacion"
    , dir."fechaActualizacion"
    , dir.estado
    , dir.id
    FROM public.clientes_direcciones as dir
    inner join direcciones_tipos as dir_tipo on dir_tipo.id=dir.fk_tipo
    inner join pais on pais.id=dir.fk_pais
    inner join region on region.id=dir.fk_region
    inner join comunas on comunas.id=dir.fk_comuna
    where dir.fk_cliente=`+parseInt(req.params.id));

    res.status(200).send(Lista.rows);
    res.end(); res.connection.destroy();

  } catch (error) {
      console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
      res.status(400).send({
          message: "ERROR AL CARGAR DIRECCIONES ",
          success:false,
      });
      res.end(); res.connection.destroy();

  }
};
/************************************************************/
/************************************************************/
exports.GetTiposServicios = async (req,res) =>{
try {
    let Lista = await client.query(` SELECT * FROM public.servicios_tipos order by nombre asc`);
    res.status(200).send(Lista.rows);
    res.end(); res.connection.destroy();

  } catch (error) {
      console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
      res.status(400).send({
          message: "ERROR AL CARGAR TIPOS DE SERVICIOS",
          success:false,
      });
      res.end(); res.connection.destroy();

  }
};
/************************************************************/
/************************************************************/
exports.GetZonasTarifarias = async (req,res) =>{
try {
    let Lista = await client.query(` SELECT * FROM public.zonas_tarifarias order by nombre asc`);
    res.status(200).send(Lista.rows);
    res.end(); res.connection.destroy();

  } catch (error) {
      console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
      res.status(400).send({
          message: "ERROR AL CARGAR ZONAS TARIFARIAS",
          success:false,
      });
      res.end(); res.connection.destroy();

  }
};
/************************************************************/
/************************************************************/
exports.GetFormasDePago = async (req,res) =>{
try {
    let Lista = await client.query(` SELECT * FROM public.formas_pago order by nombre asc`);
    res.status(200).send(Lista.rows);
    res.end(); res.connection.destroy();

  } catch (error) {
      console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
      res.status(400).send({
          message: "ERROR AL CARGAR FORMAS DE PAGO",
          success:false,
      });
      res.end(); res.connection.destroy();

  }
};
/************************************************************/
/************************************************************/
exports.PostPropuestaComercial = async (req, res) => {
    var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    if(req.body.fk_tipoDeServicio==0) { req.body.fk_tipoDeServicio = null; }
    if(req.body.fk_zonaDespacho==0) { req.body.fk_zonaDespacho = null; }
    if(req.body.fk_formaDePago==0) { req.body.fk_formaDePago = null; }
    if(req.body.fk_zonaOrigen==0) { req.body.fk_zonaOrigen = null; }
    if(req.body.fk_zonaAlmacenaje==0) { req.body.fk_zonaAlmacenaje = null; }
    if(req.body.fk_zonaDestino==0) { req.body.fk_zonaDestino = null; }
    if(req.body.fk_zonaDestino==0) { req.body.fk_zonaDestino = null; }
    if(req.body.fk_cliente==0) { req.body.fk_cliente = null; }
    if(req.body.fk_direccion==0) { req.body.fk_direccion = null; }
    if(!req.body.cantProveedores || req.body.cantProveedores.length==0) { req.body.cantProveedores = 0; }

    function formatear_numero(Numero)
    {
        Numero = Numero.toString().replace(/\./g,'');
        Numero = Numero.toString().replace(/\,/g,'.');
        return Numero;
    }

    if(!req.body.volumenEstimado || req.body.volumenEstimado.length==0)
    { req.body.volumenEstimado = 0; }

    if(!req.body.pesoEstimado || req.body.pesoEstimado.length==0)
    { req.body.pesoEstimado = 0; }

    if(!req.body.cmbPeso || req.body.cmbPeso.length==0)
    { req.body.cmbPeso = 0; }

    if(!req.body.unidadesACobrar || req.body.unidadesACobrar.length==0)
    { req.body.unidadesACobrar = 0; }

    if(!req.body.valorUnitarioUsd || req.body.valorUnitarioUsd.length==0)
    { req.body.valorUnitarioUsd = 0; }

    if(!req.body.valorBaseUsd || req.body.valorBaseUsd.length==0)
    { req.body.valorBaseUsd = 0; }

    if(!req.body.tarifaUsd || req.body.tarifaUsd.length==0)
    { req.body.tarifaUsd = 0; }

    if(!req.body.diasValidez) { req.body.diasValidez = 0; }

    var fechaValidez = moment(fecha).add(req.body.diasValidez, 'days').format("YYYY-MM-DD HH:mm:ss");

    let qry_1 = '';     let qry_2 = '';

    qry_1 = ` estado, `;
    qry_2 = ` 0, `;

    qry_1 += ` fk_responsable, `;
    qry_2 += ` `+req.usuario.id+`, `;

    qry_1 += ` "fechaCreacion", `;
    qry_2 += ` '`+fecha+`', `;

    qry_1 += ` "fechaActualizacion", `;
    qry_2 += ` '`+fecha+`', `;

    qry_1 += ` "nombreCliente", `;
    qry_2 += ` '`+req.body.nombreCliente+`', `;

    qry_1 += ` "atencionA", `;
    qry_2 += ` '`+req.body.atencionA+`', `;

    qry_1 += ` "fk_tipoDeServicio", `;
    qry_2 += ` `+req.body.fk_tipoDeServicio+`, `;

    qry_1 += ` "cantProveedores", `;
    qry_2 += ` `+req.body.cantProveedores+`, `

    qry_1 += ` fk_cliente, `;
    qry_2 += ` `+req.body.fk_cliente+`, `;

    qry_1 += ` fk_direccion, `;
    qry_2 += ` `+req.body.fk_direccion+`, `;

    qry_1 += ` "tipoDeCarga", `;
    qry_2 += ` '`+req.body.tipoDeCarga+`', `;

    qry_1 += ` "volumenEstimado", `;
    qry_2 += ` `+req.body.volumenEstimado+`, `;

    qry_1 += ` "pesoEstimado", `;
    qry_2 += ` `+req.body.pesoEstimado+`, `;

    qry_1 += ` "fk_zonaDespacho", `;
    qry_2 += ` `+req.body.fk_zonaDespacho+`, `;

    qry_1 += ` direccion, `;
    qry_2 += ` '`+req.body.direccion+`', `;

    qry_1 += ` "fk_formaDePago", `;
    qry_2 += ` `+req.body.fk_formaDePago+`, `;

    qry_1 += ` "fechaValidez", `;
    qry_2 += ` '`+fechaValidez+`', `,

    qry_1 += ` "diasValidez", `;
    qry_2 += ` `+req.body.diasValidez+`, `;

    qry_1 += ` "fk_zonaOrigen", `;
    qry_2 += ` `+req.body.fk_zonaOrigen+`, `;

    qry_1 += ` "fk_zonaAlmacenaje", `;
    qry_2 += ` `+req.body.fk_zonaAlmacenaje+`, `;

    qry_1 += ` "fk_zonaDestino", `;
    qry_2 += ` `+req.body.fk_zonaDestino+`, `;

    qry_1 += ` "cmbPeso", `;
    qry_2 += ` `+req.body.cmbPeso+`, `;

    qry_1 += ` "unidadesACobrar", `;
    qry_2 += ` `+req.body.unidadesACobrar+`, `;

    qry_1 += ` "valorUnitarioUsd", `;
    qry_2 += ` `+req.body.valorUnitarioUsd+`, `;

    qry_1 += ` "valorBaseUsd", `;
    qry_2 += ` `+req.body.valorBaseUsd+`, `;

    qry_1 += ` "tarifaUsd" `;
    qry_2 += ` `+req.body.tarifaUsd+` `;

    try {

        console.log(`INSERT INTO public.gc_propuestas_cabeceras (`+qry_1+`) values (`+qry_2+`)`);
        await client.query(`INSERT INTO public.gc_propuestas_cabeceras (`+qry_1+`) values (`+qry_2+`)`);

        let UltimoId = await client.query(`
        SELECT
        id
        , coalesce("nombreCliente",'') as nombreCliente
        , coalesce("atencionA",'') as atencionA
        , coalesce("fk_tipoDeServicio",0) as fk_tipoDeServicio
        , coalesce("tipoDeCarga",'') as tipoDeCarga
        , fk_cliente
        , fk_direccion
        , "cantProveedores" as cantproveedores
        , "volumenEstimado" as volumenEstimado
        , "pesoEstimado" as pesoEstimado
        , coalesce("fk_zonaDespacho",0) as fk_zonaDespacho
        , coalesce(direccion,'') as direccion
        , coalesce("fk_formaDePago",0) as fk_formaDePago
        , TO_CHAR("fechaValidez", 'DD-MM-YYYY HH24:MI') as fechaValidez
        , "diasValidez" as diasValidez
        , coalesce("fk_zonaOrigen",0) as fk_zonaOrigen
        , coalesce("fk_zonaAlmacenaje",0) as fk_zonaAlmacenaje
        , coalesce("fk_zonaDestino",0) as fk_zonaDestino
        , "cmbPeso" as cmbPeso
        , "unidadesACobrar" as unidadesACobrar
        , "valorUnitarioUsd" as valorUnitarioUsd
        , "valorBaseUsd" as valorBaseUsd
        , "tarifaUsd" as tarifaUsd
        FROM public.gc_propuestas_cabeceras WHERE fk_responsable=`+req.usuario.id+` ORDER BY id DESC LIMIT 1`);

        res.status(200).send(UltimoId.rows);
        res.end(); res.connection.destroy();

    } catch (error) {
        console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
        res.status(400).send({
            message: "ERROR AL GUARDAR INFORMACIÓN "+error,
            success:false,
        });
        res.end(); res.connection.destroy();

    }
}
/************************************************************/
/************************************************************/
exports.GetServiciosAdicionales = async (req,res) =>{

    try {

    let Lista = await client.query(`
    SELECT
    SERAD.id
    , SERAD.estado
    , SERAD.fk_responsable
    , TO_CHAR(SERAD."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
    , SERAD."fechaActualizacion"
    , SERAD.fk_cabecera
    , coalesce(SERAD."fk_tipoDeServicio",0) as fk_tipoDeServicio
    , TS.nombre as tipoDeServicioNombre
    , coalesce(SERAD."fk_zonaOrigen",0) as fk_zonaOrigen
    , ZTO.nombre as origenNombre
    , coalesce(SERAD."fk_zonaDestino",0) as fk_zonaDestino
    , ZTD.nombre as destinoNombre

    , CASE WHEN SERAD.tarifa::TEXT LIKE '%.%' THEN
CONCAT(REPLACE(Split_part(TO_CHAR(SERAD.tarifa,'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(SERAD.tarifa,'FM999,999,999.99')::text,'.',2))
ELSE SERAD.tarifa::TEXT END as tarifa

    FROM public.gc_propuestas_servicios_adicionales AS SERAD
    INNER JOIN public.servicios_tipos as TS ON TS.id=SERAD."fk_tipoDeServicio"
    INNER JOIN public.zonas_tarifarias as ZTO ON SERAD."fk_zonaOrigen" = ZTO.id
    INNER JOIN public.zonas_tarifarias as ZTD ON SERAD."fk_zonaDestino" = ZTD.id

    WHERE SERAD.estado!=999 AND SERAD.fk_cabecera=`+parseInt(req.params.id)+` order by SERAD.id desc`);

    res.status(200).send(Lista.rows);

    } catch (error) {
        console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
        res.status(400).send({
            message: "ERROR AL CARGAR LISTADO DE SERVICIOS ADICIONALES "+error,
            success:false,
        });
        res.end(); res.connection.destroy();
    }
};
/************************************************************/
/************************************************************/
exports.PostServiciosAdicionales = async (req,res) =>{ try{

var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

if (!req.body.fk_cabecera || req.body.fk_cabecera==0) {
    res.status(400).send({
        message: "NO SE DETECTO UNA PROPUESTA CREADA PARA ASIGNAR SERVICIOS ADICIONALES",
        success:false
    }); res.end(); res.connection.destroy();
    return;
} else if (!req.body.fk_tipoServicio || req.body.fk_tipoServicio==0) {
    res.status(400).send({
        message: "EL TIPO DE SERVICIO ES OBLIGATORIO",
        success:false
    }); res.end(); res.connection.destroy();
    return;
} else if (!req.body.fk_zonaOrigen || req.body.fk_zonaOrigen==0) {
    res.status(400).send({
        message: "EL ORIGEN ES OBLIGATORIO",
        success:false
    }); res.end(); res.connection.destroy();
    return;
} else if (!req.body.fk_zonaDestino || req.body.fk_zonaDestino==0) {
    res.status(400).send({
        message: "EL DESTINO ES OBLIGATORIO",
        success:false
    }); res.end(); res.connection.destroy();
    return;
} else if (!req.body.tarifa || req.body.tarifa==0) {
    res.status(400).send({
        message: "LA TARIFA ES OBLIGATORIA",
        success:false
    }); res.end(); res.connection.destroy();
    return;
} else {

  function formatear_numero(Numero)
  {
      Numero = Numero.toString().replace(/\./g,'');
      Numero = Numero.toString().replace(/\,/g,'.');
      return Numero;
  }
  if(!req.body.tarifa || req.body.tarifa.length==0)
  { req.body.tarifa = 0; }

  let qry_1 = '';     let qry_2 = '';

  qry_1 = ` estado, `;
  qry_2 = ` 0, `;

  qry_1 += ` fk_responsable, `;
  qry_2 += ` `+req.usuario.id+`, `;

  qry_1 += ` "fechaCreacion", `;
  qry_2 += ` '`+fecha+`', `;

  qry_1 += ` "fechaActualizacion", `;
  qry_2 += ` '`+fecha+`', `;

  qry_1 += ` fk_cabecera, `;
  qry_2 += ` `+req.body.fk_cabecera+`, `;

  qry_1 += ` "fk_tipoDeServicio", `;
  qry_2 += ` `+req.body.fk_tipoServicio+`, `;

  qry_1 += ` "fk_zonaOrigen", `;
  qry_2 += ` `+req.body.fk_zonaOrigen+`, `;

  qry_1 += ` "fk_zonaDestino", `;
  qry_2 += ` `+req.body.fk_zonaDestino+`, `;

  qry_1 += ` tarifa `;
  qry_2 += ` `+req.body.tarifa+` `;

  try {

      let Existe = await client.query(`
      SELECT
      *
      FROM
      public.gc_propuestas_servicios_adicionales
      where
      estado=0 and fk_cabecera=`+req.body.fk_cabecera+` and "fk_tipoDeServicio"=`+req.body.fk_tipoServicio+`
      and "fk_zonaOrigen"=`+req.body.fk_zonaOrigen+` and "fk_zonaDestino"=`+req.body.fk_zonaDestino+`
      `);

      if(Existe.rows.length>0)
      {
        res.status(400).send({
            message: "LA INFORMACIÓN YA ESTÁ REGISTRADA",
            success:false,
        }); res.end(); res.connection.destroy();
      }
      else {
        await client.query(`INSERT INTO public.gc_propuestas_servicios_adicionales (`+qry_1+`) values (`+qry_2+`)`);

        res.status(200).send([]);
        res.end(); res.connection.destroy();
      }


  } catch (error) {
      console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
      res.status(400).send({
          message: "ERROR AL GUARDAR INFORMACIÓN "+error,
          success:false,
      }); res.end(); res.connection.destroy();

  }

}
} catch (error) { res.status(400).send({ message: "ERROR GENERAR AL GUARDAR SERVICIO ADICIONAL "+error, success:false, }); res.end(); res.connection.destroy(); }}
/************************************************************/
/************************************************************/
exports.DeleteServiciosAdicionales = async (req,res) =>{
    try {

        await client.query(`UPDATE public.gc_propuestas_servicios_adicionales SET estado=999 WHERE id=`+parseInt(req.params.id));

        res.status(200).send([]);

    } catch (error) {
        console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
        res.status(400).send({
            message: "ERROR AL ELIMINAR SERVICIOS ADICIONALES "+error,
            success:false,
        });

    }
};
/************************************************************/
/************************************************************/
exports.PutPropuestaComercial = async (req, res) => {
    var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    if(req.body.fk_tipoDeServicio==0) { req.body.fk_tipoDeServicio = null; }
    if(req.body.fk_zonaDespacho==0) { req.body.fk_zonaDespacho = null; }
    if(req.body.fk_formaDePago==0) { req.body.fk_formaDePago = null; }
    if(req.body.fk_zonaOrigen==0) { req.body.fk_zonaOrigen = null; }
    if(req.body.fk_zonaAlmacenaje==0) { req.body.fk_zonaAlmacenaje = null; }
    if(req.body.fk_zonaDestino==0) { req.body.fk_zonaDestino = null; }
    if(req.body.fk_cliente==0) { req.body.fk_cliente = null; }
    if(!req.body.fk_direccion ||  req.body.fk_direccion==0) { req.body.fk_direccion = null; }
    if(!req.body.cantProveedores || req.body.cantProveedores.length==0) { req.body.cantProveedores = 0; }
    if(!req.body.diasValidez) { req.body.diasValidez = 0; }

    var fechaValidez = moment(fecha, "YYYY-MM-DD HH:mm:ss").add(req.body.diasValidez, 'days').format("YYYY-MM-DD HH:mm:ss");

    function formatear_numero(Numero)
    {
        Numero = Numero.toString().replace(/\./g,'');
        Numero = Numero.toString().replace(/\,/g,'.');
        return Numero;
    }
    if(!req.body.volumenEstimado || req.body.volumenEstimado.length==0)
    { req.body.volumenEstimado = 0; }

    if(!req.body.pesoEstimado || req.body.pesoEstimado.length==0)
    { req.body.pesoEstimado = 0; }

    if(!req.body.cmbPeso || req.body.cmbPeso.length==0)
    { req.body.cmbPeso = 0; }

    if(!req.body.unidadesACobrar || req.body.unidadesACobrar.length==0)
    { req.body.unidadesACobrar = 0; }

    if(!req.body.valorUnitarioUsd || req.body.valorUnitarioUsd.length==0)
    { req.body.valorUnitarioUsd = 0; }

    if(!req.body.valorBaseUsd || req.body.valorBaseUsd.length==0)
    { req.body.valorBaseUsd = 0; }

    if(!req.body.tarifaUsd || req.body.tarifaUsd.length==0)
    { req.body.tarifaUsd = 0; }

    let qry_1 = '';

    qry_1 = ` estado=0, `;

    qry_1 += ` fk_responsable=`+req.usuario.id+`, `;

    qry_1 += ` "fechaActualizacion"='`+fecha+`', `;

    qry_1 += ` "nombreCliente"='`+req.body.nombreCliente+`', `;

    qry_1 += ` "atencionA"='`+req.body.atencionA+`', `;

    qry_1 += ` "fk_tipoDeServicio"=`+req.body.fk_tipoDeServicio+`, `;

    qry_1 += ` fk_cliente=`+req.body.fk_cliente+`, `;

    qry_1 += ` fk_direccion=`+req.body.fk_direccion+`, `;

    qry_1 += ` "cantProveedores"=`+req.body.cantProveedores+`, `;

    qry_1 += ` "tipoDeCarga"='`+req.body.tipoDeCarga+`', `;

    qry_1 += ` "volumenEstimado"=`+req.body.volumenEstimado+`, `;

    qry_1 += ` "pesoEstimado"=`+req.body.pesoEstimado+`, `;

    qry_1 += ` "fk_zonaDespacho"=`+req.body.fk_zonaDespacho+`, `;

    qry_1 += ` direccion='`+req.body.direccion+`', `;

    qry_1 += ` "fk_formaDePago"=`+req.body.fk_formaDePago+`, `;

    qry_1 += ` "fechaValidez"='`+fechaValidez+`', `;

    qry_1 += ` "diasValidez"=`+req.body.diasValidez+`, `;

    qry_1 += ` "fk_zonaOrigen"=`+req.body.fk_zonaOrigen+`, `;

    qry_1 += ` "fk_zonaAlmacenaje"=`+req.body.fk_zonaAlmacenaje+`, `;

    qry_1 += ` "fk_zonaDestino"=`+req.body.fk_zonaDestino+`, `;

    qry_1 += ` "cmbPeso"=`+req.body.cmbPeso+`, `;

    qry_1 += ` "unidadesACobrar"=`+req.body.unidadesACobrar+`, `;

    qry_1 += ` "valorUnitarioUsd"=`+req.body.valorUnitarioUsd+`, `;

    qry_1 += ` "valorBaseUsd"=`+req.body.valorBaseUsd+`, `;

    qry_1 += ` "tarifaUsd"=`+req.body.tarifaUsd+` `;

    try {

        await client.query(`UPDATE public.gc_propuestas_cabeceras SET `+qry_1+` WHERE id=`+req.body.id+` `);

        res.status(200).send([]);
        res.end(); res.connection.destroy();

    } catch (error) {
        console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
        res.status(400).send({
            message: "ERROR AL ACTUALIZAR INFORMACIÓN "+error,
            success:false,
        });
        res.end(); res.connection.destroy();
    }
}


/************************************************************/
/************************************************************/
exports.DeletePropuestaComercial = async (req,res) =>{
    try {

      let Existe = await client.query(`
      SELECT
      id
      FROM public.tracking
      WHERE
      fk_propuesta=`+parseInt(req.params.id)+`
      `);

      if(Existe.rows.length>0)
      {
        res.status(400).send({
            message: "NO SE PUEDE ELIMINAR LA PROPUESTA, TIENE INFORMACIÓN RELACIONADA ",
            success:false,
        });
        res.end(); res.connection.destroy();
      }
      else {
          await client.query(`UPDATE public.gc_propuestas_cabeceras SET estado=999 WHERE id=`+parseInt(Object.values(req.params)));
          res.status(200).send([]);
      }

    } catch (error) {
        console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
        res.status(400).send({
            message: "ERROR AL ELIMINAR PROPUESTA "+error,
            success:false,
        });

    }
};
/************************************************************/
/************************************************************/
exports.GetPropuestaBase = async (req,res) =>{

    try {

        let Lista = await client.query(`
        SELECT
        "diasValidez" as diasValidez
        , "cmbPeso"
        , "valorBaseUsd" as valorBaseUsd
        , "valorUnitarioUsd" as valorUnitarioUsd
        , "unidadesACobrar" as unidadesACobrar
        FROM public.gc_propuestas_cabeceras WHERE id=1 LIMIT 1`);

        res.status(200).send(Lista.rows);
        res.end(); res.connection.destroy();

    } catch (error) {
        console.log("ERROR");console.log("ERROR");console.log(error);console.log("ERROR");console.log("ERROR");
        res.status(400).send({
            message: "ERROR AL CARGAR INFORMACIÓN ",
            success:false,
        });
        res.end(); res.connection.destroy();

    }

};
/************************************************************/
/************************************************************/
exports.TerminarPropuesta = async (req,res) =>{
    var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    var FaltaInfo = await client.query(`
    SELECT
    *
    FROM public.gc_propuestas_cabeceras
    WHERE
    id=`+parseInt(req.params.id)+`
    and (
      "cantProveedores" is null
      or fk_responsable is null
      or fk_cliente is null or fk_cliente=0
      or fk_direccion is null or fk_direccion=0
      or LENGTH(TRIM("nombreCliente"))=0
      or LENGTH(TRIM("atencionA"))=0
      or "fk_tipoDeServicio" is null or "fk_tipoDeServicio"=0
      or "tipoDeCarga" is null or LENGTH(TRIM("tipoDeCarga"))=0
      or "volumenEstimado"<=0
      or "pesoEstimado"<=0
      or "fk_zonaDespacho" is null or "fk_zonaDespacho"=0
      or LENGTH(TRIM(direccion))=0
      or "fk_formaDePago" is null or "fk_formaDePago"=0
      or "diasValidez"=0 or "diasValidez" is null
      or "fk_zonaOrigen" is null or "fk_zonaOrigen"=0
      or "fk_zonaAlmacenaje" is null or "fk_zonaAlmacenaje"=0
      or "fk_zonaDestino" is null or "fk_zonaDestino"=0
      or "cmbPeso" is null or "cmbPeso"=0
      or "unidadesACobrar" is null or "unidadesACobrar"=0
      or "valorUnitarioUsd" is null or "valorUnitarioUsd"=0
      or "valorBaseUsd" is null or "valorBaseUsd"=0
      or "tarifaUsd" is null or "tarifaUsd"=0
    )
    `);

    if(FaltaInfo.rows.length>0)
    {
        res.status(400).send({
            message: "FALTA INFORMACIÓN EN LA PROPUESTA",
            success:false
        }); res.end(); res.connection.destroy();
    }
    else
    {
      var PropuestaInfo = await client.query(`
      SELECT
      *
      FROM public.gc_propuestas_cabeceras
      WHERE
      id=`+parseInt(req.params.id)+`
      `);

      var PropuestaBase = await client.query(`
      SELECT
      *
      FROM public.gc_propuestas_cabeceras
      WHERE
      id=1
      `);

      var estado = 1;
      console.log(PropuestaInfo.rows[0].valorUnitarioUsd+' -- '+PropuestaBase.rows[0].valorUnitarioUsd);
      if(PropuestaInfo.rows[0].valorUnitarioUsd<PropuestaBase.rows[0].valorUnitarioUsd)
      {
        estado = 2;
      }

      console.log(PropuestaInfo.rows[0].diasValidez+' -- '+PropuestaBase.rows[0].diasValidez);
      if(PropuestaInfo.rows[0].diasValidez<PropuestaBase.rows[0].diasValidez)
      {
        estado = 2;
      }

      console.log(`UPDATE public.gc_propuestas_cabeceras SET estado=`+estado+`, "fechaActualizacion"='`+fecha+`' WHERE id=`+parseInt(req.params.id)+` `);
      await client.query(`UPDATE public.gc_propuestas_cabeceras SET estado=`+estado+`, "fechaActualizacion"='`+fecha+`' WHERE id=`+parseInt(req.params.id)+` `);
      res.status(200).send(""+estado);
    }
}
/************************************************************/
/************************************************************/
exports.AprobarPropuesta = async (req,res) =>{
    var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    let Existe = await client.query(`
    SELECT
    id
    FROM public.tracking
    WHERE
    fk_propuesta=`+parseInt(req.params.id)+`
    `);

    if(Existe.rows.length>0)
    {
      res.status(400).send({
          message: "NO SE PUEDE APROBAR LA PROPUESTA, TIENE TRACKING RELACIONADOS ",
          success:false,
      });
      res.end(); res.connection.destroy();
    }
    else {
        await client.query(`UPDATE public.gc_propuestas_cabeceras SET estado=1, "fechaActualizacion"='`+fecha+`' WHERE id=`+parseInt(req.params.id)+` `);
        res.status(200).send("1");
    }
}
/************************************************************/
/************************************************************/
exports.RechazarPropuesta = async (req,res) =>{
    var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    let Existe = await client.query(`
    SELECT
    id
    FROM public.tracking
    WHERE
    fk_propuesta=`+parseInt(req.params.id)+`
    `);

    if(Existe.rows.length>0)
    {
      res.status(400).send({
          message: "NO SE PUEDE RECHAZAR LA PROPUESTA, TIENE TRACKING RELACIONADOS ",
          success:false,
      });
      res.end(); res.connection.destroy();
    }
    else {
        await client.query(`UPDATE public.gc_propuestas_cabeceras SET estado=3, "fechaActualizacion"='`+fecha+`' WHERE id=`+parseInt(req.params.id)+` `);
        res.status(200).send("3");
    }
}
/************************************************************/
/************************************************************/
exports.AnularPropuesta = async (req,res) =>{
    var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    let Existe = await client.query(`
    SELECT
    id
    FROM public.tracking
    WHERE
    fk_propuesta=`+parseInt(req.params.id)+`
    `);

    if(Existe.rows.length>0)
    {
      res.status(400).send({
          message: "NO SE PUEDE ANULAR LA PROPUESTA, TIENE TRACKING RELACIONADOS ",
          success:false,
      });
      res.end(); res.connection.destroy();
    }
    else {
        await client.query(`UPDATE public.gc_propuestas_cabeceras SET estado=4, "fechaActualizacion"='`+fecha+`' WHERE id=`+parseInt(req.params.id)+` `);
        res.status(200).send("4");
    }
}
/************************************************************/
/************************************************************/
exports.GetPropuestaPdfCab = async (req,res) =>{

    try {

    let Informacion = await client.query(`
    SELECT
    cabe.id
    , coalesce(cabe."nombreCliente",'') as nombreCliente
    , coalesce(cabe."atencionA",'') as atencionA
    , coalesce(cabe."fk_tipoDeServicio",0) as fk_tipoDeServicio
    , coalesce(cabe."tipoDeCarga",'') as tipoDeCarga
    , cabe.fk_cliente
    , cabe.fk_direccion
    , cabe."cantProveedores" as cantproveedores
    , coalesce(cabe.direccion, '') as direccion

    , CASE WHEN cabe."volumenEstimado"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."volumenEstimado",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."volumenEstimado",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."volumenEstimado"::TEXT END as volumenEstimado

    , CASE WHEN cabe."pesoEstimado"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."pesoEstimado",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."pesoEstimado",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."pesoEstimado"::TEXT END as pesoEstimado

    , coalesce(cabe."fk_zonaDespacho",0) as fk_zonaDespacho
    , coalesce(cabe.direccion,'') as direccion
    , coalesce(cabe."fk_formaDePago",0) as fk_formaDePago
    , TO_CHAR(cabe."fechaValidez", 'DD-MM-YYYY HH24:MI') as fechaValidez
    , coalesce(cabe."fk_zonaOrigen",0) as fk_zonaOrigen
    , coalesce(cabe."fk_zonaAlmacenaje",0) as fk_zonaAlmacenaje
    , coalesce(cabe."fk_zonaDestino",0) as fk_zonaDestino

    , CASE WHEN cabe."cmbPeso"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."cmbPeso",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."cmbPeso",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."cmbPeso"::TEXT END as cmbPeso

    , CASE WHEN cabe."unidadesACobrar"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."unidadesACobrar",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."unidadesACobrar",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."unidadesACobrar"::TEXT END as unidadesACobrar

    , CASE WHEN cabe."valorUnitarioUsd"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."valorUnitarioUsd",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."valorUnitarioUsd",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."valorUnitarioUsd"::TEXT END as valorUnitarioUsd

    , CASE WHEN cabe."tarifaUsd"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."tarifaUsd",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."tarifaUsd",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."tarifaUsd"::TEXT END as tarifaUsd

    , coalesce(ser.nombre,'') as servicio_nombre
    FROM
    public.gc_propuestas_cabeceras as cabe
    left join public.servicios_tipos as ser on cabe."fk_tipoDeServicio"=ser.id
    WHERE cabe.id=`+parseInt(req.params.id)+` limit 1`);

    console.log(`
    SELECT
    cabe.id
    , coalesce(cabe."nombreCliente",'') as nombreCliente
    , coalesce(cabe."atencionA",'') as atencionA
    , coalesce(cabe."fk_tipoDeServicio",0) as fk_tipoDeServicio
    , coalesce(cabe."tipoDeCarga",'') as tipoDeCarga
    , cabe.fk_cliente
    , cabe.fk_direccion
    , cabe."cantProveedores" as cantproveedores
    , coalesce(cabe.direccion, '') as direccion

    , CASE WHEN cabe."volumenEstimado"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."volumenEstimado",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."volumenEstimado",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."volumenEstimado"::TEXT END as volumenEstimado

    , CASE WHEN cabe."pesoEstimado"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."pesoEstimado",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."pesoEstimado",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."pesoEstimado"::TEXT END as pesoEstimado

    , coalesce(cabe."fk_zonaDespacho",0) as fk_zonaDespacho
    , coalesce(cabe.direccion,'') as direccion
    , coalesce(cabe."fk_formaDePago",0) as fk_formaDePago
    , TO_CHAR(cabe."fechaValidez", 'DD-MM-YYYY HH24:MI') as fechaValidez
    , coalesce(cabe."fk_zonaOrigen",0) as fk_zonaOrigen
    , coalesce(cabe."fk_zonaAlmacenaje",0) as fk_zonaAlmacenaje
    , coalesce(cabe."fk_zonaDestino",0) as fk_zonaDestino

    , CASE WHEN cabe."cmbPeso"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."cmbPeso",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."cmbPeso",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."cmbPeso"::TEXT END as cmbPeso

    , CASE WHEN cabe."unidadesACobrar"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."unidadesACobrar",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."unidadesACobrar",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."unidadesACobrar"::TEXT END as unidadesACobrar

    , CASE WHEN cabe."valorUnitarioUsd"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."valorUnitarioUsd",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."valorUnitarioUsd",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."valorUnitarioUsd"::TEXT END as valorUnitarioUsd

    , CASE WHEN cabe."tarifaUsd"::TEXT LIKE '%.%' THEN
    CONCAT(REPLACE(Split_part(TO_CHAR(cabe."tarifaUsd",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe."tarifaUsd",'FM999,999,999.99')::text,'.',2))
    ELSE cabe."tarifaUsd"::TEXT END as tarifaUsd

    , coalesce(ser.nombre,'') as servicio_nombre
    FROM
    public.gc_propuestas_cabeceras as cabe
    left join public.servicios_tipos as ser on cabe."fk_tipoDeServicio"=ser.id
    WHERE cabe.id=`+parseInt(req.params.id)+` limit 1`);

    res.status(200).send(Informacion.rows);

    } catch (error) {

        res.status(400).send({
            message: "ERROR AL CARGAR CABECERA "+error,
            success:false,
        });
        res.end(); res.connection.destroy();
    }
};
/************************************************************/
/************************************************************/
exports.GetPropuestaPdfSerAd = async (req,res) =>{

    try {

    let Informacion = await client.query(`
    Select
    TO_CHAR(tar."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
    , TO_CHAR(tar."fechaActualizacion", 'DD-MM-YYYY HH24:MI') as actualizacion
    , tar.id
    , tar.origen
    , tar.tarifa
    , tar.destino
    , tar.estado
    , tar.fk_cabecera
    FROM public.gc_propuestas_serviciosadicionales as tar
    where tar.estado=0 and tar.fk_cabecera=`+parseInt(req.params.id)+` order by SERAD.id desc`);

    res.status(200).send(Informacion.rows);

    } catch (error) {

        res.status(400).send({
            message: "ERROR AL CARGAR CABECERA "+error,
            success:false,
        });
        res.end(); res.connection.destroy();
    }
};
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/



















    /************************************************************/
    /************************************************************/


    /************************************************************/
    /************************************************************/


    exports.findByPdfTarifa = (req, res) => {
      client.query(`
          Select
          TO_CHAR(tar."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
          , TO_CHAR(tar."fechaActualizacion", 'DD-MM-YYYY HH24:MI') as actualizacion
          , tar.id
          , tar.origen
          , tar.almacenaje
          , tar.destino
          , tar."cbmPeso"
          , tar."valorUnitarioUsd"
          , tar."unidadesACobrar"
          , tar."tarifaUsd"
          , tar."fechaCreacion"
          , tar."fechaActualizacion"
          , tar.estado
          , tar.fk_cabecera
          FROM public.gc_propuestas_tarifas as tar
          where tar.estado=0 and tar.fk_cabecera = $1
          `, [req.params.id], function (err, result) {
          if (err) {
              res.status(400).send(err);
          }
          res.status(200).send(result.rows);
      });
    };
    /************************************************************/
    /************************************************************/

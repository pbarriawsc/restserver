const client = require('../config/db.client');
const jwt=require('jsonwebtoken');

    /************************************************************/
    /************************************************************/
    exports.ListServiciosTipos = (req, res) => {
        client.query(` SELECT id, nombre FROM public.servicios_tipos where estado is true order by nombre asc`, "", function (err, result) {
        if (err) { console.log(err); res.status(400).send(err); } res.status(200).send(result.rows); });
    };
    /************************************************************/
    /************************************************************/
    exports.ListZonasTarifarias = (req, res) => {
        client.query(` SELECT id, nombre FROM public.zonas_tarifarias where estado is true order by nombre asc`, "", function (err, result) {
        if (err) { console.log(err); res.status(400).send(err); } res.status(200).send(result.rows); });
    };
    /************************************************************/
    /************************************************************/
    exports.ListFormasPago = (req, res) => {
        client.query(` SELECT id, nombre FROM public.formas_pago order by nombre asc`, "", function (err, result) {
        if (err) { console.log(err); res.status(400).send(err); } res.status(200).send(result.rows); });
    };
    /************************************************************/
    /************************************************************/
    exports.create = async (req, res) => {
        var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

        if(req.body.gcpc_fk_tipoDeServicio==0) { req.body.gcpc_fk_tipoDeServicio = null; }
        if(req.body.gcpc_fk_zonaDespacho==0) { req.body.gcpc_fk_zonaDespacho = null; }
        if(req.body.gcpc_fk_formaDePago==0) { req.body.gcpc_fk_formaDePago = null; }
        if(req.body.gcpc_fk_zonaOrigen==0) { req.body.gcpc_fk_zonaOrigen = null; }
        if(req.body.gcpc_fk_zonaAlmacenaje==0) { req.body.gcpc_fk_zonaAlmacenaje = null; }
        if(req.body.gcpc_fk_zonaDestino==0) { req.body.gcpc_fk_zonaDestino = null; }
        if(req.body.gcpc_fk_zonaDestino==0) { req.body.gcpc_fk_zonaDestino = null; }

        function formatear_numero(Numero)
        {
            Numero = Numero.toString().replace(/\./g,'');
            Numero = Numero.toString().replace(/\,/g,'.');
            return Numero;
        }
        if(!req.body.gcpc_volumenEstimado || req.body.gcpc_volumenEstimado.length==0)
        { req.body.gcpc_volumenEstimado = 0; } else {
            req.body.gcpc_volumenEstimado = formatear_numero(req.body.gcpc_volumenEstimado);
        }

        if(!req.body.gcpc_pesoEstimado || req.body.gcpc_pesoEstimado.length==0)
        { req.body.gcpc_pesoEstimado = 0; } else {
            req.body.gcpc_pesoEstimado = formatear_numero(req.body.gcpc_pesoEstimado);
        }

        if(!req.body.gcpc_factor || req.body.gcpc_factor.length==0)
        { req.body.gcpc_factor = 0; } else {
            req.body.gcpc_factor = formatear_numero(req.body.gcpc_factor);
        }

        if(!req.body.gcpc_cmbPeso || req.body.gcpc_cmbPeso.length==0)
        { req.body.gcpc_cmbPeso = 0; } else {
            req.body.gcpc_cmbPeso = formatear_numero(req.body.gcpc_cmbPeso);
        }

        if(!req.body.gcpc_unidadesACobrar || req.body.gcpc_unidadesACobrar.length==0)
        { req.body.gcpc_unidadesACobrar = 0; } else {
            req.body.gcpc_unidadesACobrar = formatear_numero(req.body.gcpc_unidadesACobrar);
        }

        if(!req.body.gcpc_valorUnitarioUsd || req.body.gcpc_valorUnitarioUsd.length==0)
        { req.body.gcpc_valorUnitarioUsd = 0; } else {
            req.body.gcpc_valorUnitarioUsd = formatear_numero(req.body.gcpc_valorUnitarioUsd);
        }

        if(!req.body.gcpc_tarifaUsd || req.body.gcpc_tarifaUsd.length==0)
        { req.body.gcpc_tarifaUsd = 0; } else {
            req.body.gcpc_tarifaUsd = formatear_numero(req.body.gcpc_tarifaUsd);
        }

        let qry_1 = '';     let qry_2 = '';

        qry_1 = ` estado, `;
        qry_2 = ` 0, `;

        qry_1 += ` fk_responsable, `;
        qry_2 += ` `+req.usuario.id+`, `;

        qry_1 += ` "fechaCreacion", `;
        qry_2 += ` '`+fecha+`', `;

        qry_1 += ` "fechaActualizacion", `;
        qry_2 += ` '`+fecha+`', `;

        qry_1 += ` fk_contacto, `;
        qry_2 += ` `+req.body.gcpc_fk_contacto+`, `;

        qry_1 += ` "nombreCliente", `;
        qry_2 += ` '`+req.body.gcpc_nombreCliente+`', `;

        qry_1 += ` "atencionA", `;
        qry_2 += ` '`+req.body.gcpc_atencionA+`', `;

        qry_1 += ` "fk_tipoDeServicio", `;
        qry_2 += ` `+req.body.gcpc_fk_tipoDeServicio+`, `;

        qry_1 += ` "tipoDeCarga", `;
        qry_2 += ` '`+req.body.gcpc_tipoDeCarga+`', `;

        qry_1 += ` "volumenEstimado", `;
        qry_2 += ` `+req.body.gcpc_volumenEstimado+`, `;

        qry_1 += ` "pesoEstimado", `;
        qry_2 += ` `+req.body.gcpc_pesoEstimado+`, `;

        qry_1 += ` "fk_zonaDespacho", `;
        qry_2 += ` `+req.body.gcpc_fk_zonaDespacho+`, `;

        qry_1 += ` direccion, `;
        qry_2 += ` '`+req.body.gcpc_direccion+`', `;

        qry_1 += ` "fk_formaDePago", `;
        qry_2 += ` `+req.body.gcpc_fk_formaDePago+`, `;

        qry_1 += ` "fechaValidez", `;
        qry_2 += ` '`+req.body.gcpc_fechaValidez+`', `;

        qry_1 += ` "fk_zonaOrigen", `;
        qry_2 += ` `+req.body.gcpc_fk_zonaOrigen+`, `;

        qry_1 += ` "fk_zonaAlmacenaje", `;
        qry_2 += ` `+req.body.gcpc_fk_zonaAlmacenaje+`, `;

        qry_1 += ` "fk_zonaDestino", `;
        qry_2 += ` `+req.body.gcpc_fk_zonaDestino+`, `;

        qry_1 += ` factor, `;
        qry_2 += ` `+req.body.gcpc_factor+`, `;

        qry_1 += ` "cmbPeso", `;
        qry_2 += ` `+req.body.gcpc_cmbPeso+`, `;

        qry_1 += ` "unidadesACobrar", `;
        qry_2 += ` `+req.body.gcpc_unidadesACobrar+`, `;

        qry_1 += ` "valorUnitarioUsd", `;
        qry_2 += ` `+req.body.gcpc_valorUnitarioUsd+`, `;

        qry_1 += ` "tarifaUsd" `;
        qry_2 += ` `+req.body.gcpc_tarifaUsd+` `;

        try {

            await client.query(`INSERT INTO public.gc_propuestas_cabeceras (`+qry_1+`) values (`+qry_2+`)`);

            let UltimoId = await client.query(`
            SELECT
            id
            , coalesce("nombreCliente",'') as nombreCliente
            , coalesce("atencionA",'') as atencionA
            , coalesce("fk_tipoDeServicio",0) as fk_tipoDeServicio
            , coalesce("tipoDeCarga",'') as tipoDeCarga

            , CASE WHEN "volumenEstimado"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("volumenEstimado",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("volumenEstimado",'FM999,999,999.99')::text,'.',2))
            ELSE "volumenEstimado"::TEXT END as volumenEstimado

            , CASE WHEN "pesoEstimado"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("pesoEstimado",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("pesoEstimado",'FM999,999,999.99')::text,'.',2))
            ELSE "pesoEstimado"::TEXT END as pesoEstimado

            , coalesce("fk_zonaDespacho",0) as fk_zonaDespacho
            , coalesce(direccion,'') as direccion
            , coalesce("fk_formaDePago",0) as fk_formaDePago
            , coalesce("fechaValidez",'') as fechaValidez
            , coalesce("fk_zonaOrigen",0) as fk_zonaOrigen
            , coalesce("fk_zonaAlmacenaje",0) as fk_zonaAlmacenaje
            , coalesce("fk_zonaDestino",0) as fk_zonaDestino

            , CASE WHEN factor::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR(factor,'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(factor,'FM999,999,999.99')::text,'.',2))
            ELSE factor::TEXT END as factor

            , CASE WHEN "cmbPeso"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("cmbPeso",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("cmbPeso",'FM999,999,999.99')::text,'.',2))
            ELSE "cmbPeso"::TEXT END as cmbPeso

            , CASE WHEN "unidadesACobrar"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("unidadesACobrar",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("unidadesACobrar",'FM999,999,999.99')::text,'.',2))
            ELSE "unidadesACobrar"::TEXT END as unidadesACobrar

            , CASE WHEN "valorUnitarioUsd"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("valorUnitarioUsd",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("valorUnitarioUsd",'FM999,999,999.99')::text,'.',2))
            ELSE "valorUnitarioUsd"::TEXT END as valorUnitarioUsd

            , CASE WHEN "tarifaUsd"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("tarifaUsd",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("tarifaUsd",'FM999,999,999.99')::text,'.',2))
            ELSE "tarifaUsd"::TEXT END as tarifaUsd
            FROM public.gc_propuestas_cabeceras WHERE fk_responsable=`+req.usuario.id+` ORDER BY id DESC LIMIT 1`);

            res.status(200).send(UltimoId.rows[0]);

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL GUARDAR INFORMACIÓN "+error,
                success:false,
            });

        }
    }
    /************************************************************/
    /************************************************************/
    exports.findByDesarrollo = async (req,res) =>{

        try {

            let Propuesta_Desarrollo = await client.query(`
            SELECT
            id
            , coalesce("nombreCliente",'') as nombreCliente
            , coalesce("atencionA",'') as atencionA
            , coalesce("fk_tipoDeServicio",0) as fk_tipoDeServicio
            , coalesce("tipoDeCarga",'') as tipoDeCarga

            , CASE WHEN "volumenEstimado"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("volumenEstimado",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("volumenEstimado",'FM999,999,999.99')::text,'.',2))
            ELSE "volumenEstimado"::TEXT END as volumenEstimado

            , CASE WHEN "pesoEstimado"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("pesoEstimado",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("pesoEstimado",'FM999,999,999.99')::text,'.',2))
            ELSE "pesoEstimado"::TEXT END as pesoEstimado

            , coalesce("fk_zonaDespacho",0) as fk_zonaDespacho
            , coalesce(direccion,'') as direccion
            , coalesce("fk_formaDePago",0) as fk_formaDePago
            , coalesce("fechaValidez",'') as fechaValidez
            , coalesce("fk_zonaOrigen",0) as fk_zonaOrigen
            , coalesce("fk_zonaAlmacenaje",0) as fk_zonaAlmacenaje
            , coalesce("fk_zonaDestino",0) as fk_zonaDestino

            , CASE WHEN factor::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR(factor,'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(factor,'FM999,999,999.99')::text,'.',2))
            ELSE factor::TEXT END as factor

            , CASE WHEN "cmbPeso"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("cmbPeso",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("cmbPeso",'FM999,999,999.99')::text,'.',2))
            ELSE "cmbPeso"::TEXT END as cmbPeso

            , CASE WHEN "unidadesACobrar"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("unidadesACobrar",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("unidadesACobrar",'FM999,999,999.99')::text,'.',2))
            ELSE "unidadesACobrar"::TEXT END as unidadesACobrar

            , CASE WHEN "valorUnitarioUsd"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("valorUnitarioUsd",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("valorUnitarioUsd",'FM999,999,999.99')::text,'.',2))
            ELSE "valorUnitarioUsd"::TEXT END as valorUnitarioUsd

            , CASE WHEN "tarifaUsd"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("tarifaUsd",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("tarifaUsd",'FM999,999,999.99')::text,'.',2))
            ELSE "tarifaUsd"::TEXT END as tarifaUsd
            FROM public.gc_propuestas_cabeceras WHERE estado=0 AND fk_contacto=`+parseInt(Object.values(req.params))+` LIMIT 1`);

            res.status(200).send(Propuesta_Desarrollo.rows[0]);

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL GUARDAR INFORMACIÓN "+error,
                success:false,
            });

        }

    };
    /************************************************************/
    /************************************************************/
    exports.update = async (req, res) => {
        var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

        if (!req.body.gcpcserad_fk_cabecera || req.body.gcpcserad_fk_cabecera==0) {
            res.status(400).send({
                message: "EL TIPO DE CONTACTO ES OBLIGATORIO",
                success:false
            });
            return;
        }else if (!req.body.gcrc_fk_comercial || req.body.gcrc_fk_comercial==0) {
            res.status(400).send({
                message: "EL COMERCIAL ES OBLIGATORIO",
                success:false
            });
            return;
        }else if (!req.body.gcrc_nombres || req.body.gcrc_nombres=='') {
            res.status(400).send({
                message: "EL NOMBRE ES OBLIGATORIO",
                success:false
            });
            return;
        }else if (!req.body.gcrc_apellidos || req.body.gcrc_apellidos=='') {
            res.status(400).send({
                message: "EL APELLIDO ES OBLIGATORIO",
                success:false
            });
            return;
        }else if ( (!req.body.gcrc_email || req.body.gcrc_email=='') && (!req.body.gcrc_telefono1 || req.body.gcrc_telefono1=='') && (!req.body.gcrc_telefono2 || req.body.gcrc_telefono2=='') ) {
            res.status(400).send({
                message: "DEBE INGRESAR UN EMAIL, O TELEFONO PRINCIPAL, O TELEFONO SECUNDARIO",
                success:false
            });
            return;
        }else if ( !req.body.gcrc_texto || req.body.gcrc_texto=='' ) {
            res.status(400).send({
                message: "EL COMENTARIO ES OBLIGATORIO",
                success:false
            });
            return;
        }
        function formatear_numero(Numero)
        {
            Numero = Numero.toString().replace(/\./g,'');
            Numero = Numero.toString().replace(/\,/g,'.');
            return Numero;
        }
        if(!req.body.gcpc_volumenEstimado || req.body.gcpc_volumenEstimado.length==0)
        { req.body.gcpc_volumenEstimado = 0; } else {
            req.body.gcpc_volumenEstimado = formatear_numero(req.body.gcpc_volumenEstimado);
        }

        if(!req.body.gcpc_pesoEstimado || req.body.gcpc_pesoEstimado.length==0)
        { req.body.gcpc_pesoEstimado = 0; } else {
            req.body.gcpc_pesoEstimado = formatear_numero(req.body.gcpc_pesoEstimado);
        }

        if(!req.body.gcpc_factor || req.body.gcpc_factor.length==0)
        { req.body.gcpc_factor = 0; } else {
            req.body.gcpc_factor = formatear_numero(req.body.gcpc_factor);
        }

        if(!req.body.gcpc_cmbPeso || req.body.gcpc_cmbPeso.length==0)
        { req.body.gcpc_cmbPeso = 0; } else {
            req.body.gcpc_cmbPeso = formatear_numero(req.body.gcpc_cmbPeso);
        }

        if(!req.body.gcpc_unidadesACobrar || req.body.gcpc_unidadesACobrar.length==0)
        { req.body.gcpc_unidadesACobrar = 0; } else {
            req.body.gcpc_unidadesACobrar = formatear_numero(req.body.gcpc_unidadesACobrar);
        }

        if(!req.body.gcpc_valorUnitarioUsd || req.body.gcpc_valorUnitarioUsd.length==0)
        { req.body.gcpc_valorUnitarioUsd = 0; } else {
            req.body.gcpc_valorUnitarioUsd = formatear_numero(req.body.gcpc_valorUnitarioUsd);
        }

        if(!req.body.gcpc_tarifaUsd || req.body.gcpc_tarifaUsd.length==0)
        { req.body.gcpc_tarifaUsd = 0; } else {
            req.body.gcpc_tarifaUsd = formatear_numero(req.body.gcpc_tarifaUsd);
        }

        let qry_1 = '';

        qry_1 = ` estado=0, `;

        qry_1 += ` fk_responsable=`+req.usuario.id+`, `;

        qry_1 += ` "fechaActualizacion"='`+fecha+`', `;

        qry_1 += ` fk_contacto=`+req.body.gcpc_fk_contacto+`, `;

        qry_1 += ` "nombreCliente"='`+req.body.gcpc_nombreCliente+`', `;

        qry_1 += ` "atencionA"='`+req.body.gcpc_atencionA+`', `;

        qry_1 += ` "fk_tipoDeServicio"=`+req.body.gcpc_fk_tipoDeServicio+`, `;

        qry_1 += ` "tipoDeCarga"='`+req.body.gcpc_tipoDeCarga+`', `;

        qry_1 += ` "volumenEstimado"=`+req.body.gcpc_volumenEstimado+`, `;

        qry_1 += ` "pesoEstimado"=`+req.body.gcpc_pesoEstimado+`, `;

        qry_1 += ` "fk_zonaDespacho"=`+req.body.gcpc_fk_zonaDespacho+`, `;

        qry_1 += ` direccion='`+req.body.gcpc_direccion+`', `;

        qry_1 += ` "fk_formaDePago"=`+req.body.gcpc_fk_formaDePago+`, `;

        qry_1 += ` "fechaValidez"='`+req.body.gcpc_fechaValidez+`', `;

        qry_1 += ` "fk_zonaOrigen"=`+req.body.gcpc_fk_zonaOrigen+`, `;

        qry_1 += ` "fk_zonaAlmacenaje"=`+req.body.gcpc_fk_zonaAlmacenaje+`, `;

        qry_1 += ` "fk_zonaDestino"=`+req.body.gcpc_fk_zonaDestino+`, `;

        qry_1 += ` factor=`+req.body.gcpc_factor+`, `;

        qry_1 += ` "cmbPeso"=`+req.body.gcpc_cmbPeso+`, `;

        qry_1 += ` "unidadesACobrar"=`+req.body.gcpc_unidadesACobrar+`, `;

        qry_1 += ` "valorUnitarioUsd"=`+req.body.gcpc_valorUnitarioUsd+`, `;

        qry_1 += ` "tarifaUsd"=`+req.body.gcpc_tarifaUsd+` `;

        try {

            await client.query(`UPDATE public.gc_propuestas_cabeceras SET `+qry_1+` WHERE id=`+req.body.gcpc_id+` `);

            let UltimoId = await client.query(`
            SELECT
            id
            , coalesce("nombreCliente",'') as nombreCliente
            , coalesce("atencionA",'') as atencionA
            , coalesce("fk_tipoDeServicio",0) as fk_tipoDeServicio
            , coalesce("tipoDeCarga",'') as tipoDeCarga

            , CASE WHEN "volumenEstimado"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("volumenEstimado",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("volumenEstimado",'FM999,999,999.99')::text,'.',2))
            ELSE "volumenEstimado"::TEXT END as volumenEstimado

            , CASE WHEN "pesoEstimado"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("pesoEstimado",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("pesoEstimado",'FM999,999,999.99')::text,'.',2))
            ELSE "pesoEstimado"::TEXT END as pesoEstimado

            , coalesce("fk_zonaDespacho",0) as fk_zonaDespacho
            , coalesce(direccion,'') as direccion
            , coalesce("fk_formaDePago",0) as fk_formaDePago
            , coalesce("fechaValidez",'') as fechaValidez
            , coalesce("fk_zonaOrigen",0) as fk_zonaOrigen
            , coalesce("fk_zonaAlmacenaje",0) as fk_zonaAlmacenaje
            , coalesce("fk_zonaDestino",0) as fk_zonaDestino

            , CASE WHEN factor::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR(factor,'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(factor,'FM999,999,999.99')::text,'.',2))
            ELSE factor::TEXT END as factor

            , CASE WHEN "cmbPeso"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("cmbPeso",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("cmbPeso",'FM999,999,999.99')::text,'.',2))
            ELSE "cmbPeso"::TEXT END as cmbPeso

            , CASE WHEN "unidadesACobrar"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("unidadesACobrar",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("unidadesACobrar",'FM999,999,999.99')::text,'.',2))
            ELSE "unidadesACobrar"::TEXT END as unidadesACobrar

            , CASE WHEN "valorUnitarioUsd"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("valorUnitarioUsd",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("valorUnitarioUsd",'FM999,999,999.99')::text,'.',2))
            ELSE "valorUnitarioUsd"::TEXT END as valorUnitarioUsd

            , CASE WHEN "tarifaUsd"::TEXT LIKE '%.%' THEN
            CONCAT(REPLACE(Split_part(TO_CHAR("tarifaUsd",'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR("tarifaUsd",'FM999,999,999.99')::text,'.',2))
            ELSE "tarifaUsd"::TEXT END as tarifaUsd
            FROM public.gc_propuestas_cabeceras WHERE id=`+req.body.gcpc_id+` `);

            res.status(200).send(UltimoId.rows[0]);

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL ACTUALIZAR INFORMACIÓN "+error,
                success:false,
            });

        }
    }
    /************************************************************/
    /************************************************************/
    exports.createSerAd = async (req, res) => { try {
        var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

        if (!req.body.gcpcserad_fk_cabecera || req.body.gcpcserad_fk_cabecera==0) {
            res.status(400).send({
                message: "NO SE DETECTO UNA PROPUESTA CREADA PARA ASIGNAR SERVICIOS ADICIONALES",
                success:false
            }); res.end(); res.connection.destroy();
            return;
        } else if (!req.body.gcpcserad_fk_tipoServicio || req.body.gcpcserad_fk_tipoServicio==0) {
            res.status(400).send({
                message: "EL TIPO DE SERVICIO ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
            return;
        } else if (!req.body.gcpcserad_fk_zonaOrigen || req.body.gcpcserad_fk_zonaOrigen==0) {
            res.status(400).send({
                message: "EL ORIGEN ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
            return;
        } else if (!req.body.gcpcserad_fk_zonaDestino || req.body.gcpcserad_fk_zonaDestino==0) {
            res.status(400).send({
                message: "EL DESTINO ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
            return;
        } else if (!req.body.gcpcserad_tarifa || req.body.gcpcserad_tarifa==0) {
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
          if(!req.body.gcpcserad_tarifa || req.body.gcpcserad_tarifa.length==0)
          { req.body.gcpcserad_tarifa = 0; } else {
              req.body.gcpcserad_tarifa = formatear_numero(req.body.gcpcserad_tarifa);
          }

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
          qry_2 += ` `+req.body.gcpcserad_fk_cabecera+`, `;

          qry_1 += ` "fk_tipoDeServicio", `;
          qry_2 += ` `+req.body.gcpcserad_fk_tipoServicio+`, `;

          qry_1 += ` "fk_zonaOrigen", `;
          qry_2 += ` `+req.body.gcpcserad_fk_zonaOrigen+`, `;

          qry_1 += ` "fk_zonaDestino", `;
          qry_2 += ` `+req.body.gcpcserad_fk_zonaDestino+`, `;

          qry_1 += ` tarifa `;
          qry_2 += ` `+req.body.gcpcserad_tarifa+` `;

          try {

              await client.query(`INSERT INTO public.gc_propuestas_servicios_adicionales (`+qry_1+`) values (`+qry_2+`)`);

              let UltimoId = await client.query(`
              SELECT
              id
              , fk_responsable
              , "fechaCreacion"
              , "fechaActualizacion"
              , "fechaActualizacion"
              , fk_cabecera
              , "fk_tipoDeServicio"
              , "fk_zonaOrigen"
              , "fk_zonaDestino"

              , CASE WHEN tarifa::TEXT LIKE '%.%' THEN
              CONCAT(REPLACE(Split_part(TO_CHAR(tarifa,'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(tarifa,'FM999,999,999.99')::text,'.',2))
              ELSE tarifa::TEXT END as tarifa

              FROM public.gc_propuestas_servicios_adicionales WHERE fk_responsable=`+req.usuario.id+` ORDER BY id DESC LIMIT 1`);

              res.status(200).send(UltimoId.rows[0]);
              res.end(); res.connection.destroy();

          } catch (error) {

              res.status(400).send({
                  message: "ERROR AL GUARDAR INFORMACIÓN "+error,
                  success:false,
              }); res.end(); res.connection.destroy();

          }

        }
    } catch (error) { res.status(400).send({ message: "ERROR GENERAR AL GUARDAR SERVICIO ADICIONAL "+error, success:false, }); res.end(); res.connection.destroy(); }}
    /************************************************************/
    /************************************************************/
    exports.SerAdList = async (req,res) =>{

        try {

            let Servicios_Adicionales = await client.query(`
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

              WHERE SERAD.estado!=999 AND SERAD.fk_cabecera=`+parseInt(Object.values(req.params))+` order by SERAD.id desc`);

            res.status(200).send(Servicios_Adicionales.rows[0]);

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL CARGAR LISTADO DE SERVICIOS ADICIONALES "+error,
                success:false,
            });

        }
    };
    /************************************************************/
    /************************************************************/
    exports.Delete = async (req,res) =>{
        try {

            await client.query(`UPDATE public.gc_propuestas_cabeceras SET estado=999 WHERE id=`+parseInt(Object.values(req.params)));

            res.status(200).send("OK");

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL CARGAR LISTADO DE SERVICIOS ADICIONALES "+error,
                success:false,
            });

        }
    };
    /************************************************************/
    /************************************************************/



    exports.findByPdfSerAd = (req, res) => {
      client.query(`
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
          where tar.estado=0 and tar.fk_cabecera = $1
          `, [req.params.id], function (err, result) {
          if (err) {
              console.log(err);
              res.status(400).send(err);
          }
          res.status(200).send(result.rows);
      });
    };

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
              console.log(err);
              res.status(400).send(err);
          }
          res.status(200).send(result.rows);
      });
    };

    exports.findByPdfCabecera = (req, res) => {
      client.query(`
          Select
          cabe."volumenEstimado"
          , TO_CHAR(cabe."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
          , TO_CHAR(cabe."fechaActualizacion", 'DD-MM-YYYY HH24:MI') as actualizacion
          , cabe."tipoDeCarga"
          , cabe.servicio
          , cabe."pesoEstimado"
          , cabe.id
          , cabe.fk_contacto
          , cabe.estado
          , cabe."nombreCliente"
          , cabe."atencionA"
          , CASE WHEN cabe.estado = 0 THEN 'DESARROLLO'
          WHEN cabe.estado = 1 THEN 'APROBADA'
          WHEN cabe.estado = 2 THEN 'ELIMINADA'
          else 'INDEFINIDO' end as estado_nombre
          , cabe."direccionDespacho"
          FROM public.gc_propuestas_cabeceras as cabe
          where cabe.id = $1`, [req.params.id], function (err, result) {
          if (err) {
              console.log(err);
              res.status(400).send(err);
          }
          res.status(200).send(result.rows);
      });
    };

    exports.findByContacto = (req, res) => {

      client.query(`
        Select
        cabe."volumenEstimado"
        , TO_CHAR(cabe."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
        , TO_CHAR(cabe."fechaActualizacion", 'DD-MM-YYYY HH24:MI') as actualizacion
        , cabe."tipoDeCarga"
        , cabe.servicio
        , cabe."pesoEstimado"
        , cabe.id
        , cabe.fk_contacto
        , cabe.estado
        , cabe."nombreCliente"
        , cabe."atencionA"
        , CASE WHEN cabe.estado = 0 THEN 'DESARROLLO'
        WHEN cabe.estado = 1 THEN 'APROBADA'
        WHEN cabe.estado = 2 THEN 'ELIMINADA'
        else 'INDEFINIDO' end as estado_nombre
        , cabe."direccionDespacho"
        FROM public.gc_propuestas_cabeceras as cabe
        where
        fk_contacto = $1 and (estado=0 or estado=1)
        order by cabe.id desc
        `, [parseInt(Object.values(req.params))], function (err, result) {
          if (err) {
              console.log(err);
              res.status(400).send(err);
          }
          res.status(200).send(result.rows);
      });
    };

    exports.list = (req, res) => {
    client.query(`
      Select
      cabe."volumenEstimado"
      , TO_CHAR(cabe."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
      , TO_CHAR(cabe."fechaActualizacion", 'DD-MM-YYYY HH24:MI') as actualizacion
      , cabe."tipoDeCarga"
      , cabe.servicio
      , cabe."pesoEstimado"
      , cabe.id
      , cabe.fk_contacto
      , cabe.estado
      , cabe."nombreCliente"
      , cabe."atencionA"
      , CASE WHEN cabe.estado = 0 THEN 'DESARROLLO'
      WHEN cabe.estado = 1 THEN 'APROBADA'
      WHEN cabe.estado = 2 THEN 'ELIMINADA'
      else 'INDEFINIDO' end as estado_nombre
      , cabe."direccionDespacho"
      FROM public.gc_propuestas_cabeceras as cabe
      where cabe.estado=0 or cabe.estado=1
      order by cabe.id desc
    `, "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    };

    exports.findOneBy = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "EL ID ES OBLIGATORIO",
            success:false
        });
        return;
    }
    client.query('SELECT * FROM public.gc_propuestas_cabeceras where id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    };



    exports.Aprobar = (req, res) => {
        var moment = require('moment');

        if (!req.params.id) {
            res.status(400).send({
                message: "DEBE INGRESAR UN ID VALIDO",
                success:false
            });
            return;
        }

        let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

        const query = {
            text: 'UPDATE public.gc_propuestas_cabeceras SET estado=1, "fechaActualizacion"=$1 where id=$2 RETURNING *',
            values: [fecha, req.params.id],
        };

        client.query(query,"",function (err, result)
        {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows[0]);
        });
    }

    /************************************************************/
    /************************************************************/
    exports.createTarifa = async (req, res) => {
        var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

        if (!req.body.gcpcserad_fk_cabecera || req.body.gcpcserad_fk_cabecera<=0) {
            res.status(400).send({
                message: "NO SE DETECTO UNA CABECERA",
                success:false
            });
            return;
        }else if (!req.body.gcpcserad_fk_tipoServicio || req.body.gcpcserad_fk_tipoServicio==0) {
            res.status(400).send({
                message: "EL TIPO DE SERVICIO ES OBLIGATORIO",
                success:false
            });
            return;
        }else if (!req.body.gcpcserad_fk_zonaOrigen || req.body.gcpcserad_fk_zonaOrigen==0) {
            res.status(400).send({
                message: "EL ORIGEN ES OBLIGATORIO",
                success:false
            });
            return;
        }else if (!req.body.gcpcserad_fk_zonaDestino || req.body.gcpcserad_fk_zonaDestino==0) {
            res.status(400).send({
                message: "EL DESTINO ES OBLIATORIO",
                success:false
            });
            return;
        }else if (!req.body.gcpcserad_tarifa || req.body.gcpcserad_tarifa<=0) {
            res.status(400).send({
                message: "LA TARIFA ES OBLIGATORIA",
                success:false
            });
            return;
        };

        function formatear_numero(Numero)
        {
            Numero = Numero.toString().replace(/\./g,'');
            Numero = Numero.toString().replace(/\,/g,'.');
            return Numero;
        }
        if(!req.body.gcpcserad_tarifa || req.body.gcpcserad_tarifa.length==0)
        { req.body.gcpcserad_tarifa = 0; } else {
            req.body.gcpcserad_tarifa = formatear_numero(req.body.gcpcserad_tarifa);
        }

        let qry_1 = '';     let qry_2 = '';

        qry_1 = ` estado, `;
        qry_2 = ` 0, `;

        qry_1 += ` fk_responsable, `;
        qry_2 += ` `+req.usuario.id+`, `;

        qry_1 += ` "fechaCreacion", `;
        qry_2 += ` '`+fecha+`', `;

        qry_1 += ` "fechaActualizacion", `;
        qry_2 += ` '`+fecha+`', `;

        qry_1 += ` fk_contacto, `;
        qry_2 += ` `+req.body.gcpc_fk_contacto+`, `;

        qry_1 += ` "nombreCliente", `;
        qry_2 += ` '`+req.body.gcpc_nombreCliente+`', `;

        qry_1 += ` "atencionA", `;
        qry_2 += ` '`+req.body.gcpc_atencionA+`', `;

        qry_1 += ` "fk_tipoDeServicio", `;
        qry_2 += ` `+req.body.gcpc_fk_tipoDeServicio+`, `;

        qry_1 += ` "tipoDeCarga", `;
        qry_2 += ` '`+req.body.gcpc_tipoDeCarga+`', `;

        qry_1 += ` "volumenEstimado", `;
        qry_2 += ` `+req.body.gcpc_volumenEstimado+`, `;

        qry_1 += ` "pesoEstimado", `;
        qry_2 += ` `+req.body.gcpc_pesoEstimado+`, `;

        qry_1 += ` "fk_zonaDespacho", `;
        qry_2 += ` `+req.body.gcpc_fk_zonaDespacho+`, `;

        qry_1 += ` direccion, `;
        qry_2 += ` '`+req.body.gcpc_direccion+`', `;

        qry_1 += ` "fk_formaDePago", `;
        qry_2 += ` `+req.body.gcpc_fk_formaDePago+`, `;

        qry_1 += ` "fechaValidez", `;
        qry_2 += ` '`+req.body.gcpc_fechaValidez+`', `;

        qry_1 += ` "fk_zonaOrigen", `;
        qry_2 += ` `+req.body.gcpc_fk_zonaOrigen+`, `;

        qry_1 += ` "fk_zonaAlmacenaje", `;
        qry_2 += ` `+req.body.gcpc_fk_zonaAlmacenaje+`, `;

        qry_1 += ` "fk_zonaDestino", `;
        qry_2 += ` `+req.body.gcpc_fk_zonaDestino+`, `;

        qry_1 += ` factor, `;
        qry_2 += ` `+req.body.gcpc_factor+`, `;

        qry_1 += ` "cmbPeso", `;
        qry_2 += ` `+req.body.gcpc_cmbPeso+`, `;

        qry_1 += ` "unidadesACobrar", `;
        qry_2 += ` `+req.body.gcpc_unidadesACobrar+`, `;

        qry_1 += ` "valorUnitarioUsd", `;
        qry_2 += ` `+req.body.gcpc_valorUnitarioUsd+`, `;

        qry_1 += ` "tarifaUsd" `;
        qry_2 += ` `+req.body.gcpc_tarifaUsd+` `;

        try {

            await client.query(`INSERT INTO public.gc_propuestas_cabeceras (`+qry_1+`) values (`+qry_2+`)`);

            let UltimoId = await client.query(`SELECT
            id
            , coalesce("nombreCliente",'') as nombreCliente
            , coalesce("atencionA",'') as atencionA
            , coalesce("fk_tipoDeServicio",0) as fk_tipoDeServicio
            , coalesce("tipoDeCarga",'') as tipoDeCarga
            , coalesce("volumenEstimado",0) as volumenEstimado
            , coalesce("pesoEstimado",0) as pesoEstimado
            , coalesce("fk_zonaDespacho",0) as fk_zonaDespacho
            , coalesce(direccion,'') as direccion
            , coalesce("fk_formaDePago",0) as fk_formaDePago
            , coalesce("fechaValidez",'') as fechaValidez
            , coalesce("fk_zonaOrigen",0) as fk_zonaOrigen
            , coalesce("fk_zonaAlmacenaje",0) as fk_zonaAlmacenaje
            , coalesce("fk_zonaDestino",0) as fk_zonaDestino
            , coalesce(factor,0) as factor
            , coalesce("cmbPeso",0) as cmbPeso
            , coalesce("unidadesACobrar",0) as unidadesACobrar
            , coalesce("valorUnitarioUsd",0) as valorUnitarioUsd
            , coalesce("tarifaUsd",0) as tarifaUsd
            FROM public.gc_propuestas_cabeceras WHERE fk_responsable=`+req.usuario.id+` ORDER BY id DESC LIMIT 1`);

            res.status(200).send(UltimoId.rows[0]);

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL GUARDAR INFORMACIÓN "+error,
                success:false,
            });

        }
    }
    /************************************************************/
    /************************************************************/

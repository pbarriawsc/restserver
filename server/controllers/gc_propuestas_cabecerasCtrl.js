const client = require('../config/db.client');
const jwt=require('jsonwebtoken');

    /************************************************************/
    /************************************************************/
    exports.ListServiciosTipos = (req, res) => {
        client.query(` SELECT id, nombre FROM public.servicios_tipos where estado is true order by nombre asc`, "", function (err, result) {
        if (err) { console.log(err); res.status(400).send(err); } res.status(200).send(result.rows); res.end(); res.connection.destroy(); });
    };
    /************************************************************/
    /************************************************************/
    exports.ListZonasTarifarias = (req, res) => {
        client.query(` SELECT id, nombre FROM public.zonas_tarifarias where estado is true order by nombre asc`, "", function (err, result) {
        if (err) { console.log(err); res.status(400).send(err); } res.status(200).send(result.rows); res.end(); res.connection.destroy(); });
    };
    /************************************************************/
    /************************************************************/
    exports.ListFormasPago = (req, res) => {
        client.query(` SELECT id, nombre FROM public.formas_pago order by nombre asc`, "", function (err, result) {
        if (err) { console.log(err); res.status(400).send(err); } res.status(200).send(result.rows); res.end(); res.connection.destroy(); });
    };
    /************************************************************/
    /************************************************************/
    exports.ListClientes = (req, res) => {
        client.query(` SELECT * FROM public.clientes order by nombre asc`, "", function (err, result) {
        if (err) { console.log(err); res.status(400).send(err); } res.status(200).send(result.rows); res.end(); res.connection.destroy(); });
    };
    /************************************************************/
    /************************************************************/
    exports.ListProveedores = async (req, res) => {
        try {
            let Lista = await client.query(` SELECT * FROM public.proveedores where fk_cliente=`+parseInt(Object.values(req.params.id))+` order by nombre asc`);
            res.status(200).send(Lista.rows);
            res.end(); res.connection.destroy();

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL CARGAR PROVEEDORES "+error,
                success:false,
            });
            res.end(); res.connection.destroy();
        }

    };
    /************************************************************/
    /************************************************************/
    exports.listDirecciones = (req, res) => {

        client.query(`
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
            where dir.fk_cliente=$1`, [req.params.id], function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                }
                res.status(200).send(result.rows);
        });
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
        if(req.body.gcpc_fk_cliente==0) { req.body.gcpc_fk_cliente = null; }
        if(req.body.gcpc_fk_direccion==0) { req.body.gcpc_fk_direccion = null; }
        if(!req.body.gcpc_cantProveedores || req.body.gcpc_cantProveedores.length==0) { req.body.gcpc_cantProveedores = 0; }

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

        qry_1 += ` "nombreCliente", `;
        qry_2 += ` '`+req.body.gcpc_nombreCliente+`', `;

        qry_1 += ` "atencionA", `;
        qry_2 += ` '`+req.body.gcpc_atencionA+`', `;

        qry_1 += ` "fk_tipoDeServicio", `;
        qry_2 += ` `+req.body.gcpc_fk_tipoDeServicio+`, `;

        qry_1 += ` "cantProveedores", `;
        qry_2 += ` `+req.body.gcpc_cantProveedores+`, `

        qry_1 += ` fk_cliente, `;
        qry_2 += ` `+req.body.gcpc_fk_cliente+`, `;

        qry_1 += ` fk_direccion, `;
        qry_2 += ` `+req.body.gcpc_fk_direccion+`, `;

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
            , fk_cliente
            , fk_direccion
            , "cantProveedores" as cantproveedores

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
            res.end(); res.connection.destroy();

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL GUARDAR INFORMACIÓN "+error,
                success:false,
            });
            res.end(); res.connection.destroy();

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
            , fk_cliente
            , fk_direccion
            , "cantProveedores" as cantproveedores
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
            FROM public.gc_propuestas_cabeceras WHERE estado=0 AND id=`+parseInt(Object.values(req.params))+` LIMIT 1`);

            res.status(200).send(Propuesta_Desarrollo.rows[0]);
            res.end(); res.connection.destroy();

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL GUARDAR INFORMACIÓN "+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }

    };
    /************************************************************/
    /************************************************************/
    exports.GetList = async (req,res) =>{

        let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

        try {

            var condicion = ` `;

            if(parseInt(Object.values(req.params))!=1)
            {
                var condicion = ` and id=-1 `;
            }

            if(req.usuario.fk_rol==2)
            {
                var innerJoin = ` `;
            }

            let Propuesta_Desarrollo = await client.query(`
            SELECT
            id
            , TO_CHAR("fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
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
            FROM public.gc_propuestas_cabeceras as cabe
            WHERE
            estado=0
            `+condicion+`
            `);

            res.status(200).send(Propuesta_Desarrollo.rows);
            res.end(); res.connection.destroy();

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL GUARDAR INFORMACIÓN "+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }

    };
    /************************************************************/
    /************************************************************/
    exports.update = async (req, res) => {
        var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

        if(req.body.gcpc_fk_tipoDeServicio==0) { req.body.gcpc_fk_tipoDeServicio = null; }
        if(req.body.gcpc_fk_zonaDespacho==0) { req.body.gcpc_fk_zonaDespacho = null; }
        if(req.body.gcpc_fk_formaDePago==0) { req.body.gcpc_fk_formaDePago = null; }
        if(req.body.gcpc_fk_zonaOrigen==0) { req.body.gcpc_fk_zonaOrigen = null; }
        if(req.body.gcpc_fk_zonaAlmacenaje==0) { req.body.gcpc_fk_zonaAlmacenaje = null; }
        if(req.body.gcpc_fk_zonaDestino==0) { req.body.gcpc_fk_zonaDestino = null; }
        if(req.body.gcpc_fk_zonaDestino==0) { req.body.gcpc_fk_zonaDestino = null; }
        if(req.body.gcpc_fk_cliente==0) { req.body.gcpc_fk_cliente = null; }
        if(req.body.gcpc_fk_direccion==0) { req.body.gcpc_fk_direccion = null; }
        if(!req.body.gcpc_cantProveedores || req.body.gcpc_cantProveedores.length==0) { req.body.gcpc_cantProveedores = 0; }

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

        qry_1 += ` "nombreCliente"='`+req.body.gcpc_nombreCliente+`', `;

        qry_1 += ` "atencionA"='`+req.body.gcpc_atencionA+`', `;

        qry_1 += ` "fk_tipoDeServicio"=`+req.body.gcpc_fk_tipoDeServicio+`, `;

        qry_1 += ` fk_cliente=`+req.body.gcpc_fk_cliente+`, `;

        qry_1 += ` fk_direccion=`+req.body.gcpc_fk_direccion+`, `;

        qry_1 += ` "cantProveedores"=`+req.body.gcpc_cantProveedores+`, `;

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
            , fk_cliente
            , fk_direccion
            , "cantProveedores" as cantproveedores

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
            res.end(); res.connection.destroy();

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL ACTUALIZAR INFORMACIÓN "+error,
                success:false,
            });
            res.end(); res.connection.destroy();
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

              WHERE SERAD.estado!=999 AND SERAD.fk_cabecera=`+req.body.gcpcserad_fk_cabecera+` order by SERAD.id desc`);

              res.status(200).send(Servicios_Adicionales.rows);
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
    exports.createProv = async (req, res) => { try {
        var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

        if (!req.body.gcpcprov_fk_cabecera || req.body.gcpcprov_fk_cabecera==0) {
            res.status(400).send({
                message: "NO SE DETECTO UNA PROPUESTA CREADA PARA ASIGNAR SERVICIOS ADICIONALES",
                success:false
            }); res.end(); res.connection.destroy();
            return;
        } else if (!req.body.gcpcprov_fk_proveedor || req.body.gcpcprov_fk_proveedor==0) {
            res.status(400).send({
                message: "EL PROVEEDOR ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
            return;
        } else if (!req.body.gcpcprov_peso ) {
            res.status(400).send({
                message: "EL PESO ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
            return;
        } else if (!req.body.gcpcprov_bultos ) {
            res.status(400).send({
                message: "LOS BULTOS SON OBLIGATORIOS",
                success:false
            }); res.end(); res.connection.destroy();
            return;
        } else if (!req.body.gcpcprov_volumen ) {
            res.status(400).send({
                message: "EL VOLUMEN ES OBLIGATORIO",
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

        if(!req.body.gcpcprov_volumen || req.body.gcpcprov_volumen.length==0)
        { req.body.gcpcprov_volumen = 0; } else {
            req.body.gcpcprov_volumen = formatear_numero(req.body.gcpcprov_volumen);
        }

        if(!req.body.gcpcprov_peso || req.body.gcpcprov_peso.length==0)
        { req.body.gcpcprov_peso = 0; } else {
            req.body.gcpcprov_peso = formatear_numero(req.body.gcpcprov_peso);
        }

        if(!req.body.gcpcprov_bultos || req.body.gcpcprov_bultos.length==0)
        { req.body.gcpcprov_bultos = 0; } else {
            req.body.gcpcprov_bultos = formatear_numero(req.body.gcpcprov_bultos);
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
        qry_2 += ` `+req.body.gcpcprov_fk_cabecera+`, `;

        qry_1 += ` fk_proveedor, `;
        qry_2 += ` `+req.body.gcpcprov_fk_proveedor+`, `;

        qry_1 += ` volumen, `;
        qry_2 += ` `+req.body.gcpcprov_volumen+`, `;

        qry_1 += ` peso, `;
        qry_2 += ` `+req.body.gcpcprov_peso+`, `;

        qry_1 += ` bultos `;
        qry_2 += ` `+req.body.gcpcprov_bultos+` `;

          try {

              let existe = await client.query(`
              SELECT
              prov.id
              , prov.estado
              , prov.fk_responsable
              , TO_CHAR(prov."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
              , prov.fk_cabecera
              , prov.fk_proveedor
              , prove.nombre
              , prov.volumen
              , prov.bultos
              , peso
              FROM public.gc_propuestas_proveedores as prov
              INNER JOIN public.proveedores as prove on prov.fk_proveedor=prove.id
              WHERE
              prov.estado!=999
              and prov.fk_proveedor=`+req.body.gcpcprov_fk_proveedor+`
              and prov.fk_cabecera=`+req.body.gcpcprov_fk_cabecera+` order by prov.id desc`);

              if(existe.rows.length>0) {
                res.status(400).send({
                    message: "EL PROVEEDOR YA ESTA INGRESADO",
                    success:false
                }); res.end(); res.connection.destroy();
              } else {
                await client.query(`INSERT INTO public.gc_propuestas_proveedores (`+qry_1+`) values (`+qry_2+`)`);

                var Propuesta = await client.query(`
                SELECT
                *
                FROM public.gc_propuestas_cabeceras
                WHERE
                id=`+req.body.gcpcprov_fk_cabecera+`
                `);

                qry_1 = ` fecha_creacion, `;
                qry_2 = ` '`+fecha+`', `;

                qry_1 += ` fecha_recepcion, `;
                qry_2 += ` null, `;

                qry_1 += ` fk_propuesta, `;
                qry_2 += ` `+Propuesta.rows[0]['id']+`, `;

                qry_1 += ` cantidad_bultos, `;
                qry_2 += ` `+req.body.gcpcprov_bultos+`, `;

                qry_1 += ` peso, `;
                qry_2 += ` `+req.body.gcpcprov_peso+`, `;

                qry_1 += ` volumen, `;
                qry_2 += ` `+req.body.gcpcprov_volumen+`, `;

                qry_1 += ` tipo_carga, `;
                qry_2 += ` 1, `;

                qry_1 += ` fk_proveedor, `;
                qry_2 += ` `+req.body.gcpcprov_fk_proveedor+`, `;

                qry_1 += ` fk_cliente, `;
                qry_2 += ` `+Propuesta.rows[0]['fk_cliente']+`, `;

                qry_1 += ` tipo, `;
                qry_2 += ` 2, `;

                qry_1 += ` estado, `;
                qry_2 += ` 0, `;

                qry_1 += ` foto1, `;
                qry_2 += ` null, `;

                qry_1 += ` foto2, `;
                qry_2 += ` null, `;

                qry_1 += ` foto3 `;
                qry_2 += ` null `;

                await client.query(` INSERT INTO tracking (`+qry_1+`) VALUES (`+qry_2+`) `);

                let Proveedores = await client.query(`
                  SELECT
                  prov.id
                  , prov.estado
                  , prov.fk_responsable
                  , TO_CHAR(prov."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
                  , prov.fk_cabecera
                  , prov.fk_proveedor
                  , prove.nombre
                  , prov.volumen
                  , prov.bultos
                  , peso
                  FROM public.gc_propuestas_proveedores as prov
                  INNER JOIN public.proveedores as prove on prov.fk_proveedor=prove.id
                  WHERE
                  prov.estado=0
                  and prov.fk_cabecera=`+req.body.gcpcprov_fk_cabecera+` order by prov.id desc`);

                res.status(200).send(Proveedores.rows);
                res.end(); res.connection.destroy();
              }

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

        res.status(200).send(Servicios_Adicionales.rows);

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL CARGAR LISTADO DE SERVICIOS ADICIONALES "+error,
                success:false,
            });
            res.end(); res.connection.destroy();
        }
    };
    /************************************************************/
    /************************************************************/
    exports.ListProv = async (req,res) =>{

        try {

        let Proveedores = await client.query(`
        SELECT
        prov.id
        , prov.estado
        , prov.fk_responsable
        , TO_CHAR(prov."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
        , prov.fk_cabecera
        , prov.fk_proveedor
        , prove.nombre
        , prov.volumen
        , prov.bultos
        , peso
        FROM public.gc_propuestas_proveedores as prov
        INNER JOIN public.proveedores as prove on prov.fk_proveedor=prove.id
        WHERE
        prov.estado=0 and prov.fk_cabecera=`+parseInt(Object.values(req.params))+` order by prov.id desc`);

        res.status(200).send(Proveedores.rows);

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL CARGAR LISTADO DE PROVEEDORES "+error,
                success:false,
            });
            res.end(); res.connection.destroy();
        }
    };

    /************************************************************/
    /************************************************************/
    exports.ProComDelete = async (req,res) =>{
        try {

            await client.query(`UPDATE public.gc_propuestas_cabeceras SET estado=999 WHERE id=`+parseInt(Object.values(req.params)));

            res.status(200).send("OK");

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL ELIMINAR PROPUESTA "+error,
                success:false,
            });

        }
    };
    /************************************************************/
    /************************************************************/
    exports.ProvDelete = async (req,res) =>{
        try {

            await client.query(`UPDATE public.gc_propuestas_proveedores SET estado=999 WHERE id=`+parseInt(Object.values(req.params)));

            res.status(200).send("OK");

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL ELIMINAR PROVEEDOR "+error,
                success:false,
            });

        }
    };

    /************************************************************/
    /************************************************************/
    exports.SerAdDelete = async (req,res) =>{
        try {

            await client.query(`UPDATE public.gc_propuestas_servicios_adicionales SET estado=999 WHERE id=`+parseInt(Object.values(req.params)));

            res.status(200).send("OK");

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL ELIMINAR SERVICIOS ADICIONALES "+error,
                success:false,
            });

        }
    };
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
    exports.findByPdfCabecera = async (req,res) =>{

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
        , coalesce(cabe."fechaValidez",'') as fechaValidez
        , coalesce(cabe."fk_zonaOrigen",0) as fk_zonaOrigen
        , coalesce(cabe."fk_zonaAlmacenaje",0) as fk_zonaAlmacenaje
        , coalesce(cabe."fk_zonaDestino",0) as fk_zonaDestino

        , CASE WHEN cabe.factor::TEXT LIKE '%.%' THEN
        CONCAT(REPLACE(Split_part(TO_CHAR(cabe.factor,'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(cabe.factor,'FM999,999,999.99')::text,'.',2))
        ELSE cabe.factor::TEXT END as factor

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
        WHERE cabe.id=`+parseInt(Object.values(req.params))+` limit 1`);

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
    exports.findByPdfSerAd = async (req,res) =>{

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
        where tar.estado=0 and tar.fk_cabecera=`+parseInt(Object.values(req.params))+` order by SERAD.id desc`);

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
      , cabe.fk_cliente
      , cabe."tipoDeCarga"
      , cabe.servicio
      , cabe."pesoEstimado"
      , cabe.id
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
    exports.ProAprobar = async (req,res) =>{
        var moment = require('moment');

        let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

        var Propuesta = await client.query(`
        SELECT
        *
        FROM public.gc_propuestas_cabeceras
        WHERE
        id=`+parseInt(Object.values(req.params))+`
        `);

        var FaltaInfo = await client.query(`
        SELECT
        *
  	    FROM public.gc_propuestas_cabeceras
        WHERE
        id=`+parseInt(Object.values(req.params))+`
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
          or LENGTH(TRIM("fechaValidez"))=0
          or "fk_zonaOrigen" is null or "fk_zonaOrigen"=0
          or "fk_zonaAlmacenaje" is null or "fk_zonaAlmacenaje"=0
          or "fk_zonaDestino" is null or "fk_zonaDestino"=0
          or factor is null or factor=0
          or "cmbPeso" is null or "cmbPeso"=0
          or "unidadesACobrar" is null or "unidadesACobrar"=0
          or "valorUnitarioUsd" is null or "valorUnitarioUsd"=0
          or "tarifaUsd" is null or "tarifaUsd"=0
        )
        `);

        var Proveedores = await client.query(`
        SELECT
        *
        FROM public.gc_propuestas_proveedores
        WHERE estado=0 and fk_cabecera=`+parseInt(Object.values(req.params))+`
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
            if(Proveedores.rows.length<=0)
            {
                var qry_1 = ` fecha_creacion, `;
                var qry_2 = ` '`+fecha+`', `;

                qry_1 += ` fecha_recepcion, `;
                qry_2 += ` null, `;

                qry_1 += ` fk_propuesta, `;
                qry_2 += ` `+Propuesta.rows[0]['id']+`, `;

                qry_1 += ` cantidad_bultos, `;
                qry_2 += ` 0, `;

                qry_1 += ` cantidad_bultos, `;
                qry_2 += ` `+Proveedores.rows[i]['bultos']+`, `;

                qry_1 += ` peso, `;
                qry_2 += ` `+Proveedores.rows[i]['peso']+`, `;

                qry_1 += ` volumen, `;
                qry_2 += ` `+Proveedores.rows[i]['volumen']+`, `;

                qry_1 += ` tipo_carga, `;
                qry_2 += ` 1, `;

                qry_1 += ` fk_cliente, `;
                qry_2 += ` `+Propuesta.rows[0]['fk_cliente']+`, `;

                qry_1 += ` tipo, `;
                qry_2 += ` 2, `;

                qry_1 += ` estado, `;
                qry_2 += ` 0, `;

                qry_1 += ` foto1, `;
                qry_2 += ` null, `;

                qry_1 += ` foto2, `;
                qry_2 += ` null, `;

                qry_1 += ` foto3 `;
                qry_2 += ` null `;

                await client.query(` INSERT INTO tracking (`+qry_1+`) VALUES (`+qry_2+`) `);
            }

            await client.query(`UPDATE public.gc_propuestas_cabeceras SET estado=2, "fechaActualizacion"='`+fecha+`' WHERE id=`+parseInt(Object.values(req.params))+` `);
            await client.query(`UPDATE public.gc_propuestas_proveedores SET estado=2, "fechaActualizacion"='`+fecha+`' WHERE fk_cabecera=`+parseInt(Object.values(req.params))+` and estado=0 `);
            res.status(200).send(Propuesta.rows[0]);
        }
    }
    /************************************************************/
    /************************************************************/

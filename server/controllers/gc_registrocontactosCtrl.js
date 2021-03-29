const client = require('../config/db.client');
const jwt=require('jsonwebtoken');

    /************************************************************/
    /************************************************************/
    exports.ListComerciales = (req, res) => {
        client.query(`
        SELECT
        id
        , concat(nombre,' ',apellidos) as nombre_completo
        FROM public.usuario
        where estado is true and fk_rol=2
        `, "", function (err, result) {
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
        var moment = require('moment');

        console.log("1");
        if (!req.body.gcrc_fk_tipo || req.body.gcrc_fk_tipo==0) {
            res.status(400).send({
                message: "EL TIPO DE CONTACTO ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
        }
        else if (!req.body.gcrc_fk_comercial || req.body.gcrc_fk_comercial==0) {
            res.status(400).send({
                message: "EL COMERCIAL ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
        }
        else if (!req.body.gcrc_nombres || req.body.gcrc_nombres.trim().length==0) {
            res.status(400).send({
                message: "EL NOMBRE ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
        }
        else if (!req.body.gcrc_email || req.body.gcrc_email.trim().length==0) {
            res.status(400).send({
                message: "EL EMAIL ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
        }
        else if (!req.body.gcrc_telefono1 || req.body.gcrc_telefono1.trim().length==0) {
            res.status(400).send({
                message: "EL TELEFONO ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.gcrc_texto || req.body.gcrc_texto.trim().length==0) {
            res.status(400).send({
                message: "EL COMENTARIO ES OBLIGATORIO",
                success:false
            }); res.end(); res.connection.destroy();
        }
        else if (req.body.gcrc_email && req.body.gcrc_fk_comercial) {
            console.log("2");
            let token= req.get('Authorization');
            jwt.verify(token, process.env.SECRET, (err,decoded)=>{
            if(err){
                return res.status(401).json({
                    success:false,
                    err
                })
            }
            req.usuario = decoded.usuario;
            });

            var existe = await client.query(` SELECT * FROM public.gc_registrocontactos where email = '`+req.body.gcrc_email+`' and fk_comercial!=`+req.body.gcrc_fk_comercial+` `);

            if(existe.rows.length>0){
                res.status(400).send({
                    message: "EL MAIL ESTÁ ASOCIADO A OTRO COMERCIAL",
                    success:false
                }); res.end(); res.connection.destroy();
            }
            else{

                function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }

                var email = LimpiarTexto(req.body.gcrc_email);
                var nombres = LimpiarTexto(req.body.gcrc_nombres);
                var apellidos = LimpiarTexto(req.body.gcrc_apellidos);
                var telefono1 = LimpiarTexto(req.body.gcrc_telefono1);
                var telefono2 = LimpiarTexto(req.body.gcrc_telefono2);
                var texto = LimpiarTexto(req.body.gcrc_texto);

                let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

                let qry_1 = '';     let qry_2 = '';

                qry_1 = `"fechaCreacion", `;
                qry_2 = `'`+fecha+`', `;

                qry_1 += `"fechaActualizacion", `;
                qry_2 += `'`+fecha+`', `;

                qry_1 += `fk_responsable, `;
                qry_2 += ` `+req.usuario.id+`, `;

                qry_1 += `estado, `;
                qry_2 += ` 0, `;

                qry_1 += `fk_tipo, `;
                qry_2 += ` `+req.body.gcrc_fk_tipo+`, `;

                qry_1 += `fk_comercial, `;
                qry_2 += ` `+req.body.gcrc_fk_comercial+`, `;

                qry_1 += `nombres, `;
                qry_2 += ` '`+nombres+`', `;

                qry_1 += `apellidos, `;
                qry_2 += ` '`+apellidos+`', `;

                qry_1 += `email, `;
                qry_2 += ` '`+req.body.gcrc_email+`', `;

                qry_1 += `telefono1, `;
                qry_2 += ` '`+telefono1+`', `;

                qry_1 += `telefono2, `;
                qry_2 += ` '`+telefono2+`', `;

                qry_1 += `texto `;
                qry_2 += ` '`+texto+`' `;

                try {

                    console.log(`INSERT INTO public.gc_registrocontactos (`+qry_1+`) values (`+qry_2+`)`);
                    await client.query(`INSERT INTO public.gc_registrocontactos (`+qry_1+`) values (`+qry_2+`)`);
                    res.status(200).send([]); res.connection.destroy();

                } catch (error) {

                    res.status(400).send({
                        message: "ERROR AL GUARDAR INFORMACIÓN "+error,
                        success:false
                    }); res.end(); res.connection.destroy();

                }

            }
        }
    }
    /************************************************************/
    /************************************************************/
    exports.list = (req, res) => {

        let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

        var condicion = ` `;

        if(req.usuario.fk_rol==2)
        {
            condicion = ` and contact.fk_responsable=`+req.usuario.id+``;
        }

        client.query(`
          SELECT
          contact.id
          , TO_CHAR(contact."fechaCreacion", 'DD-MM HH24:MI') as creacion
          , TO_CHAR(contact."fechaActualizacion", 'DD-MM-YYYY HH24:MI') as actualizacion
          , contact.fk_tipo
          , ctip.nombre as tipo_nombre
          , contact.fk_comercial
          , concat(usu.nombre,' ',usu.apellidos) as comercial_nombre
          , concat(contact.nombres,' ',contact.apellidos) as nombre_contacto
          , contact.email
          , contact.telefono1
          , contact.telefono2
          , contact.texto
          , case
          when contact.estado=0 then 'EN DESARROLLO'
          when contact.estado=1 then 'APROBADA'
          when contact.estado=999 then 'ELIMINADA'
          else 'EN DESAROLLO' end as estado_nombre
          , count(prop.id) as cant_propuestas
          FROM public.gc_registrocontactos as contact
          inner join public.usuario as usu on contact.fk_comercial=usu.id
          inner join public.gc_contactos_tipos as ctip on ctip.id=contact.fk_tipo
          left join public.gc_propuestas_cabeceras as prop on contact.id=prop.fk_contacto
          where
          contact.estado!=999
          `+condicion+`

          group by
          contact.id
          , TO_CHAR(contact."fechaCreacion", 'DD-MM HH24:MI')
          , TO_CHAR(contact."fechaActualizacion", 'DD-MM-YYYY HH24:MI')
          , contact.fk_tipo
          , ctip.nombre
          , contact.fk_comercial
          , concat(usu.nombre,' ',usu.apellidos)
          , concat(contact.nombres,' ',contact.apellidos)
          , contact.email
          , contact.telefono1
          , contact.telefono2
          , contact.texto
          order by id desc
        `, "", function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    };
    /************************************************************/
    /************************************************************/
    exports.findOneBy = (req,res) =>{
        if (!parseInt(Object.values(req.params))) {
            res.status(400).send({
                message: "EL ID ES OBLIGATORIO",
                success:false
            });
            return;
        }
        client.query('SELECT * FROM public.gc_registrocontactos where id = $1', [parseInt(Object.values(req.params))], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    };
    /************************************************************/
    /************************************************************/
    exports.update = async (req, res) => {
        var moment = require('moment');

        // Validate request
        if (!req.body.gcrc_fk_tipo || req.body.gcrc_fk_tipo==0) {
            res.status(400).send({
                message: "EL TIPO ES OBLIGATORIO",
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
        }else if ( (!req.body.gcrc_email || req.body.gcrc_email=='') && (!req.body.gcrc_telefono1 || req.body.gcrc_telefono1=='') && (!req.body.gcrc_telefono2 || req.body.gcrc_telefono2=='') ) {
            res.status(400).send({
                message: "DEBE INGRESAR UN EMAIL, O TELEFONO PRINCIPAL, O TELEFONO SECUNDARIO",
                success:false
            });
            return;
        }else if ( !req.body.gcrc_texto || req.body.gcrc_texto=='' ) {
            res.status(400).send({
                message: "EL TEXTO ES OBLIGATORIO",
                success:false
            });
            return;
        };

        if (!req.body.gcrc_email) { req.body.gcrc_email = ''; }
        if (!req.body.gcrc_apellidos) { req.body.gcrc_apellidos = ''; }
        if (!req.body.gcrc_telefono1) { req.body.gcrc_telefono1 = ''; }
        if (!req.body.gcrc_telefono2) { req.body.gcrc_telefono2 = ''; }

        if (!req.body.gcrc_email) { req.body.gcrc_email = ''; }
        if (!req.body.gcrc_apellidos) { req.body.gcrc_apellidos = ''; }
        if (!req.body.gcrc_telefono1) { req.body.gcrc_telefono1 = ''; }
        if (!req.body.gcrc_telefono2) { req.body.gcrc_telefono2 = ''; }

        let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

        let qry_1 = '';

        qry_1 = `"fechaActualizacion"='`+fecha+`', `;

        qry_1 += `fk_responsable=`+req.usuario.id+`, `;

        qry_1 += `fk_tipo=`+req.body.gcrc_fk_tipo+`, `;

        qry_1 += `fk_comercial=`+req.body.gcrc_fk_comercial+`, `;

        qry_1 += `nombres='`+req.body.gcrc_nombres+`', `;

        qry_1 += `apellidos='`+req.body.gcrc_apellidos+`', `;

        qry_1 += `email='`+req.body.gcrc_email+`', `;

        qry_1 += `telefono1='`+req.body.gcrc_telefono1+`', `;

        qry_1 += `telefono2='`+req.body.gcrc_telefono2+`', `;

        qry_1 += `texto='`+req.body.gcrc_texto+`' `;

        try {

            await client.query(`UPDATE public.gc_registrocontactos SET `+qry_1+` WHERE id=`+req.body.gcrc_id+` `);

            let UltimoId = await client.query(`SELECT * FROM public.gc_registrocontactos WHERE id=`+req.body.gcrc_id+` `);

            res.status(200).send(UltimoId.rows[0]);

        } catch (error) {

            res.status(400).send({
                message: "ERROR AL ACTUALIZAR INFORMACIÓN "+error,
                success:false
            });

        }
    }
    /************************************************************/
    /************************************************************/
    exports.delete = (req,res) =>{
        if (!req.params.id) {
            res.status(400).send({
                message: "EL ID ES OBLIGATORIO",
                success:false
            });
            return;
        }
        client.query('UPDATE public.gc_registrocontactos SET estado=999 where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "CONTACTO ELIMINADO CORRECTAMENTE",
                success:true
            });
        });
    };
/************************************************************/
/************************************************************/
exports.CrearPropuesta = async (req, res) => { try {

    var Cabecera = await client.query(`
    SELECT
    *
    FROM public.gc_registrocontactos
    WHERE
    id=`+parseInt(req.params.id)+` limit 1
    `);

    if(Cabecera.rows.length<=0) {
        res.status(400).send({
        message: "NO SE ENCONTRO INFORMACIÓN PARA CARGAR",
        success:false }); res.end(); res.connection.destroy();
    }
    else
    {
        var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        var token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

        var fk_tipoDeServicio = null;
        var fk_zonaDespacho = null;
        var fk_formaDePago = null;
        var fk_cliente = null;
        var fk_direccion = null;
        var cantProveedores = 0;
        var direccion = '';

        var diasValidez = await client.query(` SELECT "diasValidez" as cantidad FROM public.gc_propuestas_cabeceras WHERE id=1 LIMIT 1 `);

        if(diasValidez.rows.ength<=0) { diasValidez=0; } else { diasValidez=diasValidez.rows[0]['cantidad']; }
        var fechaValidez = moment(fecha).add(diasValidez, 'days').format("YYYY-MM-DD HH:mm:ss");

        var columna = '';     var valor = '';

        columna+=` estado, `; valor+=` 0, `;
        columna+=` fk_contacto, `; valor+=``+parseInt(req.params.id)+`, `;
        columna+=` fk_responsable, `; valor+=``+req.usuario.id+`, `;
        columna+=` "fk_responsableUpdate", `; valor+=``+req.usuario.id+`, `;
        columna+=` "fechaCreacion", `; valor+=`'`+fecha+`', `;
        columna+=` "fechaActualizacion", `; valor+=`'`+fecha+`', `;
        columna+=` "nombreCliente", `; valor+=`'`+Cabecera.rows[0]['nombres']+`', `;
        columna+=` "atencionA", `; valor+=`'`+Cabecera.rows[0]['nombres']+`', `;
        columna+=` "fk_tipoDeServicio", `; valor+=``+fk_tipoDeServicio+`, `;
        columna+=` "cantProveedores", `; valor+=``+cantProveedores+`, `;
        columna+=` fk_cliente, `; valor+=``+fk_cliente+`, `;
        columna+=` fk_direccion, `; valor+=``+fk_direccion+`, `;
        columna+=` "fk_zonaDespacho", `; valor+=``+fk_zonaDespacho+`, `;
        columna+=` direccion, `; valor+=`'`+direccion+`', `;
        columna+=` "fk_formaDePago", `; valor+=``+fk_formaDePago+`, `;
        columna+=` "fechaValidez", `; valor+=`'`+fechaValidez+`', `;
        columna+=` "diasValidez" `; valor+=``+diasValidez+` `;

        await client.query(`INSERT INTO public.gc_propuestas_cabeceras (`+columna+`) values (`+valor+`)`);

        var Ultima = await client.query(` SELECT id as cantidad FROM public.gc_propuestas_cabeceras WHERE fk_responsable=`+req.usuario.id+` order by id desc LIMIT 1 `);
        res.status(200).send(Ultima.rows); res.end(); res.connection.destroy();

    }
} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "ERROR AL CREAR PROPUESTA ",
success:false });res.end(); res.connection.destroy(); }
}
/************************************************************/
/************************************************************/

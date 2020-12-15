const client = require('../config/db.client');

exports.create = (req, res) => {

    if (!req.body.fk_tipo || req.body.fk_tipo==0) {
        res.status(400).send({
            message: "EL TIPO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.fk_comercial || req.body.fk_comercial==0) {
        res.status(400).send({
            message: "EL COMERCIAL ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.nombres || req.body.nombres=='') {
        res.status(400).send({
            message: "EL NOMBRE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if ( (!req.body.email || req.body.email=='') && (!req.body.telefono1 || req.body.telefono1=='') && (!req.body.telefono2 || req.body.telefono2=='') ) {
        res.status(400).send({
            message: "DEBE INGRESAR UN EMAIL, O TELEFONO PRINCIPAL, O TELEFONO SECUNDARIO",
            success:false
        });
        return;
    }else if ( !req.body.texto || req.body.texto=='' ) {
        res.status(400).send({
            message: "EL TEXTO ES OBLIGATORIO",
            success:false
        });
        return;
    }
    /*
    else if (req.body.email && req.body.fk_comercial) {
        client.query('SELECT * FROM public.gc_registrocontactos where email = $1 and fk_comercial!=$2', [req.body.email, req.body.fk_comercial], (err, result) => {
            if(result.rows.length>0){
                res.status(400).send({
                    message: "EL MAIL ESTA ASOCIADO A OTRO COMERCIAL",
                    success:false
                });
                return;
            }
        });
    }
    */
    if (!req.body.email) { req.body.email = ''; }
    if (!req.body.apellidos) { req.body.apellidos = ''; }
    if (!req.body.telefono1) { req.body.telefono1 = ''; }
    if (!req.body.telefono2) { req.body.telefono2 = ''; }

    const query = {
        text: 'INSERT INTO public.gc_registrocontactos(fk_tipo, fk_comercial, nombres, apellidos, email, telefono1, telefono2, texto, estado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        values: [req.body.fk_tipo, req.body.fk_comercial, req.body.nombres, req.body.apellidos, req.body.email, req.body.telefono1, req.body.telefono2, req.body.texto, req.body.estado],
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

exports.update = (req, res) => {
    // Validate request
    if (!req.body.fk_tipo || req.body.fk_tipo==0) {
        res.status(400).send({
            message: "EL TIPO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.fk_comercial || req.body.fk_comercial==0) {
        res.status(400).send({
            message: "EL COMERCIAL ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.nombres || req.body.nombres=='') {
        res.status(400).send({
            message: "EL NOMBRE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if ( (!req.body.email || req.body.email=='') && (!req.body.telefono1 || req.body.telefono1=='') && (!req.body.telefono2 || req.body.telefono2=='') ) {
        res.status(400).send({
            message: "DEBE INGRESAR UN EMAIL, O TELEFONO PRINCIPAL, O TELEFONO SECUNDARIO",
            success:false
        });
        return;
    }else if ( !req.body.texto || req.body.texto=='' ) {
        res.status(400).send({
            message: "EL TEXTO ES OBLIGATORIO",
            success:false
        });
        return;
    };

    if (!req.body.email) { req.body.email = ''; }
    if (!req.body.apellidos) { req.body.apellidos = ''; }
    if (!req.body.telefono1) { req.body.telefono1 = ''; }
    if (!req.body.telefono2) { req.body.telefono2 = ''; }

    const query = {
        text: 'UPDATE public.gc_registrocontactos SET fk_tipo=$1, fk_comercial=$2, nombres=$3, apellidos=$4, email=$5, telefono1=$6, telefono2=$7, texto=$8 where id=$9 RETURNING *',
        values: [req.body.fk_tipo, req.body.fk_comercial, req.body.nombres, req.body.apellidos, req.body.email, req.body.telefono1, req.body.telefono2, req.body.texto, req.body.id],
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

    exports.list = (req, res) => {
    client.query(`
    SELECT
    contact.id
    , contact.fk_tipo
    , ctip.nombre as tipo_nombre
    , contact.fk_comercial
    , concat(usu.nombre,' ',usu.apellidos) as comercial_nombre
    , contact.nombres
    , contact.apellidos
    , contact.email
    , contact.telefono1
    , contact.telefono2
    , contact.texto
    , contact.estado
    FROM public.gc_registrocontactos as contact
    inner join public.usuario as usu on contact.fk_comercial=usu.id
    inner join public.gc_contactos_tipos as ctip on ctip.id=contact.fk_tipo
    where contact.estado=0
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
    client.query('SELECT * FROM public.gc_registrocontactos where id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    };

    exports.delete = (req,res) =>{
        if (!req.params.id) {
            res.status(400).send({
                message: "EL ID ES OBLIGATORIO",
                success:false
            });
            return;
        }
        client.query('DELETE FROM public.gc_registrocontactos where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "LA MARCA DE EQUIPO FUE ELIMINADA CORRECTAMENTE",
                success:true
            });
        });
    };
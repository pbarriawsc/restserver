const client = require('../config/db.client');

exports.create = (req, res) => {
    var moment = require('moment');

    if (!req.body.origen) {
        res.status(400).send({
            message: "EL ORIGEN ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.destino) {
        res.status(400).send({
            message: "EL DESTINO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.tarifa) {
        res.status(400).send({
            message: "LA TARIFA ES OBLIGATORIA",
            success:false
        });
        return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: 'INSERT INTO public.gc_propuestas_serviciosadicionales(origen, tarifa, destino, fk_cabecera, "fechaCreacion", "fechaActualizacion", estado) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        values: [req.body.origen, req.body.tarifa, req.body.destino, req.body.fk_cabecera, fecha, fecha, 0],
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
    var moment = require('moment');

    if (!req.body.origen) {
        res.status(400).send({
            message: "EL ORIGEN ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.destino) {
        res.status(400).send({
            message: "EL DESTINO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.tarifa) {
        res.status(400).send({
            message: "LA TARIFA ES OBLIGATORIA",
            success:false
        });
        return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: 'UPDATE public.gc_propuestas_serviciosadicionales SET origen=$1, tarifa=$2, destino=$3, fk_cabecera=$4, "fechaCreacion"=$5, "fechaActualizacion"=$6, estado=0 where id=$7 RETURNING *',
        values: [req.body.origen, req.body.tarifa, req.body.destino, req.body.fk_cabecera, fecha, fecha, req.body.id],
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

exports.findByCabecera = (req, res) => {

    console.log("CARGAR LISTADO DE ID 0-0-0-0-0-0-0-0-0-0-"+parseInt(Object.values(req.params.id)));

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
    order by tar.id desc
    `, [ parseInt(Object.values(req.params.id)) ], function (err, result) {
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
      TO_CHAR(tar."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
      , TO_CHAR(tar."fechaActualizacion", 'DD-MM-YYYY HH24:MI') as actualizacion
      , tar.id
      , tar.origen
      , tar.tarifa
      , tar.destino
      , tar."fechaCreacion"
      , tar."fechaActualizacion"
      , tar.estado
      FROM public.gc_propuestas_serviciosadicionales as tar
      where tar.estado=0
      order by tar.id desc
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
    client.query('SELECT * FROM public.gc_propuestas_serviciosadicionales where id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    };

    exports.delete = (req,res) =>{

        console.log("INFO A ELIMINAR 0-0-0-0-0-0-0-0-0-0-"+parseInt( req.params.id) );

        if (!req.params.id) {
            res.status(400).send({
                message: "EL ID ES OBLIGATORIO",
                success:false
            });
            return;
        }
        client.query('DELETE FROM public.gc_propuestas_serviciosadicionales where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "EL SERVICIO ADICIONAL FUE ELIMINADO CORRECTAMENTE",
                success:true
            });
        });
    };

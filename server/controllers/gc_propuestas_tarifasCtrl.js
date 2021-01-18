const client = require('../config/db.client');

exports.create = (req, res) => {
    var moment = require('moment');

    if (!req.body.origen) {
        res.status(400).send({
            message: "EL ORIGEN ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.almacenaje) {
        res.status(400).send({
            message: "EL ALMACENAJE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.destino) {
        res.status(400).send({
            message: "EL DESTINO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.cbmPeso) {
        res.status(400).send({
            message: "EL CBM/PESO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.unidadesACobrar) {
        res.status(400).send({
            message: "LAS UNIDADES A COBRAR SON OBLIGATORIAS",
            success:false
        });
        return;
    }else if (!req.body.valorUnitarioUsd) {
        res.status(400).send({
            message: "EL VALOR UNITARIO USD ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.tarifaUsd) {
        res.status(400).send({
            message: "LA TARIFA USD ES OBLIGATORIA",
            success:false
        });
        return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: 'INSERT INTO public.gc_propuestas_tarifas(origen, almacenaje, destino, "cbmPeso", "unidadesACobrar", "valorUnitarioUsd", "tarifaUsd", fk_cabecera, "fechaCreacion", "fechaActualizacion", estado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        values: [req.body.origen, req.body.almacenaje, req.body.destino, req.body.cbmPeso, req.body.unidadesACobrar, req.body.valorUnitarioUsd, req.body.tarifaUsd, req.body.fk_cabecera, fecha, fecha, 0],
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
    }else if (!req.body.almacenaje) {
        res.status(400).send({
            message: "EL ALMACENAJE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.destino) {
        res.status(400).send({
            message: "EL DESTINO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.cbmPeso) {
        res.status(400).send({
            message: "EL CBM/PESO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.unidadesACobrar) {
        res.status(400).send({
            message: "LAS UNIDADES A COBRAR SON OBLIGATORIAS",
            success:false
        });
        return;
    }else if (!req.body.valorUnitarioUsd) {
        res.status(400).send({
            message: "EL VALOR UNITARIO USD ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.tarifaUsd) {
        res.status(400).send({
            message: "LA TARIFA USD ES OBLIGATORIA",
            success:false
        });
        return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: 'UPDATE public.gc_propuestas_tarifas SET origen=$1, almacenaje=$2, destino=$3, "cbmPeso"=$4, "unidadesACobrar"=$5, "valorUnitarioUsd"=$6, "tarifaUsd"=$7, fk_cabecera=$8, "fechaCreacion"=$9, "fechaActualizacion"=$10, estado=0 where id=$11 RETURNING *',
        values: [req.body.origen, req.body.almacenaje, req.body.destino, req.body.cbmPeso, req.body.unidadesACobrar, req.body.valorUnitarioUsd, req.body.tarifaUsd, req.body.fk_cabecera, fecha, fecha, req.body.id],
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
    order by tar.id desc
    `, [ parseInt(Object.values(req.params)) ], function (err, result) {
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
      , tar.almacenaje
      , tar.destino
      , tar."cbmPeso"
      , tar."valorUnitarioUsd"
      , tar."unidadesACobrar"
      , tar."tarifaUsd"
      , tar."fechaCreacion"
      , tar."fechaActualizacion"
      , tar.estado
      FROM public.gc_propuestas_tarifas as tar
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
    client.query('SELECT * FROM public.gc_propuestas_tarifas where id = $1', [req.params.id], function (err, result) {
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
        client.query('DELETE FROM public.gc_propuestas_tarifas where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "LA TARIFA FUE ELIMINADA CORRECTAMENTE",
                success:true
            });
        });
    };

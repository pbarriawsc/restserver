const client = require('../config/db.client');

exports.create = (req, res) => {
    var moment = require('moment');

    if (!req.body.servicio) {
        res.status(400).send({
            message: "EL SERVICIO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.tipoDeCarga) {
        res.status(400).send({
            message: "EL TIPO DE CARGA ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.volumenEstimado) {
        res.status(400).send({
            message: "EL VOLUMEN ESTIMADO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.pesoEstimado) {
        res.status(400).send({
            message: "EL PESO ESTIMADO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.direccionDespacho) {
        res.status(400).send({
            message: "LA DIRECCION DE DESPACHO ES OBLIGATORIA",
            success:false
        });
        return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: 'INSERT INTO public.gc_propuestas_cabeceras("volumenEstimado", "tipoDeCarga", servicio, "pesoEstimado", fk_contacto, "direccionDespacho", "fechaCreacion", "fechaActualizacion", estado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        values: [req.body.volumenEstimado, req.body.tipoDeCarga, req.body.servicio, req.body.pesoEstimado, req.body.fk_contacto, req.body.direccionDespacho, fecha, fecha, 0],
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

    // Validate request
    if (!req.body.servicio) {
        res.status(400).send({
            message: "EL SERVICIO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.tipoDeCarga) {
        res.status(400).send({
            message: "EL TIPO DE CARGA ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.volumenEstimado) {
        res.status(400).send({
            message: "EL VOLUMEN ESTIMADO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.pesoEstimado) {
        res.status(400).send({
            message: "EL PESO ESTIMADO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.direccionDespacho) {
        res.status(400).send({
            message: "LA DIRECCION DE DESPACHO ES OBLIGATORIA",
            success:false
        });
        return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: 'UPDATE public.gc_propuestas_cabeceras SET "volumenEstimado"=$1, "tipoDeCarga"=$2, servicio=$3, "pesoEstimado"=$4, fk_contacto=$5, "direccionDespacho"=$6,"fechaActualizacion"=$7 where id=$8 RETURNING *',
        values: [req.body.volumenEstimado, req.body.tipoDeCarga, req.body.servicio, req.body.pesoEstimado, req.body.fk_contacto, req.body.direccionDespacho, fecha, req.body.id],
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
    , cabe."direccionDespacho"
    FROM public.gc_propuestas_cabeceras as cabe
    where cabe.estado=0 and fk_contacto = $1
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
      , cabe."direccionDespacho"
      FROM public.gc_propuestas_cabeceras as cabe
      where cabe.estado=0
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

    exports.delete = (req,res) =>{
        if (!req.params.id) {
            res.status(400).send({
                message: "EL ID ES OBLIGATORIO",
                success:false
            });
            return;
        }
        client.query('DELETE FROM public.gc_propuestas_cabeceras where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "LA PROPUESTA FUE ELIMINADA CORRECTAMENTE",
                success:true
            });
        });
    };

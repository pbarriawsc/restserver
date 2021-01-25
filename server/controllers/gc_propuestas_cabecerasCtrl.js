const client = require('../config/db.client');

exports.create = (req, res) => {
    var moment = require('moment');

    if (!req.body.nombreCliente) {
        res.status(400).send({
            message: "EL NOMBRE DEL CLIENTE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.atencionA) {
        res.status(400).send({
            message: "LA ATENCION A ES OBLIGATORIA",
            success:false
        });
        return;
    }else if (!req.body.servicio) {
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
        text: 'INSERT INTO public.gc_propuestas_cabeceras("volumenEstimado", "tipoDeCarga", servicio, "pesoEstimado", fk_contacto, "direccionDespacho", "fechaCreacion", "fechaActualizacion", estado, "nombreCliente", "atencionA") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        values: [req.body.volumenEstimado, req.body.tipoDeCarga, req.body.servicio, req.body.pesoEstimado, req.body.fk_contacto, req.body.direccionDespacho, fecha, fecha, 0, req.body.nombreCliente, req.body.atencionA],
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
    if (!req.body.nombreCliente) {
        res.status(400).send({
            message: "EL NOMBRE DEL CLIENTE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.atencionA) {
        res.status(400).send({
            message: "LA ATENCION A ES OBLIGATORIA",
            success:false
        });
        return;
    }else if (!req.body.servicio) {
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
        text: 'UPDATE public.gc_propuestas_cabeceras SET "volumenEstimado"=$1, "tipoDeCarga"=$2, servicio=$3, "pesoEstimado"=$4, fk_contacto=$5, "direccionDespacho"=$6, "fechaActualizacion"=$7, "nombreCliente"=$8, "atencionA"=$9 where id=$10 RETURNING *',
        values: [req.body.volumenEstimado, req.body.tipoDeCarga, req.body.servicio, req.body.pesoEstimado, req.body.fk_contacto, req.body.direccionDespacho, fecha, req.body.nombreCliente, req.body.atencionA, req.body.id],
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

    exports.delete = (req,res) =>{
        if (!req.params.id) {
            res.status(400).send({
                message: "EL ID ES OBLIGATORIO",
                success:false
            });
            return;
        }
        client.query('UPDATE public.gc_propuestas_cabeceras SET estado=2 where id = $1', [req.params.id], function (err, result) {
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

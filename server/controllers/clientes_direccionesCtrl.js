const client = require('../config/db.client');
exports.create = (req, res) => {
    var moment = require('moment');

    if (!req.body.fk_cliente) {
      res.status(400).send({
        message: "EL CLIENTE ES OBLIGATORIO",
        success:false
      });
      return;
    }else if (!req.body.nombre) {
      res.status(400).send({
        message: "EL NOMBRE ES OBLIGATORIO",
        success:false
      });
      return;
    }else if (!req.body.fk_tipo){
        res.status(400).send({
            message: "EL CODIGO ES OBLIGATORIO",
            success:false
          });
          return;
    }else if (!req.body.fk_pais){
        res.status(400).send({
            message: "EL PAIS ES OBLIGATORIO",
            success:false
            });
            return;
    }else if (!req.body.fk_region){
        res.status(400).send({
            message: "LA REGION ES OBLIGATORIA",
            success:false
            });
            return;
    }else if (!req.body.fk_comuna){
        res.status(400).send({
            message: "LA COMUNA ES OBLIGATORIA",
            success:false
            });
            return;
    }else if (!req.body.direccion){
        res.status(400).send({
            message: "LA DIRECCION ES OBLIGATORIA",
            success:false
            });
            return;
    }else if (!req.body.numero){
        res.status(400).send({
            message: "EL NUMERO ES OBLIGATORIO",
            success:false
            });
            return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: 'INSERT INTO public.clientes_direcciones(nombre, fk_cliente, fk_tipo, fk_pais, fk_region, fk_comuna, direccion, numero, radio, "codigoPostal", referencia, lat, lon, comentario, "fechaCreacion", "fechaActualizacion", estado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *',
        values: [req.body.nombre, req.body.fk_cliente, req.body.fk_tipo, req.body.fk_pais, req.body.fk_region, req.body.fk_comuna, req.body.direccion, req.body.numero, req.body.radio, req.body.codigoPostal, req.body.referencia, req.body.lat, req.body.lon, req.body.comentario, fecha, fecha, 0],
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

    if (!req.body.fk_cliente) {
      res.status(400).send({
        message: "EL CLIENTE ES OBLIGATORIO",
        success:false
      });
      return;
    }else if (!req.body.nombre) {
      res.status(400).send({
        message: "EL NOMBRE ES OBLIGATORIO",
        success:false
      });
      return;
    }else if (!req.body.fk_tipo){
        res.status(400).send({
            message: "EL CODIGO ES OBLIGATORIO",
            success:false
          });
          return;
    }else if (!req.body.fk_pais){
        res.status(400).send({
            message: "EL PAIS ES OBLIGATORIO",
            success:false
            });
            return;
    }else if (!req.body.fk_region){
        res.status(400).send({
            message: "LA REGION ES OBLIGATORIA",
            success:false
            });
            return;
    }else if (!req.body.fk_comuna){
        res.status(400).send({
            message: "LA COMUNA ES OBLIGATORIA",
            success:false
            });
            return;
    }else if (!req.body.direccion){
        res.status(400).send({
            message: "LA DIRECCION ES OBLIGATORIA",
            success:false
            });
            return;
    }else if (!req.body.numero){
        res.status(400).send({
            message: "EL NUMERO ES OBLIGATORIO",
            success:false
            });
            return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: 'UPDATE public.clientes_direcciones SET nombre=$1, fk_cliente=$2, fk_tipo=$3, fk_pais=$4, fk_region=$5, fk_comuna=$6, direccion=$7, numero=$8, radio=$9, "codigoPostal"=$10, referencia=$11, lat=$12, lon=$13, comentario=$14, "fechaActualizacion"=$15 where id=$16 RETURNING *',
        values: [req.body.nombre, req.body.fk_cliente, req.body.fk_tipo, req.body.fk_pais, req.body.fk_region, req.body.fk_comuna, req.body.direccion, req.body.numero, req.body.radio, req.body.codigoPostal, req.body.referencia, req.body.lat, req.body.lon, req.body.comentario, fecha, req.body.id],
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
      , concat(dir.direccion,' ',dir.numero,', ',comunas.nombre,', ',region.nombre) as direccionCompleta
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

exports.GetDireccion = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "EL ID ES OBLIGATORIO",
            success:false
          });
          return;
    }
    client.query('SELECT * FROM public.clientes_direcciones where id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
  };

  exports.prefixById = (req,res) =>{
      if (!req.params.id) {
          res.status(400).send({
              message: "EL ID ES OBLIGATORIO",
              success:false
            });
            return;
      }
      client.query('SELECT * FROM public.clientes_direcciones where id = $1', [req.params.id], function (err, result) {
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
        client.query('DELETE FROM public.clientes_direcciones where id = $1', [parseInt(Object.values(req.params))], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "LA DIRECCION FUE ELIMINADA CORRECTAMENTE",
                success:true
              });
        });
    };

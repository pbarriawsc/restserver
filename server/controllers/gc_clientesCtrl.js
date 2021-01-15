const client = require('../config/db.client');

exports.create = (req, res) => {
    var moment = require('moment');

    if (!req.body.fk_cliente || req.body.fk_cliente==0) {
        res.status(400).send({
            message: "EL CLIENTE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.fk_contacto || req.body.fk_contacto==0) {
        res.status(400).send({
            message: "EL CONTACTO BASE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.fk_direccion || req.body.fk_direccion==0) {
        res.status(400).send({
            message: "LA DIRECCION ES OBLIGATORIA",
            success:false
        });
        return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: 'INSERT INTO public.gc_clientes(fk_cliente, fk_contacto, fk_direccion, "fechaCreacion", "fechaActualizacion", estado) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
        values: [req.body.fk_cliente, req.body.fk_contacto, req.body.fk_direccion, fecha, fecha, 0],
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

  exports.listClientes = (req, res) => {
    client.query('SELECT * FROM public.clientes order by nombre asc', "", function (err, result) {
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
      TO_CHAR(GCCLI."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
      , TO_CHAR(GCCLI."fechaActualizacion", 'DD-MM-YYYY HH24:MI') as actualizacion
      , GCCLI.id
      , GCCLI.fk_cliente
      , GCCLI.fk_contacto
      , GCCLI.estado
      , CLI.nombre
      , CLI.rut
      FROM public.gc_clientes as GCCLI
      inner join public.clientes as CLI on GCCLI.fk_cliente=CLI.id
      where GCCLI.estado=0 and GCCLI.fk_contacto=$1
      order by GCCLI.id desc
      `, [ parseInt(Object.values(req.params)) ], function (err, result) {
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
        client.query('DELETE FROM public.gc_clientes where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "EL CLIENTE FUE ELIMINADO CORRECTAMENTE",
                success:true
            });
        });
    };

const client = require('../config/db.client');

exports.GetClientes = async (req, res) => {
    try {
        let Lista = await client.query(` 
        SELECT 
        id
        , estado
        , rut
        , codigo
        , "razonSocial"
        , web
        , telefono1
        , telefono2
        , "dteEmail"
        , "aproComercial"
        , "aproFinanciera"
        , "codigoSii"
        , giro
        , "repLegalRut"
        , "repLegalNombre"
        , "repLegalApellido"
        , "repLegalMail"
        , fk_responsable
        , fk_comercial
        FROM public.clientes
        order by nombre asc`);
        res.status(200).send(Lista.rows);
        res.end(); res.connection.destroy();

    } catch (error) {

        res.status(400).send({
            message: "ERROR AL CARGAR CLIENTES "+error,
            success:false,
        });
        res.end(); res.connection.destroy();
    }

};
/************************************************************/
/************************************************************/

exports.create = (req, res) => {
    var moment = require('moment');

    if (!req.body.fk_proveedor || req.body.fk_proveedor==0) {
        res.status(400).send({
            message: "EL PROVEEDOR ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.fk_contacto || req.body.fk_contacto==0) {
        res.status(400).send({
            message: "EL CONTACTO BASE ES OBLIGATORIO",
            success:false
        });
        return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: 'INSERT INTO public.gc_proveedores(fk_proveedor, fk_contacto, "fechaCreacion", "fechaActualizacion", estado) VALUES($1, $2, $3, $4, $5) RETURNING *',
        values: [req.body.fk_proveedor, req.body.fk_contacto, fecha, fecha, 0],
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

exports.listProveedores = (req, res) => {
    client.query('SELECT * FROM public.proveedores order by nombre asc', "", function (err, result) {
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
      TO_CHAR(GCPROV."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
      , TO_CHAR(GCPROV."fechaActualizacion", 'DD-MM-YYYY HH24:MI') as actualizacion
      , GCPROV.id
      , GCPROV.fk_proveedor
      , GCPROV.fk_contacto
      , GCPROV.estado
      , CASE
      WHEN GCPROV.estado=0 THEN 'DESARROLLO'
      WHEN GCPROV.estado=1 THEN 'ELIMINADA'
      WHEN GCPROV.estado=2 THEN 'APROBADA'
      ELSE 'DESARROLLO' END as estado_nombre
      , PROV.codigo
      , PROV.nombre
      FROM public.gc_proveedores as GCPROV
      inner join public.proveedores as PROV on GCPROV.fk_proveedor=PROV.id
      where GCPROV.estado!=1 and GCPROV.fk_contacto=$1
      order by GCPROV.id desc
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
        client.query('UPDATE public.gc_proveedores SET estado=1 where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "EL PROVEEDOR FUE ELIMINADO CORRECTAMENTE",
                success:true
            });
        });
    };

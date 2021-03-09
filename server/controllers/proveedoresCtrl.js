const client = require('../config/db.client');

exports.create = async (req, res) => { try {

    if (!req.body.fk_cliente || req.body.fk_cliente=='0') {
      res.status(400).send({
        message: "EL CLIENTE ES OBLIGATORIO",
        success:false
      }); res.end(); res.connection.destroy();
    }else if (!req.body.codigo || req.body.codigo.trim().length==0) {
      res.status(400).send({
        message: "EL CODIGO ES OBLIGATORIO",
        success:false
      }); res.end(); res.connection.destroy();
    }else if (!req.body.nombreEsp || req.body.nombreEsp.trim().length==0) {
      res.status(400).send({
        message: "EL NOMBRE ESPAÑOL ES OBLIGATORIO",
        success:false
      }); res.end(); res.connection.destroy();
    }
    else
    {

      var codigo = req.body.codigo.trim();
      var nombreEsp = req.body.nombreEsp.trim();
      var fk_cliente = req.body.fk_cliente;

      if(!req.body.codigoTributario || req.body.codigoTributario.trim().length==0)
      { var codigoTributario = ''; } else { var codigoTributario = req.body.codigoTributario.trim(); }

      if(!req.body.nombreChi || req.body.nombreChi.trim().length==0)
      { var nombreChi = ''; } else { var nombreChi = req.body.nombreChi.trim(); }

      if(!req.body.nombreEng || req.body.nombreEng.trim().length==0)
      { var nombreEng = ''; } else { var nombreEng = req.body.nombreEng.trim(); }

      let ExisteCodigo = await client.query(` SELECT * FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+` and codigo='`+req.body.codigo+`' `);

      let ExisteCodigoTributario = await client.query(` SELECT * FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+` and "codigoTributario"='`+req.body.codigoTarifario+`' and length("codigoTributario")>0  `);

      let ExisteNombreEsp = await client.query(` SELECT * FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+` and nombre='`+req.body.nombreEsp+`' `);

      let ExisteNombreChi = await client.query(` SELECT * FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+` and "nombreChi"='`+req.body.nombreChi+`' and length("nombreChi")>0 `);

      let ExisteNombreEng = await client.query(` SELECT * FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+` and "nombreEng"='`+req.body.nombreEng+`' and length("nombreEng")>0 `);

      if( ExisteCodigo.rows.length>0 ) {
        res.status(400).send({
            message: "EL CÓDIGO YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      } else if( ExisteCodigoTributario.rows.length>0 ) {
          res.status(400).send({
              message: "EL CÓDIGO TRIBUTARIO YA ESTÁ INGRESADO",
              success:false
          }); res.end(); res.connection.destroy();
      } else if( ExisteNombreEsp.rows.length>0 ) {
        res.status(400).send({
            message: "EL NOMBRE ESPAÑOL YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      } else if( ExisteNombreChi.rows.length>0 ) {
        res.status(400).send({
            message: "EL NOMBRE CHINO YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      } else if( ExisteNombreEng.rows.length>0 ) {
        res.status(400).send({
            message: "EL NOMBRE INGLES YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      }
      else
      {


        let qry_1 = '';     let qry_2 = '';

        qry_1 = ` codigo, `;
        qry_2 = ` '`+codigo+`', `;

        qry_1 += ` "codigoTributario", `;
        qry_2 += ` '`+codigoTributario+`', `;

        qry_1 += ` nombre, `;
        qry_2 += ` '`+nombreEsp+`', `;

        qry_1 += ` "nombreEng", `;
        qry_2 += ` '`+nombreEng+`', `;

        qry_1 += ` "nombreChi", `;
        qry_2 += ` '`+nombreChi+`', `;

        qry_1 += ` fk_cliente `;
        qry_2 += ` `+fk_cliente+` `;

        console.log(`INSERT INTO public.proveedores (`+qry_1+`) values (`+qry_2+`)`);
        await client.query(`INSERT INTO public.proveedores (`+qry_1+`) values (`+qry_2+`)`);

        let Listado = await client.query(`
        SELECT
        *
        FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+`
        ORDER BY id DESC
        `);

        res.status(200).send(Listado.rows);

      }

    }

} catch (error) { res.status(400).send({ message: "ERROR AL GUARDAR INFORMACIÓN "+error, success:false, }); res.end(); res.connection.destroy(); } }

exports.update = (req, res) => {
    // Validate request
    if (!req.body.codigo){
        res.status(400).send({
            message: "EL CODIGO ES OBLIGATORIO",
            success:false
          });
          return;
    }else if (!req.body.nombre){
        res.status(400).send({
            message: "EL NOMBRE ES OBLIGATORIO",
            success:false
          });
          return;
    }

    const query = {
        text: 'UPDATE public.proveedores SET codigo=$1, nombre=$2 where id=$3 RETURNING *',
        values: [req.body.codigo, req.body.nombre, req.body.id],
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

  exports.findList = async (req, res) => { try {

    console.log(`
    SELECT
    *
    FROM public.proveedores WHERE fk_cliente=`+req.params.id+`
    ORDER BY id DESC`);
    let Listado = await client.query(`
    SELECT
    *
    FROM public.proveedores WHERE fk_cliente=`+req.params.id+`
    ORDER BY id DESC
    `);

    res.status(200).send(Listado.rows);

  } catch (error) { res.status(400).send({ message: "ERROR AL CARGAR LISTADO DE PROVEEDORES "+error, success:false, }); res.end(); res.connection.destroy(); } }

  exports.list = (req, res) => {
    client.query('SELECT * FROM public.proveedores', "", function (err, result) {
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
    client.query('SELECT * FROM public.proveedores where id = $1', [req.params.id], function (err, result) {
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
        client.query('DELETE FROM public.proveedores where id = $1', [req.params.id], function (err, result) {
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

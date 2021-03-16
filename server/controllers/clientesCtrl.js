const client = require('../config/db.client');

exports.create = async (req,res) =>{
    // Validate request

    if (!req.body.codigo || req.body.codigo=='0') {
      res.status(400).send({
        message: "EL CODIGO ES OBLIGATORIO",
        success:false
      }); res.end(); res.connection.destroy();
    }
    else
    {

      var codigo = req.body.codigo.trim();

      if(!req.body.rut || req.body.rut.trim().length==0) { var rut = ''; }
      else { var rut = req.body.rut.trim(); }

      if(!req.body.razonSocial || req.body.razonSocial.trim().length==0) { var razonSocial = ''; }
      else { var razonSocial = req.body.razonSocial.trim(); }

      if(!req.body.web || req.body.web.trim().length==0) { var web = ''; }
      else { var web = req.body.web.trim(); }

      if(!req.body.telefono1 || req.body.telefono1.trim().length==0) { var telefono1 = ''; }
      else { var telefono1 = req.body.telefono1.trim(); }

      if(!req.body.telefono2 || req.body.telefono2.trim().length==0) { var telefono2 = ''; }
      else { var telefono2 = req.body.telefono2.trim(); }

      if(!req.body.dteEmail || req.body.dteEmail.trim().length==0) { var dteEmail = ''; }
      else { var dteEmail = req.body.dteEmail.trim(); }

      if(!req.body.aproComercial || req.body.aproComercial.trim().length==0) { var aproComercial = 1; }
      else { var aproComercial = req.body.aproComercial.trim(); }

      if(!req.body.aproFinanciera || req.body.aproFinanciera.trim().length==0) { var aproFinanciera = 1; }
      else { var aproFinanciera = req.body.aproFinanciera.trim(); }

      let ExisteCodigo = await client.query(` SELECT * FROM public.clientes WHERE codigo='`+codigo+`' `);

      let ExisteRut = await client.query(` SELECT * FROM public.clientes WHERE rut='`+rut+`' and LENGTH(rut)>0 `);

      if( ExisteCodigo.rows.length>0 ) {
        res.status(400).send({
            message: "EL CÓDIGO YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      } else if( ExisteRut.rows.length>0 ) {
          res.status(400).send({
              message: "EL RUT YA ESTÁ INGRESADO",
              success:false
          }); res.end(); res.connection.destroy();
      }
      else
      {
          let columnas = '';     let datos = '';

          columnas=`codigo, `; datos=`'`+codigo+`', `;
          columnas+=`rut, `; datos+=`'`+rut+`', `;
          columnas+=`"razonSocial", `; datos+=`'`+razonSocial+`', `;
          columnas+=`web, `; datos+=`'`+web+`', `;
          columnas+=`telefono1, `; datos+=`'`+telefono1+`', `;
          columnas+=`telefono2, `; datos+=`'`+telefono2+`', `;
          columnas+=`"dteEmail", `; datos+=`'`+dteEmail+`', `;
          columnas+=`"aproComercial", `; datos+= aproComercial+`, `;
          columnas+=`"aproFinanciera" `; datos+= aproFinanciera+` `;

          console.log(`INSERT INTO public.clientes (`+columnas+`) values (`+datos+`)`);
          await client.query(`INSERT INTO public.clientes (`+columnas+`) values (`+datos+`)`);

          res.status(200).send([]);
        }
    }
}

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
        text: 'UPDATE public.clientes SET codigo=$1, rut=$2, nombre=$3, "razonSocial"=$4, web=$5, telefono1=$6, telefono2=$7, "dteEmail"=$8, "aproComercial"=$9, "aproFinanciera"=$10 where id=$11 RETURNING *',
        values: [req.body.codigo, req.body.rut, req.body.nombre, req.body.razonSocial, req.body.web, req.body.telefono1, req.body.telefono2, req.body.dteEmail, req.body.aproComercial, req.body.aproFinanciera, req.body.id],
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
    client.query('SELECT * FROM public.clientes', "", function (err, result) {
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
    client.query('SELECT * FROM public.clientes where id = $1', [parseInt(req.params.id)], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    };

exports.findOneByCodigo = (req,res) =>{
    if (!req.params.codigo) {
        res.status(400).send({
            message: "EL ID ES OBLIGATORIO",
            success:false
          });
          return;
    }
        client.query('SELECT * FROM public.clientes where codigo = $1 LIMIT 1', [parseInt(req.params.codigo)], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
};
exports.delete = async (req,res) =>{

    try {
        if (!req.params.id){
            res.status(400).send({ message: "NO SE DETECTO UN CLIENTE A ELIMINAR", success:false,});
            res.end(); res.connection.destroy();
        }else {
            await client.query(`DELETE FROM public.clientes where id=`+parseInt(req.params.id));
            res.status(200).send([]);
        }
    } catch (error) {
        console.log("====== DELETE CLIENTE ======");console.log(error);console.log("");console.log("");
        res.status(400).send({message: "NO SE PUEDE ELIMINAR EL CLIENTE, TIENE INFORMACIÓN RELACIONADA ", success:false,});
        res.end(); res.connection.destroy();
    }
};

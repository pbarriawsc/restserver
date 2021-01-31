const client = require('../config/db.client');

exports.create = (req, res) => {
    // Validate request
    if (!req.body.codigo) {
        res.status(400).send({
          message: "EL CODIGO ES OBLIGATORIO",
          success:false
        });
        return;
      }else if (!req.body.nombre) {
      res.status(400).send({
        message: "EL NOMBRE ES OBLIGATORIO",
        success:false
      });
      return;
    }

    const query = {
        text: 'INSERT INTO public.clientes(codigo, rut, nombre, "razonSocial", web, telefono1, telefono2, "dteEmail", "aproComercial", "aproFinanciera") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        values: [req.body.codigo, req.body.rut, req.body.nombre, req.body.razonSocial, req.body.web, req.body.telefono1, req.body.telefono2, req.body.dteEmail, req.body.aproComercial, req.body.aproFinanciera],
    };
    
    client.query(query,"",function (err, result)
    {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        console.log(result);
        res.status(200).send(result.rows[0]);
    });
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
exports.delete = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "EL ID ES OBLIGATORIO",
            success:false
          });
          return;
    }
    client.query('DELETE FROM public.clientes where id = $1', [req.params.id], function (err, result) {
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
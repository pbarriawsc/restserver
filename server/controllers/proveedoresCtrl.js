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
        text: 'INSERT INTO public.proveedores(codigo, nombre) VALUES($1, $2) RETURNING *',
        values: [req.body.codigo, req.body.nombre],
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
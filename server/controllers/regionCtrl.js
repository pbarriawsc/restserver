const client = require('../config/db.client');
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nombre) {
      res.status(400).send({
        message: "EL NOMBRE ES OBLIGATORIO",
        success:false
      });
      return;
    }else if (!req.body.codigo){
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
    }

    const query = {
        text: 'INSERT INTO public.region(codigo, nombre, fk_pais) VALUES($1, $2, $3) RETURNING *',
        values: [req.body.codigo, req.body.nombre, req.body.fk_pais],
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
    if (!req.body.codigo) {
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
    }else if (!req.body.fk_pais){
        res.status(400).send({
            message: "EL PAIS ES OBLIGATORIO",
            success:false
            });
            return;
    }

    const query = {
        text: 'UPDATE public.region SET codigo=$1, nombre=$2, fk_pais=$3 where id=$4 RETURNING *',
        values: [req.body.codigo, req.body.nombre, req.body.fk_pais, req.body.id],
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
    client.query('SELECT reg.id, reg.codigo, reg.nombre, reg.fk_pais, pai.nombre as pais_nombre FROM public.region as reg inner join pais as pai on pai.id=reg.fk_pais', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
  };

  exports.list_comuna = (req, res) => {
    client.query(`
    SELECT
    reg.*
    FROM public.comunas as com
    inner join public.pais as pai on com.fk_pais=pai.id
    inner join public.region as reg on pai.id=reg.fk_pais
    where
    com.id= $1
    `, [parseInt(Object.values(req.params))], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
  };

  exports.list_pais = (req, res) => {
    client.query('SELECT * FROM public.region where fk_pais = $1', [parseInt(Object.values(req.params))], function (err, result) {
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
    client.query('SELECT * FROM public.region where id = $1', [req.params.id], function (err, result) {
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
        client.query('DELETE FROM public.region where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "LA REGION FUE ELIMINADA CORRECTAMENTE",
                success:true
              });
        });
    };
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
    }else if (!req.body.fk_region){
        res.status(400).send({
            message: "LA REGION ES OBLIGATORIA",
            success:false
            });
            return;
    }

    const query = {
        text: 'INSERT INTO public.comunas(codigo, nombre, fk_pais, fk_region) VALUES($1, $2, $3, $4) RETURNING *',
        values: [req.body.codigo, req.body.nombre, req.body.fk_pais, req.body.fk_region],
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
        text: 'UPDATE public.comunas SET codigo=$1, nombre=$2, fk_pais=$3, fk_region=$4 where id=$5 RETURNING *',
        values: [req.body.codigo, req.body.nombre, req.body.fk_pais, req.body.fk_region, req.body.id],
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
    SELECT comu.id, comu.codigo, comu.nombre, comu.fk_pais, pai.nombre as pais_nombre, comu.fk_region, reg.nombre as region_nombre
    FROM public.comunas as comu
    inner join pais as pai on pai.id=comu.fk_pais
    inner join region as reg on comu.fk_region=reg.id
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
    client.query('SELECT * FROM public.comunas where id = $1', [req.params.id], function (err, result) {
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
        client.query('DELETE FROM public.comunas where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "LA COMUNA FUE ELIMINADA CORRECTAMENTE",
                success:true
              });
        });
    };
const client = require('../config/db.client');
exports.create = (req, res) => {
    // Validate request
    if (!req.body.mmsi) {
      res.status(400).send({
        message: "EL MMSI ES OBLIGATORIO",
        success:false
      });
      return;
    }else if (!req.body.imo){
        res.status(400).send({
            message: "EL IMO ES OBLIGATORIO",
            success:false
          });
          return;
    }else if (!req.body.nombre){
        res.status(400).send({
            message: "EL NOMBRE ES OBLIGATORIO",
            success:false
            });
            return;
    }else if (!req.body.bandera){
        res.status(400).send({
            message: "LA BANDERA ES OBLIGATORIA",
            success:false
            });
            return;
    }else if (!req.body.tipo){
        res.status(400).send({
            message: "EL TIPO ES OBLIGATORIA",
            success:false
            });
            return;
    } 


    const query = {
        text: 'INSERT INTO public.naves(mmsi, imo, nombre, bandera, tipo) VALUES($1, $2, $3, $4, $5) RETURNING *',
        values: [req.body.mmsi, req.body.imo, req.body.nombre, req.body.bandera, req.body.tipo],
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
    if (!req.body.mmsi) {
        res.status(400).send({
            message: "EL MMSI ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.imo){
        res.status(400).send({
            message: "EL IMO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.nombre){
        res.status(400).send({
            message: "EL NOMBRE ES OBLIGATORIO",
            success:false
            });
            return;
    }else if (!req.body.bandera){
        res.status(400).send({
            message: "LA BANDERA ES OBLIGATORIA",
            success:false
            });
            return;
    }else if (!req.body.tipo){
        res.status(400).send({
            message: "EL TIPO ES OBLIGATORIO",
            success:false
            });
            return;
    }  

    const query = {
        text: 'UPDATE public.naves SET mmsi=$1, imo=$2, nombre=$3, bandera=$4, tipo=$5 where id=$6 RETURNING *',
        values: [req.body.mmsi, req.body.imo, req.body.nombre, req.body.bandera, req.body.tipo, req.body.id],
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
    client.query('SELECT * FROM public.naves', "", function (err, result) {
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
    client.query('SELECT * FROM public.naves where id = $1', [req.params.id], function (err, result) {
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
        client.query('DELETE FROM public.naves where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "LA NAVE FUE ELIMINADA CORRECTAMENTE",
                success:true
              });
        });
    };
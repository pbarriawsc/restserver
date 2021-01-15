const client = require('../config/db.client');

exports.list = (req, res) => {
    client.query('SELECT * FROM public.contenedor ORDER BY id DESC', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
};

exports.create = (req, res) => {
    // Validate request
    if (!req.body.codigo) {
      res.status(400).send({
        message: "El codigo es obligatorio",
        success:false
      });
      return;
    }

    const query = {
        text: 'INSERT INTO public.contenedor(codigo, reserva,viaje,volumen,estado) VALUES($1, $2, $3,$4,$5) RETURNING *',
        values: [req.body.codigo, req.body.reserva,req.body.viaje,req.body.volumen,req.body.estado],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
};

exports.update = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }
    const query = {
        text: 'UPDATE public.contenedor SET codigo=$1,reserva=$2,viaje=$3,estado=$4,volumen=$5 WHERE id=$6 RETURNING *',
        values: [req.body.codigo, req.body.reserva,req.body.viaje,req.body.estado,req.body.volumen,req.body.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
};

exports.delete = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }
    client.query('DELETE FROM public.contenedor where id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send({
            message: "El contenedor ha sido eliminado correctamente",
            success:true
            });
    });
};
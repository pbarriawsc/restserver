const client = require('../config/db.client');
const moment=require('moment');
const jwt=require('jsonwebtoken');
exports.list = (req, res) => {
	if (!req.params.id) {
      res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }
    client.query('SELECT o.*,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos FROM public.tracking_observaciones o inner join public.usuario u ON u.id = o.fk_usuario where o.fk_tracking=$1 ORDER BY h.id DESC', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
        res.end();
        res.connection.destroy();
    });   
};

exports.create = (req, res) => {
    if (!req.params.id) {
      res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }else if(!req.body.observacion){
       res.status(400).send({
        message: "La observacion es obligatoria",
        success:false
      });
      return; 
    }

    let token= req.get('Authorization');
    jwt.verify(token, process.env.SECRET, (err,decoded)=>{
    if(err){
        return res.status(401).json({
            success:false,
            err
        })
    }
    req.usuario = decoded.usuario;
    });

    const query={
        text:'INSERT INTO public.tracking_observaciones(fecha, observacion, fk_usuario, fk_tracking) VALUES($1,$2,$3,$4)',
        values:[moment().format('YYYYMMDD HHmmss'),req.body.observacion,req.usuario.id,req.params.id]
    }

    client.query(query,"",function (err, result) {
        if (err) {
          console.log(err);
          res.status(400).send(err);
        }   
    });
    res.status(200).send(result.rows[0]);
    res.end();
    res.connection.destroy();
};
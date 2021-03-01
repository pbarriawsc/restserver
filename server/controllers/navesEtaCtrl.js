const client = require('../config/db.client');

exports.findOneBy = (req,res) =>{
    if (!req.params.fk_nave) {
        res.status(400).send({
            message: "El id de la nave es obligatorio",
            success:false
            });
            return;
    }
    client.query('SELECT ne.*,p.nombre as fk_puerto_nombre FROM public.naves_eta ne left join puertos p on p.id=ne.fk_puerto where ne.fk_nave = $1 and ne.estado=0 LIMIT 1', [req.params.fk_nave], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
};

exports.create = (req, res) => {
    // Validate request
    if (!req.body.fk_nave) {
      res.status(400).send({
        message: "La nave es obligatoria",
        success:false
      });
      return;
    }

    const query = {
        text: 'INSERT INTO public.naves_eta(fk_nave,viaje_id,fk_puerto,eta_fecha,eta_hora,staa_fecha,staa_hora,stab_fecha,stab_hora,etd_fecha,etd_hora,estado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
        values: [req.body.fk_nave, req.body.viaje_id,req.body.fk_puerto,req.body.eta_fecha,req.body.eta_hora,req.body.staa_fecha,req.body.staa_hora,req.body.stab_fecha,req.body.stab_hora,req.body.etd_fecha,req.body.etd_hora,req.body.estado],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
};

exports.update = (req, res) => {
    // Validate request
    if (!req.params.id) {
      res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }

     const query = {
        text: 'UPDATE public.naves_eta SET fk_nave=$1,viaje_id=$2,fk_puerto=$3,eta_fecha=$4,eta_hora=$5,staa_fecha=$6,staa_hora=$7,stab_fecha=$8,stab_hora=$9,etd_fecha=$10,etd_hora=$11,estado=$12 WHERE id=$13 RETURNING *',
        values: [req.body.fk_nave, req.body.viaje_id,req.body.fk_puerto,req.body.eta_fecha,req.body.eta_hora,req.body.staa_fecha,req.body.staa_hora,req.body.stab_fecha,req.body.stab_hora,req.body.etd_fecha,req.body.etd_hora,req.body.estado,req.params.id],
    };


    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
};
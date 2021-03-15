const client = require('../config/db.client');
const moment=require('moment');
const jwt=require('jsonwebtoken');

exports.list = (req, res) => {
    client.query('SELECT c.*,(SELECT count(id) FROM public.contenedor_historial WHERE fk_contenedor=c.id)::integer AS historial,n.nave_nombre as fk_nave_nombre,ne.eta_fecha,ne.eta_hora,ne.etd_fecha,ne.etd_hora FROM public.contenedor c LEFT JOIN public.naves2 n on n.nave_id=c.fk_nave LEFT JOIN public.naves_eta ne on ne.fk_nave=c.fk_nave ORDER BY id DESC', "", function (err, result) {
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

exports.updateShipEta =(req,res)=>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

    const query0={
        text: 'SELECT id,fk_nave,fk_nave_eta FROM public.contenedor WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query0,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }

        if(result.rows.length>0 && result.rows[0].fk_nave!==null){
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
            const queryH={
                text: 'INSERT INTO public.contenedor_historial(fk_usuario,fk_contenedor,fk_nave_1,fk_nave_eta_1,fk_nave_2,fk_nave_eta_2,fecha) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                values: [req.usuario.id,req.params.id,result.rows[0].fk_nave, result.rows[0].fk_nave_eta,req.body.fk_nave, req.body.fk_nave_eta,moment().format('YYYYMMDD HHmmss')],
            };
            client.query(queryH,"",function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            //res.status(200).send(result.rows[0]);
            });
        }

        const query = {
        text: 'UPDATE public.contenedor SET fk_nave=$1,fk_nave_eta=$2 WHERE id=$3 RETURNING *',
        values: [req.body.fk_nave, req.body.fk_nave_eta,req.params.id],
        };

        client.query(query,"",function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows[0]);
        });
    });

    
}

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
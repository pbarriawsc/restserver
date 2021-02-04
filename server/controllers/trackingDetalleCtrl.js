const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const moment=require('moment');
exports.update = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }
    const query = {
        text: 'UPDATE public.tracking_detalle SET fecha_recepcion=$1,tipo_producto=$2,producto=$3,peso=$4,observacion=$5,tracking_id=$6,estado=$7,fecha_consolidado=$8 WHERE id=$9 RETURNING *',
		values: [req.body.fecha_recepcion, req.body.tipo_producto,req.body.producto,req.body.peso,req.body.observacion,req.body.tracking_id,req.body.estado,moment().format('YYYYMMDD HHmmss'),req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }

        if(req.body.estado===1 || req.body.estado==='1'){//estoy consolidando cargas
	        client.query('SELECT * FROM public.tracking_detalle where tracking_id=$1 and estado=0',[req.body.tracking_id], function (err, result) {
		        if (err) {
		            console.log(err);
		            res.status(400).send(err);
		        }

		        if(result.rows.length===0){//verifico que no existan detalles pendientes, si es asi, debo cambiar el estado del encabezado a completado
		        	const query2 = {
				        text: 'UPDATE public.tracking SET estado=$1 WHERE id=$2 RETURNING *',
						values: [1, req.body.tracking_id],
				    };

				    client.query(query2,"",function (err, result) {
				        if (err) {
				            console.log(err);
				            res.status(400).send(err);
				        }
				     });

		        }
	    	});  

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

	    	const query4={
	    		text:'INSERT INTO public.tracking_historial(fecha, accion, observacion, fk_usuario, fk_tracking) VALUES($1,$2,$3,$4,$5)',
	    		values:[moment().format('YYYYMMDD HHmmss'),'PUT','Consolidación de carga',req.usuario.id,req.body.tracking_id]
	    	}

	    	client.query(query4,"",function (err, result) {
				if (err) {
	              console.log(err);
	              res.status(400).send(err);
	            }	
			});
    	}
        res.status(200).send(result.rows[0]);
        res.end();
        res.connection.destroy();
    });
};

exports.uploadFilesDetail = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }else if(!req.params.uploadId) {
        res.status(400).send({
            message: "El id upload es obligatorio",
            success:false
            });
            return;
    }

    let queryValues=[null,null,null,req.params.id,req.params.uploadId];
    if(req.files.foto1){
    	queryValues[0]=req.files.foto1.data;
    }

    if(req.files.foto2){
    	queryValues[1]=req.files.foto2.data;
    }

    if(req.files.foto3){
    	queryValues[2]=req.files.foto3.data;
    }

	const query = {
        text: 'UPDATE public.tracking_detalle SET foto1=$1,foto2=$2,foto3=$3 WHERE tracking_id=$4 and upload_id=$5 RETURNING *',
        values: queryValues,
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
};

exports.getPhoto1 = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT foto1 from public.tracking_detalle WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].foto1);
    });
};

exports.getPhoto2 = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT foto2 from public.tracking_detalle WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].foto2);
    });
};

exports.getPhoto3 = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT foto3 from public.tracking_detalle WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].foto3);
    });
};
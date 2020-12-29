const client = require('../config/db.client');

exports.update = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }
    const query = {
        text: 'UPDATE public.tracking_detalle SET fecha_recepcion=$1,tipo_producto=$2,producto=$3,peso=$4,observacion=$5,tracking_id=$6,estado=$7 WHERE id=$8 RETURNING *',
		values: [req.body.fecha_recepcion, req.body.tipo_producto,req.body.producto,req.body.peso,req.body.observacion,req.body.tracking_id,req.body.estado,req.params.id],
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
    	}
        res.status(200).send(result.rows[0]);
    });
}
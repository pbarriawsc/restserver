const client = require('../config/db.client');
exports.create = (req, res) => {
    if (!req.body.proveedor_id) {
      res.status(400).send({
        message: "El proveedor es obligatorio",
        success:false
      });
      return;
    }else if (!req.body.fecha_creacion){
        res.status(400).send({
            message: "La fecha de generacion es obligatorio",
            success:false
          });
          return;
    }else if (!req.body.tracking_detalle){
        res.status(400).send({
            message: "El detalle del tracking es obligatorio",
            success:false
          });
          return;
    }

    const query = {
        text: 'INSERT INTO public.tracking(proveedor_id,tipo,fecha_creacion) VALUES($1,$2,$3) RETURNING *',
        values: [req.body.proveedor_id, req.body.tipo,req.body.fecha_creacion],
    };

    client.query(query,"",function (err, result) {
    	const err0=err;
        const result0=result;
        if (err0) {
            console.log(err0);
            res.status(400).send(err0);
        }
       
        if(result.rows && result.rows[0]){
        	if(req.body.tracking_detalle && req.body.tracking_detalle.length>0){
        		for(var i=0;i<req.body.tracking_detalle.length;i++){
        				const query2={
			        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id) VALUES($1, $2,$3,$4,$5,$6) RETURNING *',
			        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,result.rows[0].id],
        				};
        				client.query(query2,"",function (err, result) {
        					if (err) {
		                      console.log(err);
		                      res.status(400).send(err);
		                    }	
        				});
        		}
        	}
        	res.status(200).send(result.rows[0]);
        }
    });
};
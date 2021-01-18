const client = require('../config/db.client');

exports.listByContenedor = (req, res) => {
	if (!req.params.id) {
      res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }
    client.query('SELECT td.*,t.fk_cliente,c.nombre as fk_cliente_nombre,t.fk_proveedor, p.nombre as fk_proveedor_nombre FROM public.contenedor_detalle cd inner join public.tracking_detalle td on td.id=cd.fk_tracking_detalle inner join tracking t on t.id=td.tracking_id left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor where cd.fk_contenedor=$1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
};
exports.create = (req, res) => {
    // Validate request
    if (!req.params.id) {
      res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }

    if(!req.body.detalle){
    	res.status(400).send({
        message: "El detalle es obligatorio",
        success:false
      });
      return;
    }

    let arrayTracking=[];
    for(var i=0;i<req.body.detalle.length;i++){
    	if(arrayTracking.length===0){
    		arrayTracking.push(req.body.detalle[i].tracking_id);
    	}else{
    		const find=arrayTracking.find(x=>x===req.body.detalle[i].tracking_id);
    		if(!find){
    			arrayTracking.push(req.body.detalle[i].tracking_id);
    		}
    	}

    	const query = {
	        text: 'INSERT INTO public.contenedor_detalle(fk_contenedor, fk_tracking_detalle) VALUES($1, $2) RETURNING *',
	        values: [req.params.id,req.body.detalle[i].id],
	    };

	    const query2 ={
	        	text: 'UPDATE public.tracking_detalle SET estado=$2 WHERE id=$1 RETURNING *',
	        	values: [req.body.detalle[i].id,2]
	    };

	    client.query(query,"",function (err, result) {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	       // res.status(200).send(result.rows[0]);
	    });

        client.query(query2,"",function (err, result) {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	        //res.status(200).send(result.rows[0]);
	     });
    }

    /*
    if(arrayTracking.length>0){
    	for(var i=0;i<arrayTracking.length;i++){
    		const query3 = {
		        text: 'UPDATE public.tracking SET estado=$1 WHERE id=$2 RETURNING *',
				values: [2, arrayTracking[i]],
		    };
    		client.query('SELECT * FROM public.tracking_detalle where tracking_id=$1 and estado<2',[arrayTracking[i]], function (err, result) {
		        if (err) {
		            console.log(err);
		            //res.status(400).send(err);
		        }
		        
		        if(result.rows.length===0){//verifico que no existan detalles pendientes, si es asi, debo cambiar el estado del encabezado a completado
		        	client.query(query3,"",function (err, result) {
			        if (err) {
			            console.log(err);
			            res.status(400).send(err);
			        }
				 	});
		        }
	    	});  
    	}
    }

    if(req.body.estado){
        const query4 = {
                text: 'UPDATE public.contenedor SET estado=$1 WHERE id=$2 RETURNING *',
                values: [req.body.estado, req.params.id],
        };
        client.query(query4,"",function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
        });
    }*/
    res.status(200).send({});
};

exports.updateEstadoTracking = (req, res) => {
    if(!req.params.id){
        res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }
    if(!req.body.detalle){
        res.status(400).send({
        message: "El detalle es obligatorio",
        success:false
      });
      return;
    }

    if(!req.body.estado){
        res.status(400).send({
        message: "El estado es obligatorio",
        success:false
      });
      return;
    }

    if(req.body.detalle.length>0){
        for(var i=0;i<req.body.detalle.length;i++){
            const query3 = {
                text: 'UPDATE public.tracking SET estado=$1 WHERE id=$2 RETURNING *',
                values: [2, req.body.detalle[i]],
            };
            client.query('SELECT * FROM public.tracking_detalle where tracking_id=$1 and estado<2',[req.body.detalle[i]], function (err, result) {
                if (err) {
                    console.log(err);
                    //res.status(400).send(err);
                }
                
                if(result.rows.length===0){//verifico que no existan detalles pendientes, si es asi, debo cambiar el estado del encabezado a completado
                    client.query(query3,"",function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    });
                }
            });  
        }
    }

    if(req.body.estado){
        const query4 = {
                text: 'UPDATE public.contenedor SET estado=$1 WHERE id=$2 RETURNING *',
                values: [req.body.estado, req.params.id],
        };
        client.query(query4,"",function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
        });
    }
    res.status(200).send({});
};
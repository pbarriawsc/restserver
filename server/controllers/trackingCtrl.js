const client = require('../config/db.client');
const lodash= require('lodash');
exports.list = (req, res) => {
	const arrayFinal=[];
    client.query('SELECT * FROM public.tracking', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        const resultHeader=result;
        const ids=[];
        if(result.rows.length>0){
        	for(var i=0;i<result.rows.length;i++){
        		ids.push(result.rows[i].id);
        	}

        	let queryIn='';
		        if(ids.length>0){
		        	queryIn+='WHERE tracking_id IN (';
		        	for(var x=0;x<ids.length;x++){
		        		if(x!==ids.length-1){
		        			queryIn+=ids[x]+','
		        		}else{
		        			queryIn+=ids[x]
		        		}
		        	}
		        	queryIn+=')';
		        }

		        let queryFinal='SELECT * FROM public.tracking_detalle '+queryIn;
		        client.query(queryFinal, "", function (err, result) {
			        if (err) {
			            console.log(err);
			            res.status(400).send(err);
			        }
			        if(resultHeader.rows.length>0){
			        	for(var i=0;i<resultHeader.rows.length;i++){
			        		const obj=lodash.cloneDeep(resultHeader.rows[i]);
			        		const arrayFind=result.rows.filter(y=>y.tracking_id===resultHeader.rows[i].id);
			        		if(arrayFind){
			        			obj.tracking_detalle=arrayFind;
			        		}else{
			        			obj.tracking_detalle=[];
			        		}
			        		arrayFinal.push(obj);
			        	}
		        		res.status(200).send(arrayFinal);
			        }
		        });
        }else{
        	res.status(200).send(arrayFinal);
        }
    });   
  };

exports.listByClient = (req, res) => {
	const arrayFinal=[];
    client.query('SELECT * FROM public.tracking where fk_cliente=$1', [parseInt(req.params.id)], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        const resultHeader=result;
        const ids=[];
        if(result.rows.length>0){
        	for(var i=0;i<result.rows.length;i++){
        		ids.push(result.rows[i].id);
        	}

        	let queryIn='';
	        if(ids.length>0){
	        	queryIn+='WHERE tracking_id IN (';
	        	for(var x=0;x<ids.length;x++){
	        		if(x!==ids.length-1){
	        			queryIn+=ids[x]+','
	        		}else{
	        			queryIn+=ids[x]
	        		}
	        	}
	        	queryIn+=')';
	        }

	        let queryFinal='SELECT * FROM public.tracking_detalle '+queryIn;
	        client.query(queryFinal, "", function (err, result) {
		        if (err) {
		            console.log(err);
		            res.status(400).send(err);
		        }
		        if(resultHeader.rows.length>0){
		        	for(var i=0;i<resultHeader.rows.length;i++){
		        		const obj=lodash.cloneDeep(resultHeader.rows[i]);
		        		const arrayFind=result.rows.filter(y=>y.tracking_id===resultHeader.rows[i].id);
		        		if(arrayFind){
		        			obj.tracking_detalle=arrayFind;
		        		}else{
		        			obj.tracking_detalle=[];
		        		}
		        		arrayFinal.push(obj);
		        	}
	        		res.status(200).send(arrayFinal);
		        }
	        });
        }else{
        	res.status(200).send(arrayFinal);
        } 
    });   
  };

exports.create = (req, res) => {
	let proveedorId;
    if (!req.body.proveedor) {
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

    if(req.body.proveedor){
    	if(parseInt(req.body.proveedor.id)===0){
    		const query0 = {
		        text: 'INSERT INTO public.proveedores(codigo, nombre) VALUES($1, $2) RETURNING *',
		        values: [req.body.proveedor.codigo, req.body.proveedor.nombre],
		    };

		    client.query(query0,"",function (err, result) {
	    	const err0=err;
	        const result0=result;
	        if (err0) {
	            console.log(err0);
	            res.status(400).send(err0);
	        }
	        const query = {
		        text: 'INSERT INTO public.tracking(fk_proveedor,tipo,fecha_creacion,estado) VALUES($1,$2,$3,$4) RETURNING *',
		        values: [result.rows[0].id, req.body.tipo,req.body.fecha_creacion,req.body.estado],
		    	};

			    client.query(query,"",function (err, result) {
			    	const err1=err;
			        const result1=result;
			        if (err1) {
			            console.log(err1);
			            res.status(400).send(err1);
			        }
			       
			        if(result.rows && result.rows[0]){
			        	if(req.body.tracking_detalle && req.body.tracking_detalle.length>0){
			        		for(var i=0;i<req.body.tracking_detalle.length;i++){
			        				const query2={
						        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado) VALUES($1, $2,$3,$4,$5,$6,$7) RETURNING *',
						        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,result.rows[0].id,req.body.tracking_detalle[i].estado],
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
	        });
    	}else{
    		const query = {
		        text: 'INSERT INTO public.tracking(fk_proveedor,tipo,fecha_creacion,estado) VALUES($1,$2,$3,$4) RETURNING *',
		        values: [req.body.proveedor.id, req.body.tipo,req.body.fecha_creacion,req.body.estado],
		    	};

			    client.query(query,"",function (err, result) {
			    	const err1=err;
			        const result1=result;
			        if (err1) {
			            console.log(err1);
			            res.status(400).send(err1);
			        }
			       
			        if(result.rows && result.rows[0]){
			        	if(req.body.tracking_detalle && req.body.tracking_detalle.length>0){
			        		for(var i=0;i<req.body.tracking_detalle.length;i++){
			        				const query2={
						        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado) VALUES($1, $2,$3,$4,$5,$6,$7) RETURNING *',
						        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,result.rows[0].id,req.body.tracking_detalle[i].estado],
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
    	}
    }
    
};
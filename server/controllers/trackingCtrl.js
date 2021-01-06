const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const moment=require('moment');
exports.list = (req, res) => {
	const arrayFinal=[];
    client.query('SELECT T.*, c.codigo as fk_cliente_codigo,c.nombre as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor ORDER BY T.id DESC', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        const resultHeader=result;
        const ids=[];
        const idsClientes=[];
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
		        		
			        }



			        res.status(200).send(arrayFinal);
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
    if (!req.body.fecha_creacion){
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
    	if(parseInt(req.body.proveedor.id)===0 && req.body.proveedor.nombre.length>0){
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
			        	const query3={
			        		text:'INSERT INTO public.tracking_historial(fecha, accion, observacion, fk_usuario, fk_tracking) VALUES($1,$2,$3,$4,$5)',
			        		values:[req.body.fecha_creacion,'POST','Creación del registro de carga',req.usuario.id,result.rows[0].id]
			        	}

			        	client.query(query3,"",function (err, result) {
        					if (err) {
		                      console.log(err);
		                      res.status(400).send(err);
		                    }	
        				});
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
			        	const query3={
			        		text:'INSERT INTO public.tracking_historial(fecha, accion, observacion, fk_usuario, fk_tracking) VALUES($1,$2,$3,$4,$5)',
			        		values:[req.body.fecha_creacion,'POST','Creación del registro de carga',req.usuario.id,result.rows[0].id]
			        	}

			        	client.query(query3,"",function (err, result) {
        					if (err) {
		                      console.log(err);
		                      res.status(400).send(err);
		                    }	
        				});
			        	res.status(200).send(result.rows[0]);
			        }
			    });
    	}
    }else{
    	var textQuery='INSERT INTO public.tracking(tipo,fecha_creacion,estado) VALUES($1,$2,$3) RETURNING *';
    	var valuesQuery=[req.body.tipo,req.body.fecha_creacion,req.body.estado];
    	if(req.body.fk_cliente){
    		textQuery='INSERT INTO public.tracking(tipo,fecha_creacion,estado,fk_cliente) VALUES($1,$2,$3,$4) RETURNING *'
    		valuesQuery=[req.body.tipo,req.body.fecha_creacion,req.body.estado,req.body.fk_cliente];
    	}
    	const query = {
		        text: textQuery,
		        values: valuesQuery,
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
			        	const query3={
			        		text:'INSERT INTO public.tracking_historial(fecha, accion, observacion, fk_usuario, fk_tracking) VALUES($1,$2,$3,$4,$5)',
			        		values:[req.body.fecha_creacion,'POST','Creación del registro de carga',req.usuario.id,result.rows[0].id]
			        	}

			        	client.query(query3,"",function (err, result) {
        					if (err) {
		                      console.log(err);
		                      res.status(400).send(err);
		                    }	
        				});
			        	res.status(200).send(result.rows[0]);
			        }
			    });
    }
    
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
        text: 'UPDATE public.tracking SET tipo=$1,estado=$2,fk_cliente=$3,fk_proveedor=$4,fecha_recepcion=$5,cantidad_bultos=$6,peso=$7,volumen=$8,tipo_carga=$9 WHERE id=$10 RETURNING *',
        values: [req.body.tipo, req.body.estado, req.body.fk_cliente, req.body.fk_proveedor,req.body.fecha_recepcion,req.body.cantidad_bultos,req.body.peso,req.body.volumen,req.body.tipo_carga,req.body.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }

        if(req.body.tracking_detalle && req.body.tracking_detalle.length>0){
    		for(var i=0;i<req.body.tracking_detalle.length;i++){
    			if(req.body.tracking_detalle[i].id===0){
    				const query2={
		        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado) VALUES($1, $2,$3,$4,$5,$6,$7) RETURNING *',
		        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,req.params.id,req.body.tracking_detalle[i].estado],
    				};
    				client.query(query2,"",function (err, result) {
    					if (err) {
	                      console.log(err);
	                      res.status(400).send(err);
	                    }	
    				});
    			}else{
    				const query2={
		        		text: 'UPDATE public.tracking_detalle SET fecha_recepcion=$1,tipo_producto=$2,producto=$3,peso=$4,observacion=$5,tracking_id=$6,estado=$7 WHERE id=$8 RETURNING *',
		        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,req.params.id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].id],
    				};
    				client.query(query2,"",function (err, result) {
    					if (err) {
	                      console.log(err);
	                      res.status(400).send(err);
	                    }	
    				});
    			}	

    		}
    	}

    	if(req.body.delete_tracking_detalle && req.body.delete_tracking_detalle.length>0){
    		console.log('borrando');
    		for(var i=0;i<req.body.delete_tracking_detalle.length;i++){
    			console.log('id:',req.body.delete_tracking_detalle[i]);
    			const query3={
		        		text: 'DELETE FROM public.tracking_detalle WHERE id=$1',
		        		values: [req.body.delete_tracking_detalle[i]],
    				};
    				client.query(query3,"",function (err, result) {
    					if (err) {
	                      console.log(err);
	                      res.status(400).send(err);
	                    }	
    				});
    		}
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

    	const query4={
    		text:'INSERT INTO public.tracking_historial(fecha, accion, observacion, fk_usuario, fk_tracking) VALUES($1,$2,$3,$4,$5)',
    		values:[moment().format('YYYYMMDD HHmmss'),'PUT','Actualización del registro de carga',req.usuario.id,result.rows[0].id]
    	}

    	client.query(query4,"",function (err, result) {
			if (err) {
              console.log(err);
              res.status(400).send(err);
            }	
		});
        res.status(200).send(result.rows[0]);
    });
};

exports.uploadFiles = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'UPDATE public.tracking SET foto1=$1 WHERE id=$2 RETURNING *',
        values: [req.files.foto1.data,req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        console.log('files',req.files);
        res.status(200).send(result.rows[0]);
    });
};

exports.uploadFiles = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'UPDATE public.tracking SET foto1=$1 WHERE id=$2 RETURNING *',
        values: [req.files.foto1.data,req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        console.log('files',req.files);
        res.status(200).send(result.rows[0]);
    });
};


exports.getImage = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT foto1 from public.tracking WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        console.log(result);
        res.end(result.rows[0].foto1);
    });
};
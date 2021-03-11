const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const moment=require('moment');
exports.list = (req, res) => {
	try{
	const arrayFinal=[];
    client.query('SELECT T.*,ct.fk_consolidado,c.codigo as fk_cliente_codigo,c.nombre as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos,(SELECT count(id) FROM public.tracking_observaciones WHERE fk_tracking=T.id)::integer AS observaciones FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor left join public.consolidado_tracking ct on ct.fk_tracking=t.id where t.estado<2 ORDER BY T.id DESC', "", function (err, result) {
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

		        let queryFinal="SELECT id,upload_id,fecha_recepcion,fecha_consolidado,codigo_interno,tipo_producto,producto,peso,volumen,observacion,tracking_id,estado,CASE WHEN foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,ancho,alto,altura,ubicacion FROM public.tracking_detalle "+queryIn;
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
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
  };

  exports.listById = (req, res) => {
	try{
	if (!req.params.id){
        	res.status(400).send({
            message: "El id es obligatorio",
            success:false
          });
          return;
    }
    client.query('SELECT T.*, c.codigo as fk_cliente_codigo,c.nombre as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos,(SELECT count(id) FROM public.tracking_observaciones WHERE fk_tracking=T.id)::integer AS observaciones FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor where t.id=$1 ORDER BY T.id DESC', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        const resultHeader=lodash.cloneDeep(result) ;
		let queryFinal="SELECT id,upload_id,fecha_recepcion,fecha_consolidado,codigo_interno,tipo_producto,producto,peso,volumen,observacion,tracking_id,estado,CASE WHEN foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,ancho,alto,altura,ubicacion FROM public.tracking_detalle where tracking_id=$1";
		        client.query(queryFinal, [req.params.id], function (err2, result2) {
			        if (err2) {
			            console.log(err2);
			            res.status(400).send(err2);
			        }
			        
			        if(result2.rows && result2.rows.length>0){
			        	resultHeader.rows[0].tracking_detalle=result2.rows;
			        }

			        res.status(200).send(resultHeader.rows[0]);
		        });
    });   
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
  };

  exports.listByEstado = (req, res) => {
  	try{
	const arrayFinal=[];
    client.query('SELECT T.*, c.codigo as fk_cliente_codigo,c.nombre as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor where t.estado=$1 ORDER BY T.prioridad DESC', [req.params.estado], function (err, result) {
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

		        let queryFinal="SELECT id,upload_id,fecha_recepcion,fecha_consolidado,codigo_interno,tipo_producto,producto,peso,volumen,observacion,tracking_id,estado,CASE WHEN foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,ancho,alto,altura,ubicacion FROM public.tracking_detalle "+queryIn;
		        if(req.params.estado===1 || req.params.estado==='1'){
		        	queryFinal+=' and estado<2';
		        }
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
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
  };

exports.listByReadyToCharge = (req, res) => {
  	try{
	const arrayFinal=[];
    client.query('SELECT T.*, c.codigo as fk_cliente_codigo,c.nombre as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor inner join public.consolidado_tracking cst on cst.id=t.fk_consolidado_tracking where t.estado=$1 AND t.fk_propuesta is not null AND t.fk_consolidado_tracking is not null and cst.estado=1 ORDER BY T.prioridad ASC',[req.params.estado], function (err, result) {
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

		        let queryFinal="SELECT id,upload_id,fecha_recepcion,fecha_consolidado,codigo_interno,tipo_producto,producto,peso,volumen,observacion,tracking_id,estado,CASE WHEN foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,ancho,alto,altura,ubicacion FROM public.tracking_detalle "+queryIn;
		        if(req.params.estado===1 || req.params.estado==='1'){
		        	queryFinal+=' and estado=1 and fk_consolidado_tracking_detalle is not null';
		        }
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
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
  };
exports.listByClient = (req, res) => {
	try{
	const arrayFinal=[];
    client.query('SELECT T.*,ct.fk_consolidado, c.codigo as fk_cliente_codigo,c.nombre as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor left join public.consolidado_tracking ct on ct.fk_tracking=t.id where t.fk_cliente=$1 AND t.estado<2 ORDER BY T.id DESC', [parseInt(req.params.id)], function (err, result) {
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

	        let queryFinal="SELECT id,upload_id,fecha_recepcion,fecha_consolidado,codigo_interno,tipo_producto,producto,peso,volumen,observacion,tracking_id,estado,CASE WHEN foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,ancho,alto,altura,ubicacion FROM public.tracking_detalle "+queryIn;
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
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
  };

exports.create = (req, res) => {
	try{
    if (!req.body.fecha_creacion){
        res.status(400).send({
            message: "La fecha de generacion es obligatorio",
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
	        console.log('aqui 1');
	        const query = {
		        text: 'INSERT INTO public.tracking(fk_proveedor,tipo,fecha_creacion,estado,fk_cliente,fecha_recepcion,cantidad_bultos,peso,volumen,tipo_carga,currier) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
		        values: [result.rows[0].id,req.body.tipo,req.body.fecha_creacion,req.body.estado,req.body.fk_cliente,req.body.fecha_recepcion,req.body.cantidad_bultos,req.body.peso,req.body.volumen,req.body.tipo_carga,req.body.currier],
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
						        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado,volumen,upload_id,ancho,alto,altura,codigo_interno,ubicacion) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *',
						        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,result.rows[0].id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].volumen,req.body.tracking_detalle[i].upload_id,req.body.tracking_detalle[i].ancho,req.body.tracking_detalle[i].alto,req.body.tracking_detalle[i].altura,req.body.tracking_detalle[i].codigo_interno,req.body.tracking_detalle[i].ubicacion],
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
    		console.log('aqui 2');
    		const query = {
		        text: 'INSERT INTO public.tracking(fk_proveedor,tipo,fecha_creacion,estado,fk_cliente,fecha_recepcion,cantidad_bultos,peso,volumen,tipo_carga,currier) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
		        values: [req.body.proveedor.id, req.body.tipo,req.body.fecha_creacion,req.body.estado,req.body.fk_cliente,req.body.fecha_recepcion,req.body.cantidad_bultos,req.body.peso,req.body.volumen,req.body.tipo_carga,req.body.currier],
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
						        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado,volumen,upload_id,ancho,alto,altura,codigo_interno,ubicacion) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *',
						        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,result.rows[0].id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].volumen,req.body.tracking_detalle[i].upload_id,req.body.tracking_detalle[i].ancho,req.body.tracking_detalle[i].alto,req.body.tracking_detalle[i].altura,req.body.tracking_detalle[i].codigo_interno,req.body.tracking_detalle[i].ubicacion],
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
    	console.log('aqui 3');
    	var textQuery='INSERT INTO public.tracking(tipo,fecha_creacion,estado,fk_cliente,fecha_recepcion,cantidad_bultos,peso,volumen,tipo_carga,fk_proveedor,currier) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';
    	var valuesQuery=[req.body.tipo,req.body.fecha_creacion,req.body.estado,req.body.fk_cliente,req.body.fecha_recepcion,req.body.cantidad_bultos,req.body.peso,req.body.volumen,req.body.tipo_carga,req.body.fk_proveedor,req.body.currier];
    	if(req.body.fk_cliente){
    		console.log('aqui 4');
    		textQuery='INSERT INTO public.tracking(tipo,fecha_creacion,estado,fk_cliente,fecha_recepcion,cantidad_bultos,peso,volumen,tipo_carga,fk_proveedor,currier) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *'
    		valuesQuery=[req.body.tipo,req.body.fecha_creacion,req.body.estado,req.body.fk_cliente,req.body.fecha_recepcion,req.body.cantidad_bultos,req.body.peso,req.body.volumen,req.body.tipo_carga,req.body.fk_proveedor,req.body.currier];
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
						        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado,volumen,upload_id,ancho,alto,altura,codigo_interno,ubicacion) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *',
						        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,result.rows[0].id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].volumen,req.body.tracking_detalle[i].upload_id,req.body.tracking_detalle[i].ancho,req.body.tracking_detalle[i].alto,req.body.tracking_detalle[i].altura,req.body.tracking_detalle[i].codigo_interno,req.body.tracking_detalle[i].ubicacion],
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
    
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

exports.update = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

    const fechaRecepcion=(req.body.fecha_recepcion && req.body.fecha_recepcion!==null) ? req.body.fecha_recepcion:moment().format('YYYYMMDD HHmmss');
    const query = {
        text: 'UPDATE public.tracking SET tipo=$1,estado=$2,fk_cliente=$3,fk_proveedor=$4,fecha_recepcion=$5,cantidad_bultos=$6,peso=$7,volumen=$8,tipo_carga=$9,currier=$10,prioridad=$11 WHERE id=$12 RETURNING *',
        values: [req.body.tipo, req.body.estado, req.body.fk_cliente, req.body.fk_proveedor,fechaRecepcion,req.body.cantidad_bultos,req.body.peso,req.body.volumen,req.body.tipo_carga,req.body.currier,req.body.prioridad,req.body.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }

        if(req.body.tracking_detalle && req.body.tracking_detalle.length>0){
    		for(var i=0;i<req.body.tracking_detalle.length;i++){
    			if(req.body.tracking_detalle[i].id===0){
    				let fechaConsolidado=null;
    				if(req.body.tracking_detalle[i].fk_consolidado>0){
    					fechaConsolidado=moment().format('YYYYMMDD HHmmss');
    				}
    				const query2={
		        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado,volumen,upload_id,ancho,alto,altura,codigo_interno,fecha_consolidado,ubicacion) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *',
		        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,req.params.id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].volumen,req.body.tracking_detalle[i].upload_id,req.body.tracking_detalle[i].ancho,req.body.tracking_detalle[i].alto,req.body.tracking_detalle[i].altura,req.body.tracking_detalle[i].codigo_interno,fechaConsolidado,req.body.tracking_detalle[i].ubicacion],
    				};

    				const values21=[req.body.tracking_detalle[i].fk_consolidado,req.body.id,null,0];
    				const values22=[0,0];
    				
    				client.query(query2,"",function (err, result) {
    					if (err) {
	                      console.log(err);
	                      res.status(400).send(err);
	                    }	

	                    if(values21[0]>0 && result.rows && result.rows.length>0){
	                    	values21[2]=result.rows[0].id;
	                    	values22[1]=result.rows[0].id;
	    					const query21={
					            text: 'INSERT INTO public.consolidado_tracking_detalle(fk_consolidado,fk_tracking,fk_tracking_detalle,estado) VALUES($1, $2,$3,$4) RETURNING *',
					            values: values21
					          };
					        client.query(query21,"",function (err21, result21) {
		    					if (err21) {
			                      console.log(err21);
			                      res.status(400).send(err21);
			                    }	

			                     values22[0]=result21.rows[0].id;
			                     const query22 = {
			                            text: 'UPDATE public.tracking_detalle SET fk_consolidado_tracking_detalle=$1 WHERE id=$2 RETURNING *',
			                            values: values22,
			                      };

			                      client.query(query22,"",function (err22, result22) {
			    					if (err22) {
				                      console.log(err22);
				                      res.status(400).send(err22);
				                    }	
				                	});
		                	});
    					}
    				});
    				
    				
    			}else{
    				const query2={
		        		text: 'UPDATE public.tracking_detalle SET fecha_recepcion=$1,tipo_producto=$2,producto=$3,peso=$4,observacion=$5,tracking_id=$6,estado=$7,volumen=$8,upload_id=$9,ancho=$10,alto=$11,altura=$12,codigo_interno=$13,ubicacion=$14 WHERE id=$15 RETURNING *',
		        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,req.params.id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].volumen,req.body.tracking_detalle[i].upload_id,req.body.tracking_detalle[i].ancho,req.body.tracking_detalle[i].alto,req.body.tracking_detalle[i].altura,req.body.tracking_detalle[i].codigo_interno,req.body.tracking_detalle[i].ubicacion,req.body.tracking_detalle[i].id],
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
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

     }
};


exports.uploadFiles = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

    let queryValues=[null,null,null,null,null,req.params.id]
    if(req.files.foto1){
    	queryValues[0]=req.files.foto1.data;
    }

    if(req.files.foto2){
    	queryValues[1]=req.files.foto2.data;
    }

    if(req.files.foto3){
    	queryValues[2]=req.files.foto3.data;
    }

    if(req.files.foto4){
    	queryValues[3]=req.files.foto4.data;
    }

    if(req.files.foto5){
    	queryValues[4]=req.files.foto5.data;
    }

	const query = {
        text: 'UPDATE public.tracking SET foto1=$1,foto2=$2,foto3=$3,foto4=$4,foto5=$5 WHERE id=$6 RETURNING *',
        values: queryValues,
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};


exports.getPhoto1 = (req,res) =>{
	try{
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
        res.end(result.rows[0].foto1);
    });
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

exports.getPhoto2 = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT foto2 from public.tracking WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].foto2);
    });
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

exports.getPhoto3 = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT foto3 from public.tracking WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].foto3);
    });
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

exports.getPhoto4 = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT foto4 from public.tracking WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].foto4);
    });
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

exports.getPhoto5 = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT foto5 from public.tracking WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].foto5);
    });
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

exports.uploadFilesPackingInvoice = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

    let queryValues=[null,null,null,null,req.params.id];
    if(req.files.packingList1){
    	queryValues[0]=req.files.packingList1.data;
    }

    if(req.files.packingList2){
    	queryValues[1]=req.files.packingList2.data;
    }

    if(req.files.invoice1){
    	queryValues[2]=req.files.invoice1.data;
    }

    if(req.files.invoice2){
    	queryValues[3]=req.files.invoice2.data;
    }



	const query = {
        text: 'UPDATE public.tracking SET packing_list1=$1,packing_list2=$2,invoice1=$3,invoice2=$4 WHERE id=$5 RETURNING *',
        values: queryValues,
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });

    } catch (error) {

            res.status(400).send({
                message: "ERROR: "+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

exports.getPackingList1 = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT packing_list1 from public.tracking WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].packing_list1);
    });

    } catch (error) {

            res.status(400).send({
                message: "ERROR: "+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

exports.getPackingList2 = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT packing_list2 from public.tracking WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].packing_list2);
    });
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

    }
};

exports.getInvoice1 = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT invoice1 from public.tracking WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].invoice1);
    });
    } catch (error) {

            res.status(400).send({
                message: "ERROR: "+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

exports.getInvoice2 = (req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

	const query = {
        text: 'SELECT invoice2 from public.tracking WHERE id=$1',
        values: [req.params.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.end(result.rows[0].invoice2);
    });
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

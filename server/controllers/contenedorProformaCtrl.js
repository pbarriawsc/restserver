const client = require('../config/db.client');
const moment=require('moment');
const jwt=require('jsonwebtoken');
const lodash=require('lodash');

exports.listByEstado = (req, res) => {
	try{
	if (!req.params.estado) {
      res.status(400).send({
        message: "El estado es obligatorio",
        success:false
      });
      return;
    }
    let arrayFinal=[];
    client.query('SELECT cp.*,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos FROM public.contenedor_proforma cp inner join usuario u on u.id=cp.fk_usuario_creacion where cp.estado=$1 ORDER BY cp.id DESC', [req.params.estado], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }

        const ids=[];
        if(result.rows.length>0){
        	for(var i=0;i<result.rows.length;i++){
        		ids.push(result.rows[i].id);
        	}

        	let queryIn='';
	        if(ids.length>0){
	        	queryIn+='WHERE cpd.fk_contenedor_proforma IN (';
	        	for(var x=0;x<ids.length;x++){
	        		if(x!==ids.length-1){
	        			queryIn+=ids[x]+','
	        		}else{
	        			queryIn+=ids[x]
	        		}
	        	}
	        	queryIn+=')';
	        }

	        let queryFinal='SELECT cpd.*,td.fecha_recepcion,td.fecha_consolidado,td.tipo_producto,td.producto,td.peso,td.volumen,td.ubicacion,td.codigo_interno,t.fk_cliente,t.fk_proveedor,c.codigo as fk_cliente_codigo, c."razonSocial" as fk_cliente_razonsocial,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre, p."nombreChi" as fk_proveedor_nombre_chi  FROM public.contenedor_proforma_detalle cpd inner join public.tracking_detalle td on td.id=cpd.fk_tracking_detalle inner join public.tracking t on t.id=td.tracking_id inner join public.clientes c on c.id=t.fk_cliente inner join public.proveedores p on p.id=t.fk_proveedor '+queryIn;
	        console.log('queryFinal',queryFinal);
	        client.query(queryFinal, "", function (err2, result2) {
			        if (err2) {
			            console.log(err2);
			            res.status(400).send(err2);
			        }
			        for(var i=0;i<result.rows.length;i++){
			        		const obj=lodash.cloneDeep(result.rows[i]);
			        		const arrayFind=result2.rows.filter(y=>y.fk_contenedor_proforma===result.rows[i].id);
			        		if(arrayFind){
			        			obj.detalle=arrayFind;
			        		}else{
			        			obj.detalle=[];
			        		}
			        		arrayFinal.push(obj);
			        }
			        res.status(200).send(arrayFinal);
        			res.end(); res.connection.destroy();
			  });
        }else{
        	res.status(200).send(arrayFinal);
        	res.end(); res.connection.destroy();
        }
    }); 

    } catch (error) {
        console.log('ERROR GetContenedorProformaByEstado'+error);
        res.status(400).send({
        message: "Problemas al obtener las proformas de contenedor",
        success:false,}); res.end(); res.connection.destroy();
    }  
};

exports.create = async (req,res) =>{
	try{

		if (!req.body.detalle) {
	      res.status(400).send({
	        message: "El detalle es obligatorio",
	        success:false
	      });
	      return;
	    }

		if(req.body.detalle){

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
			
			const query1={
		        text: 'INSERT INTO public.contenedor_proforma(fk_usuario_creacion, fecha_creacion,estado) VALUES($1, $2, $3) RETURNING *',
		        values: [req.usuario.id,moment().format('YYYYMMDD HHmmss'),0]
	    	};

	    	const result1=await client.query(query1);
	    	if(result1 && result1.rows.length>0){
	    		for(let i=0;i<req.body.detalle.length;i++){
	    			let query2={
				        text: 'INSERT INTO public.contenedor_proforma_detalle(fk_contenedor_proforma, fk_tracking_detalle,estado) VALUES($1, $2, $3) RETURNING *',
				        values: [result1.rows[0].id,req.body.detalle[i],0]
	    			};
	    			let result2=await client.query(query2);
	    			if(result2 && result2.rows.length>0){

	    			}else{
	    				console.log('ERROR PostContenedorProformaDetalle'+error);
	    			}
	    		}
	    		res.status(200).send(result1.rows);
	    		res.end(); res.connection.destroy();
	    	}else{
	    		console.log('ERROR PostContenedorProforma'+error);
		        res.status(400).send({
		        message: "Problemas al insertar proformas de contenedor",
		        success:false,}); res.end(); res.connection.destroy();
	    	}
		}
	} catch (error) {
        console.log('ERROR PostContenedorProforma'+error);
        res.status(400).send({
        message: "Problemas al crear proformas de contenedor",
        success:false,}); res.end(); res.connection.destroy();
    }  
};

exports.update = async (req,res) =>{
	try{

	} catch (error) {
        console.log('ERROR UpdateContenedorProforma'+error);
        res.status(400).send({
        message: "Problemas al actualizar proformas de contenedor",
        success:false,}); res.end(); res.connection.destroy();
    }  
};

exports.delete = async (req,res) =>{
	try{
		if (!req.params.id) {
	      res.status(400).send({
	        message: "El id es obligatorio",
	        success:false
	      });
	      return;
	    }

	    await client.query(`DELETE FROM public.contenedor_proforma where id=`+parseInt(req.params.id));
	    await client.query(`DELETE FROM public.contenedor_proforma_detalle where fk_contenedor_proforma=`+parseInt(req.params.id));
        res.status(200).send([]);
        res.end(); res.connection.destroy();
	} catch (error) {
        console.log('ERROR DeleteContenedorProforma'+error);
        res.status(400).send({
        message: "Problemas al eliminar proformas de contenedor",
        success:false,}); res.end(); res.connection.destroy();
    }  
};
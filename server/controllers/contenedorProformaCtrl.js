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
    client.query('SELECT cp.*,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos,(SELECT n2.nave_nombre FROM naves2 n2 LEFT JOIN naves_eta ne on ne.fk_nave=n2.nave_id LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking  where ct.id=cp.fk_contenedor_tracking and ne.estado<2 order by ne.id asc limit 1) as nave_nombre,(SELECT ne.etd_fecha FROM naves_eta ne LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking  where ct.id=cp.fk_contenedor_tracking order by ne.id asc limit 1) as fecha_salida,(SELECT ne.eta_fecha FROM naves_eta ne LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking  where ct.id=cp.fk_contenedor_tracking order by ne.id desc limit 1) as fecha_llegada,c.codigo as fk_contenedor_codigo FROM public.contenedor_proforma cp inner join usuario u on u.id=cp.fk_usuario_creacion left join contenedor c on c.id=cp.fk_contenedor ORDER BY cp.id DESC', "", function (err, result) {
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

	        let queryFinal='SELECT cpd.*,td.fecha_recepcion,td.fecha_consolidado,td.tipo_producto,td.producto,td.peso,td.volumen,td.ubicacion,td.codigo_interno,td.observacion,t.fk_cliente,t.fk_proveedor,c.codigo as fk_cliente_codigo, c."razonSocial" as fk_cliente_razonsocial,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre, p."nombreChi" as fk_proveedor_nombre_chi  FROM public.contenedor_proforma_detalle cpd inner join public.tracking_detalle td on td.id=cpd.fk_tracking_detalle inner join public.tracking t on t.id=td.tracking_id inner join public.clientes c on c.id=t.fk_cliente inner join public.proveedores p on p.id=t.fk_proveedor '+queryIn;
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
	    			let query22={
				        text: 'SELECT *FROM public.contenedor_proforma_detalle WHERE fk_contenedor_proforma=$1 and fk_tracking_detalle=$2',
				        values: [result1.rows[0].id,req.body.detalle[i]]
	    			};

	    			let result22=await client.query(query22);
	    			if(result22 && result22.rows.length===0){
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
		if (!req.params.id) {
	      res.status(400).send({
	        message: "El id es obligatorio",
	        success:false
	      });
	      return;
	    }

	    if(req.body.delete && req.body.delete.length>0){
	    	for(let i=0;i<req.body.delete.length;i++){
	    		let result=client.query('DELETE FROM public.contenedor_proforma_detalle where id='+parseInt(req.body.delete[i]));
	    		if(!result){
	    			console.log('ERROR DeleteDetalle');
	    		}	
	    	}
	    }

	    if(req.body.detalle && req.body.detalle.length>0){
	    	for(let i=0;i<req.body.detalle.length;i++){
	    		let query22={
				        text: 'SELECT *FROM public.contenedor_proforma_detalle WHERE fk_contenedor_proforma=$1 and fk_tracking_detalle=$2',
				        values: [req.params.id,req.body.detalle[i]]
	    			};

	    		let result22=await client.query(query22);
	    		if(result22 && result22.rows.length===0){
	    		let query2={
				        text: 'INSERT INTO public.contenedor_proforma_detalle(fk_contenedor_proforma, fk_tracking_detalle,estado) VALUES($1, $2, $3) RETURNING *',
				        values: [req.params.id,req.body.detalle[i],0]
	    			};
	    		let result2=await client.query(query2);
	    		if(!result2){
	    			console.log('ERROR InsertDetalle');
	    		}	
	    		}
	    	}
	    }

	    res.status(200).send([]);
        res.end(); res.connection.destroy();
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

exports.confirmContenedor = async (req,res)=>{
	try{
		if (!req.params.id) {
	      res.status(400).send({
	        message: "El id es obligatorio",
	        success:false
	      });
	      return;
	    }else if(!req.body.fk_contenedor){
	    	res.status(400).send({
	        message: "El contenedor es obligatorio",
	        success:false
	      });
	      return;
	    }

	    let viajeTracking=0;let ids=[];
	    let result0=await client.query("SELECT *FROM public.contenedor_tracking where fk_contenedor="+parseInt(req.body.fk_contenedor)+" and estado=0");
	    if(result0 && result0.rows.length>0){
	    	viajeTracking=result0.rows[0].id;
	    }

	    let result1=await client.query("SELECT cpd.*, td.tracking_id FROM public.contenedor_proforma_detalle cpd inner join public.tracking_detalle td on td.id=cpd.fk_tracking_detalle where fk_contenedor_proforma="+parseInt(req.params.id));
	    if(result1 && result1.rows.length>0){
	    	for(let i=0;i<result1.rows.length;i++){
	    		if(ids.length===0){
	    			ids.push(result1.rows[i].tracking_id);
	    		}else{
	    			const exist=ids.find(x=>x==result1.rows[i].tracking_id);
	    			if(!exist){
	    				ids.push(result1.rows[i].tracking_id);
	    			}
	    		}

	    		const query2 = {
			        text: 'INSERT INTO public.contenedor_detalle(fk_contenedor, fk_tracking_detalle) VALUES($1, $2) RETURNING *',
			        values: [req.body.fk_contenedor,result1.rows[i].fk_tracking_detalle],
			    };
			    let result2=await client.query(query2);

				if(result2 && result2.rows.length>0){
					let params3=[result1.rows[i].fk_tracking_detalle,2,null,req.body.fk_contenedor];
				    if(viajeTracking>0){
				    	params3[2]=viajeTracking;
				    }

			        let query3 ={
			                text: 'UPDATE public.tracking_detalle SET estado=$2,fk_contenedor_tracking=$3,fk_contenedor=$4 WHERE id=$1 RETURNING *',
			                values: params3
			        };
			        let result3=await client.query(query3);

				}else{
					res.status(400).send({
			        message: "Error al cargar contenedor detalle",
			        success:false,}); res.end(); res.connection.destroy();
				}
	    	}

	    	 /********************/
	    	 if(ids.length>0){
	    	 	for(let i=0;i<ids.length;i++){
	    	 		let query4='SELECT * FROM public.tracking_detalle where tracking_id='+parseInt(ids[i])+'and estado<2'
	    	 		let result4=await client.query(query4);
	    	 		if(result4 && result4.rows.length===0){
	    	 			const query5 = {
			                text: 'UPDATE public.tracking SET estado=$1 WHERE id=$2 RETURNING *',
			                values: [2, parseInt(ids[i])],
			            };
			            let result5=await client.query(query5);
	    	 		}
	    	 	}
	    	 }


	    	 const query6 = {
			                text: 'UPDATE public.contenedor_proforma SET estado=$1 WHERE id=$2 RETURNING *',
			                values: [1, parseInt(req.params.id)],
			            };
			 let result6=await client.query(query6);
			    
			 /********************/


	    	res.status(200).send([]);
       		res.end(); res.connection.destroy();

	    }else if(result1 && result1.rows.length===0){
	    	res.status(400).send({
	        message: "No existen cargas asociadas a la proforma para actualizar",
	        success:false,}); res.end(); res.connection.destroy();
	    }else{
	    	console.log('ERROR ConfirmContenedorProforma 1'+error);
	        res.status(400).send({
	        message: "Problemas al confirmar proformas de contenedor",
	        success:false,}); res.end(); res.connection.destroy();
	    }
	} catch (error) {
        console.log('ERROR ConfirmContenedorProforma 2'+error);
        res.status(400).send({
        message: "Problemas al confirmar proformas de contenedor",
        success:false,}); res.end(); res.connection.destroy();
    }  
}
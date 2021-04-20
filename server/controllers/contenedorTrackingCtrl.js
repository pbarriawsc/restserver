const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const moment=require('moment');

exports.listByContenedorActivo = (req, res) => {
	try {
		if (!req.params.fk_contenedor) {
	      res.status(400).send({
	        message: "El contenedor es obligatorio",
	        success:false
	      });
	      return;
	    }
    client.query("SELECT ct.*,u1.nombre as fk_usuario_creacion_nombre, u1.apellidos as fk_usuario_creacion_apellidos FROM public.contenedor_tracking ct inner join public.usuario u1 on u1.id=ct.fk_usuario_creacion where ct.fk_contenedor=$1 and ct.estado<2 order by ct.id desc limit 1", [req.params.fk_contenedor], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
    } catch (error) {
        console.log('ERROR GetContenedorTracking'+error);
        res.status(400).send({
        message: "Problemas al obtener el tracking del contenedor",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.create = async (req,res)=>{
	try{
		if (!req.params.fk_contenedor) {
	      res.status(400).send({
	        message: "El contenedor es obligatorio",
	        success:false
	      });
	      return;
	    }

	    let exists=await client.query('SELECT * FROM public.contenedor_tracking where fk_contenedor='+req.params.fk_contenedor+' and estado<2 order by id desc limit 1');
	    if(exists && exists.rows.length>0){
	    	res.status(400).send({
        	message: "No se puede crear una ruta, el contenedor posee una ruta activa",
        	success:false,}); res.end(); res.connection.destroy();
	    }else{

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
	    	let query1={
		        text: 'INSERT INTO public.contenedor_tracking(fk_contenedor, fk_usuario_creacion,fk_usuario_modificacion,fecha_modificacion,estado) VALUES($1, $2, $3, $4, $5) RETURNING *',
		        values: [req.params.fk_contenedor,req.usuario.id,req.usuario.id,moment().format('YYYYMMDD HHmmss'),0]
	    	};
	    	let result1=await client.query(query1);
	    	if(result1 && result1.rows.length && req.body.viajes && req.body.viajes.length>0){
	    		for(let i=0;i<req.body.viajes.length;i++){
	    			let query2={
	    			text:'INSERT INTO public.contenedor_viajes(fk_contenedor_tracking,fk_viaje,estado) values($1,$2,$3) RETURNING *',
	    			values:[result1.rows[0].id,req.body.viajes[i],0]
	    			};
	    			let result2=await client.query(query2);
	    			if(result2 && result2.rows.length>0){

	    			}else{
	    				console.log('ERROR PostContenedorViajes');
	    			}
	    		}

	    		if(req.body.detalle && req.body.detalle.length>0){
	    			for(let i=0;i<req.body.detalle.length;i++){
		    			let query3={
		    			text:'INSERT INTO public.contenedor_viajes_detalle(fk_contenedor_tracking,fk_nave_eta,estado) values($1,$2,$3) RETURNING *',
		    			values:[result1.rows[0].id,req.body.detalle[i].id,0]
		    			};
		    			let result3=await client.query(query3);
		    			if(result3 && result3.rows.length>0){

		    			}else{
		    				console.log('ERROR PostContenedorViajes');
		    			}
		    		}
	    		}
	    		
	    	}

	    	res.status(200).send({
        	message: "Ruta creada correctamente",
        	success:true,}); res.end(); res.connection.destroy();
	    }
	} catch (error) {
        console.log('ERROR PostContenedorTracking'+error);
        res.status(400).send({
        message: "Problemas al crear el tracking del contenedor",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.delete = async (req,res)=>{
	try{
		if (!req.params.id) {
	      res.status(400).send({
	        message: "El id es obligatorio",
	        success:false
	      });
	      return;
	    }

	    let result1=await client.query('DELETE FROM public.contenedor_tracking where id='+req.params.id);
	    if(result1){
	    	await client.query('DELETE FROM public.contenedor_viajes where fk_contenedor_tracking='+req.params.id);
	    	await client.query('DELETE FROM public.contenedor_viajes_detalle where fk_contenedor_tracking='+req.params.id);
	    	res.status(200).send({
        	message: "Ruta eliminada correctamente",
        	success:true,}); res.end(); res.connection.destroy();
	    }else{
	    	 console.log('ERROR DeleteContenedorTracking'+error);
	        res.status(400).send({
	        message: "Problemas al eliminar el tracking del contenedor",
	        success:false,}); res.end(); res.connection.destroy();
	    }
	} catch (error) {
        console.log('ERROR DeleteContenedorTracking'+error);
        res.status(400).send({
        message: "Problemas al eliminar el tracking del contenedor",
        success:false,}); res.end(); res.connection.destroy();
    }
};

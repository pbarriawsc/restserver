const client = require('../config/db.client');
const moment=require('moment');
const jwt=require('jsonwebtoken');

exports.listByEstado = (req, res) => {
	try{
	if (!req.params.estado) {
      res.status(400).send({
        message: "El estado es obligatorio",
        success:false
      });
      return;
    }
    client.query('SELECT *FROM public.contenedor_proforma where estado=$1 ORDER BY id DESC', [req.params.estado], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
        res.end(); res.connection.destroy();
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
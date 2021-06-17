const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');

exports.list = (req, res) => {
    // Validate request
    try{
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
	/*
	    let bodega=req.usuario.fk_bodega;
	    
	    let query='SELECT *FROM public.bodegas_ubicaciones';

	    if(bodega!==null){
	    	query='SELECT *FROM public.bodegas_ubicaciones where fk_bodega='+bodega;
	    }*/

	    let query='SELECT bud.*,bu.nombre as fk_bodega_ubicacion_nombre,td.codigo_interno,td.tipo_producto,td.producto,td.peso,td.volumen,td.tracking_id as fk_tracking,';
	    query+='cl.id as fk_cliente,cl.rut as fk_cliente_rut, cl.codigo as fk_cliente_codigo, cl."razonSocial" as fk_cliente_razon_social, p.id as fk_proveedor, p.codigo as fk_proveedor_codigo,';
	    query+='p.nombre as fk_proveedor_nombre, p."nombreChi" as fk_proveedor_nombre_chino';
	    query+=' FROM public.bodega_ubicacion_detalle bud ';
	    query+=' INNER JOIN public.bodegas_ubicaciones bu on bu.id=bud.fk_bodega_ubicacion ';
	    query+=' INNER JOIN public.tracking_detalle td on td.id=bud.fk_tracking_detalle ';
	    query+=' INNER JOIN public.tracking t on t.id=td.tracking_id ';
	    query+=' INNER JOIN public.clientes cl on cl.id=t.fk_cliente ';
	    query+=' INNER JOIN public.proveedores p on p.id=t.fk_proveedor ';
	    query+=' WHERE bud.estado=0 ';
	    query+=' order by bud.id desc ';

	    client.query(query,"",function (err, result)
	    {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	        res.status(200).send(result.rows);
	        res.end();
	        res.connection.destroy();
	    });
	} catch (error) {
        console.log('ERROR GetBodegaUbicacionesDetalle'+error);
        res.status(400).send({
        message: "Problemas al obtener el listado bodega ubicaciones detalle",
        success:false,}); res.end(); res.connection.destroy();
    }
}
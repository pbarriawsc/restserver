const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const xlsx = require('node-xlsx');
const moment=require('moment');
const path = require('path');
const fromExcelDate = require('js-excel-date-convert').fromExcelDate;
var fs = require('fs');

exports.listChn = async (req,res)=>{
	try{
		const arrayFinal=[];
		let query0='SELECT t.id,t.fecha_creacion,t.fecha_recepcion,t.cantidad_bultos,t.peso,t.volumen,t.tipo_carga,t.fk_proveedor,t.fk_cliente,t.tipo,t.estado,t.currier,t.fk_propuesta,t.fk_consolidado_tracking,t.prioridad,t.fk_proveedor_cliente,t."devImpuesto",t.fk_bodega,';
	query0+='ct.fk_consolidado,c.codigo as fk_cliente_codigo,c."razonSocial" as fk_cliente_nombre,p.codigo as fk_proveedor_codigo,';
	query0+='p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino,t.fk_bodega,b.nombre as fk_bodega_nombre,';
	query0+='CASE WHEN t.packing_list1 IS NOT NULL THEN TRUE ELSE FALSE END AS packing_list1,';
	query0+='CASE WHEN t.packing_list2 IS NOT NULL THEN TRUE ELSE FALSE END AS packing_list2,';
	query0+='CASE WHEN t.invoice1 IS NOT NULL THEN TRUE ELSE FALSE END AS invoice1,';
	query0+='CASE WHEN t.invoice2 IS NOT NULL THEN TRUE ELSE FALSE END AS invoice2,';
	query0+='CASE WHEN t.foto1 IS NOT NULL THEN TRUE ELSE FALSE END AS foto1,';
	query0+='CASE WHEN t.foto2 IS NOT NULL THEN TRUE ELSE FALSE END AS foto2,';
	query0+='CASE WHEN t.foto3 IS NOT NULL THEN TRUE ELSE FALSE END AS foto3,';
	query0+='CASE WHEN t.foto4 IS NOT NULL THEN TRUE ELSE FALSE END AS foto4,';
	query0+='CASE WHEN t.foto5 IS NOT NULL THEN TRUE ELSE FALSE END AS foto5,';
	query0+='CASE WHEN td.estado>=1 then SUM(1) ELSE SUM(0) END AS bultos_completos,';
	query0+='CASE WHEN td.estado=0 then SUM(1) ELSE SUM(0) END AS bultos_pendientes,';
	query0+='SUM(coalesce (td.peso,0)) as peso_recepcionado,';
	query0+='SUM(coalesce (td.volumen,0)) as volumen_recepcionado ';
	query0+='FROM public.tracking t ';
	query0+='left join public.clientes c on c.id=t.fk_cliente ';
	query0+='left join public.proveedores p on p.id=t.fk_proveedor ';
	query0+='left join public.consolidado_tracking ct on ct.fk_tracking=t.id ';
	query0+='left join public.bodegas b on b.id=t.fk_bodega ';
	query0+='left join public.tracking_detalle td on td.tracking_id=t.id ';
	query0+='where t.estado<2 and t.estado>=0 ';
	query0+='group by t.id,t.fecha_creacion,t.fecha_recepcion,t.cantidad_bultos,t.peso,t.volumen,t.tipo_carga,t.fk_proveedor,t.fk_cliente,';
	query0+='t.tipo,t.estado,t.currier,t.fk_propuesta,t.fk_consolidado_tracking,t.prioridad,t.fk_proveedor_cliente,t."devImpuesto",t.fk_bodega,';
	query0+='td.estado,ct.fk_consolidado,c.codigo,c."razonSocial",p.codigo,p.nombre,p."nombreChi",t.fk_bodega,b.nombre ';

    client.query('SELECT t.id,t.fecha_creacion,t.fecha_recepcion,t.cantidad_bultos,t.peso,t.volumen,t.tipo_carga,t.fk_proveedor,t.fk_cliente,t.tipo,t.estado,t.currier,t.fk_propuesta,t.fk_consolidado_tracking,t.prioridad,t.fk_proveedor_cliente,t."devImpuesto",t.fk_bodega,CASE WHEN t.packing_list1 IS NOT NULL THEN TRUE ELSE FALSE END AS packing_list1,CASE WHEN t.packing_list2 IS NOT NULL THEN TRUE ELSE FALSE END AS packing_list2,CASE WHEN t.invoice1 IS NOT NULL THEN TRUE ELSE FALSE END AS invoice1,CASE WHEN t.invoice2 IS NOT NULL THEN TRUE ELSE FALSE END AS invoice2,CASE WHEN t.foto1 IS NOT NULL THEN TRUE ELSE FALSE END AS foto1,CASE WHEN t.foto2 IS NOT NULL THEN TRUE ELSE FALSE END AS foto2,CASE WHEN t.foto3 IS NOT NULL THEN TRUE ELSE FALSE END AS foto3,CASE WHEN t.foto4 IS NOT NULL THEN TRUE ELSE FALSE END AS foto4,CASE WHEN t.foto5 IS NOT NULL THEN TRUE ELSE FALSE END AS foto5, ct.fk_consolidado, c.codigo as fk_cliente_codigo,c."razonSocial" as fk_cliente_nombre,c.web as fk_cliente_web,c.telefono1 as fk_cliente_telefono1,c.telefono2 as fk_cliente_telefono2,c."dteEmail" as fk_cliente_email,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos,(SELECT count(id) FROM public.tracking_observaciones WHERE fk_tracking=T.id)::integer AS observaciones,t.fk_bodega,b.nombre as fk_bodega_nombre,(SELECT SUM(peso) FROM public.tracking_detalle WHERE tracking_id=T.id)::real AS peso_recepcionado,(SELECT SUM(volumen) FROM public.tracking_detalle WHERE tracking_id=T.id)::real AS volumen_recepcionado,(SELECT count (t2.id) from public.tracking t2 INNER JOIN public.consolidado_tracking ct2 on t2.id=ct2.fk_tracking where t2.estado>=1 and ct2.fk_consolidado=(select ct2.fk_consolidado from consolidado_tracking ct2 where ct2.fk_tracking=t.id))::integer AS trackings_completos,(SELECT count (ct.id) from public.consolidado_tracking ct where ct.fk_consolidado=(select ct.fk_consolidado from consolidado_tracking ct where ct.fk_tracking=t.id))::integer AS trackings_totales,cs.estado as fk_consolidado_estado,(SELECT count (td.id) from public.tracking_detalle td where td.tracking_id=t.id and td.fk_contenedor is not null)::integer as trackings_detalle_cargados,(SELECT count (td.id) from public.tracking_detalle td where td.tracking_id=t.id)::integer as trackings_detalle_totales FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor inner join public.consolidado_tracking ct on ct.fk_tracking=t.id inner join public.consolidado cs on cs.id=ct.fk_consolidado left join public.bodegas b on b.id=t.fk_bodega where t.estado>=0 ORDER BY T.id DESC', "", function (err, result) {
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
		        	queryIn+='WHERE td.tracking_id IN (';
		        	for(var x=0;x<ids.length;x++){
		        		if(x!==ids.length-1){
		        			queryIn+=ids[x]+','
		        		}else{
		        			queryIn+=ids[x]
		        		}
		        	}
		        	queryIn+=')';
		        }

		        let queryFinal="SELECT td.id,td.upload_id,td.fecha_recepcion,td.fecha_consolidado,td.codigo_interno,td.tipo_producto,td.producto,td.peso,td.volumen,td.observacion,td.tracking_id,td.estado,CASE WHEN td.foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN td.foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN td.foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,td.ancho,td.alto,td.altura,td.ubicacion,td.fk_currier,td.numero_seguimiento,c.nombre as fk_currier_nombre,c.nombre_chino as fk_currier_nombre_chino,cpd.fk_contenedor_proforma FROM public.tracking_detalle td left join public.currier c on c.id=td.fk_currier left join contenedor_proforma_detalle cpd on cpd.fk_tracking_detalle=td.id "+queryIn;
		        console.log(queryFinal);
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
	        message: "ERROR ListCHN:"+error,
	        success:false,
	    });
	    res.end(); res.connection.destroy();
    }
}

exports.list = (req, res) => {
	try{
	const arrayFinal=[];
	let query0='SELECT t.id,t.fecha_creacion,t.fecha_recepcion,t.cantidad_bultos,t.peso,t.volumen,t.tipo_carga,t.fk_proveedor,t.fk_cliente,t.tipo,t.estado,t.currier,t.fk_propuesta,t.fk_consolidado_tracking,t.prioridad,t.fk_proveedor_cliente,t."devImpuesto",t.fk_bodega,';
	query0+='ct.fk_consolidado,c.codigo as fk_cliente_codigo,c."razonSocial" as fk_cliente_nombre,p.codigo as fk_proveedor_codigo,';
	query0+='p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino,t.fk_bodega,b.nombre as fk_bodega_nombre,';
	query0+='CASE WHEN t.packing_list1 IS NOT NULL THEN TRUE ELSE FALSE END AS packing_list1,';
	query0+='CASE WHEN t.packing_list2 IS NOT NULL THEN TRUE ELSE FALSE END AS packing_list2,';
	query0+='CASE WHEN t.invoice1 IS NOT NULL THEN TRUE ELSE FALSE END AS invoice1,';
	query0+='CASE WHEN t.invoice2 IS NOT NULL THEN TRUE ELSE FALSE END AS invoice2,';
	query0+='CASE WHEN t.foto1 IS NOT NULL THEN TRUE ELSE FALSE END AS foto1,';
	query0+='CASE WHEN t.foto2 IS NOT NULL THEN TRUE ELSE FALSE END AS foto2,';
	query0+='CASE WHEN t.foto3 IS NOT NULL THEN TRUE ELSE FALSE END AS foto3,';
	query0+='CASE WHEN t.foto4 IS NOT NULL THEN TRUE ELSE FALSE END AS foto4,';
	query0+='CASE WHEN t.foto5 IS NOT NULL THEN TRUE ELSE FALSE END AS foto5,';
	query0+='CASE WHEN td.estado>=1 then SUM(1) ELSE SUM(0) END AS bultos_completos,';
	query0+='CASE WHEN td.estado=0 then SUM(1) ELSE SUM(0) END AS bultos_pendientes,';
	query0+='SUM(coalesce (td.peso,0)) as peso_recepcionado,';
	query0+='SUM(coalesce (td.volumen,0)) as volumen_recepcionado ';
	query0+='FROM public.tracking t ';
	query0+='left join public.clientes c on c.id=t.fk_cliente ';
	query0+='left join public.proveedores p on p.id=t.fk_proveedor ';
	query0+='left join public.consolidado_tracking ct on ct.fk_tracking=t.id ';
	query0+='left join public.bodegas b on b.id=t.fk_bodega ';
	query0+='left join public.tracking_detalle td on td.tracking_id=t.id ';
	query0+='where t.estado<2 and t.estado>=0 ';
	query0+='group by t.id,t.fecha_creacion,t.fecha_recepcion,t.cantidad_bultos,t.peso,t.volumen,t.tipo_carga,t.fk_proveedor,t.fk_cliente,';
	query0+='t.tipo,t.estado,t.currier,t.fk_propuesta,t.fk_consolidado_tracking,t.prioridad,t.fk_proveedor_cliente,t."devImpuesto",t.fk_bodega,';
	query0+='td.estado,ct.fk_consolidado,c.codigo,c."razonSocial",p.codigo,p.nombre,p."nombreChi",t.fk_bodega,b.nombre ';
	query0+=' ORDER BY T.id DESC';
    client.query(query0, "", function (err, result) {
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
		        	queryIn+='WHERE td.tracking_id IN (';
		        	for(var x=0;x<ids.length;x++){
		        		if(x!==ids.length-1){
		        			queryIn+=ids[x]+','
		        		}else{
		        			queryIn+=ids[x]
		        		}
		        	}
		        	queryIn+=')';
		        }

		        let queryFinal="SELECT td.id,td.upload_id,td.fecha_recepcion,td.fecha_consolidado,td.codigo_interno,td.tipo_producto,td.producto,td.peso,td.volumen,td.observacion,td.tracking_id,td.estado,CASE WHEN td.foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN td.foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN td.foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,td.ancho,td.alto,td.altura,td.ubicacion,td.fk_currier,td.numero_seguimiento,c.nombre as fk_currier_nombre,c.nombre_chino as fk_currier_nombre_chino FROM public.tracking_detalle td left join public.currier c on c.id=td.fk_currier "+queryIn;
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
    client.query('SELECT T.*, c.codigo as fk_cliente_codigo,c."razonSocial" as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos,(SELECT count(id) FROM public.tracking_observaciones WHERE fk_tracking=T.id)::integer AS observaciones FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor where t.id=$1 ORDER BY T.id DESC', [req.params.id], function (err, result) {
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
	let query0='SELECT t.id,t.fecha_creacion,t.fecha_recepcion,t.cantidad_bultos,t.peso,t.volumen,t.tipo_carga,t.fk_proveedor,t.fk_cliente,t.tipo,t.estado,t.currier,t.fk_propuesta,t.fk_consolidado_tracking,t.prioridad,t.fk_proveedor_cliente,t."devImpuesto",t.fk_bodega,';
	query0+='ct.fk_consolidado,c.codigo as fk_cliente_codigo,c."razonSocial" as fk_cliente_nombre,p.codigo as fk_proveedor_codigo,';
	query0+='p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino,t.fk_bodega,b.nombre as fk_bodega_nombre,';
	query0+='CASE WHEN t.packing_list1 IS NOT NULL THEN TRUE ELSE FALSE END AS packing_list1,';
	query0+='CASE WHEN t.packing_list2 IS NOT NULL THEN TRUE ELSE FALSE END AS packing_list2,';
	query0+='CASE WHEN t.invoice1 IS NOT NULL THEN TRUE ELSE FALSE END AS invoice1,';
	query0+='CASE WHEN t.invoice2 IS NOT NULL THEN TRUE ELSE FALSE END AS invoice2,';
	query0+='CASE WHEN t.foto1 IS NOT NULL THEN TRUE ELSE FALSE END AS foto1,';
	query0+='CASE WHEN t.foto2 IS NOT NULL THEN TRUE ELSE FALSE END AS foto2,';
	query0+='CASE WHEN t.foto3 IS NOT NULL THEN TRUE ELSE FALSE END AS foto3,';
	query0+='CASE WHEN t.foto4 IS NOT NULL THEN TRUE ELSE FALSE END AS foto4,';
	query0+='CASE WHEN t.foto5 IS NOT NULL THEN TRUE ELSE FALSE END AS foto5,';
	query0+='CASE WHEN td.estado>=1 then SUM(1) ELSE SUM(0) END AS bultos_completos,';
	query0+='CASE WHEN td.estado=0 then SUM(1) ELSE SUM(0) END AS bultos_pendientes,';
	query0+='SUM(coalesce (td.peso,0)) as peso_recepcionado,';
	query0+='SUM(coalesce (td.volumen,0)) as volumen_recepcionado ';
	query0+='FROM public.tracking t ';
	query0+='left join public.clientes c on c.id=t.fk_cliente ';
	query0+='left join public.proveedores p on p.id=t.fk_proveedor ';
	query0+='left join public.consolidado_tracking ct on ct.fk_tracking=t.id ';
	query0+='left join public.bodegas b on b.id=t.fk_bodega ';
	query0+='left join public.tracking_detalle td on td.tracking_id=t.id ';
	query0+='where t.estado=$1 ';
	query0+='group by t.id,t.fecha_creacion,t.fecha_recepcion,t.cantidad_bultos,t.peso,t.volumen,t.tipo_carga,t.fk_proveedor,t.fk_cliente,';
	query0+='t.tipo,t.estado,t.currier,t.fk_propuesta,t.fk_consolidado_tracking,t.prioridad,t.fk_proveedor_cliente,t."devImpuesto",t.fk_bodega,';
	query0+='td.estado,ct.fk_consolidado,c.codigo,c."razonSocial",p.codigo,p.nombre,p."nombreChi",t.fk_bodega,b.nombre ';
	query0+=' ORDER BY T.id DESC';

    client.query(query0, [req.params.estado], function (err, result) {
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
		        	queryIn+=' WHERE td.tracking_id IN (';
		        	for(var x=0;x<ids.length;x++){
		        		if(x!==ids.length-1){
		        			queryIn+=ids[x]+','
		        		}else{
		        			queryIn+=ids[x]
		        		}
		        	}
		        	queryIn+=')';
		        }

		        let queryFinal="SELECT td.id,td.upload_id,td.fecha_recepcion,td.fecha_consolidado,td.codigo_interno,td.tipo_producto,td.producto,td.peso,td.volumen,td.observacion,td.tracking_id,td.estado,CASE WHEN foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,td.ancho,td.alto,td.altura,td.ubicacion,td.fk_contenedor,c.codigo as fk_contenedor_codigo,n.nave_nombre as fk_nave_nombre,td.fk_nave,ne.eta_fecha,ne.eta_hora,ne.etd_fecha,ne.etd_hora,cu.nombre as fk_currier_nombre,cu.nombre_chino as fk_currier_nombre_chino,(SELECT ne.etd_fecha FROM naves_eta ne LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking  where ct.id=td.fk_contenedor_tracking order by ne.id asc limit 1) as fecha_salida,(SELECT ne.eta_fecha FROM naves_eta ne LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking  where ct.id=td.fk_contenedor_tracking order by ne.id desc limit 1) as fecha_llegada FROM public.tracking_detalle td left join public.contenedor c on c.id=td.fk_contenedor left join public.naves2 n on n.nave_id=td.fk_nave left join public.naves_eta ne on ne.id=td.fk_nave_eta left join public.currier cu on cu.id=td.fk_currier"+queryIn;
		        if(req.params.estado===1 || req.params.estado==='1'){
		        	queryFinal+=' and estado<2';
		        }
		        console.log('queryFinal'+queryFinal);
		        client.query(queryFinal, "", function (err, result) {
			        if (err) {
			            console.log(err);
			            res.status(400).send(err);
			        }
			        if(resultHeader.rows.length>0){
			        	for(var i=0;i<resultHeader.rows.length;i++){
			        		const obj=lodash.cloneDeep(resultHeader.rows[i]);
			        		if(result.rows && result.rows.length>0){
			        			const arrayFind=result.rows.filter(y=>y.tracking_id===resultHeader.rows[i].id);
				        		if(arrayFind){
				        			obj.tracking_detalle=arrayFind;
				        		}else{
				        			obj.tracking_detalle=[];
				        		}
			        		}
			        		else{
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
		res.status(200).send(result.rows);
    });   
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
  };

exports.listByReadyToCharge = async(req, res) => {
  	try{
	const arrayFinal=[];


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

    let bodega=req.usuario.fk_bodega;
   



    let query='SELECT T.*,cst.fk_consolidado,c.codigo as fk_cliente_codigo,c."razonSocial" as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor inner join public.consolidado_tracking cst on cst.id=t.fk_consolidado_tracking where t.estado=$1 AND t.fk_propuesta is not null AND t.fk_consolidado_tracking is not null and cst.estado=1 ORDER BY T.prioridad ASC';
    if(bodega!==null){
    	query='SELECT T.*,cst.fk_consolidado,c.codigo as fk_cliente_codigo,c."razonSocial" as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor inner join public.consolidado_tracking cst on cst.id=t.fk_consolidado_tracking where t.estado=$1 AND t.fk_propuesta is not null AND t.fk_consolidado_tracking is not null and cst.estado=1 AND t.fk_bodega='+parseInt(bodega)+' ORDER BY T.prioridad ASC'
    }
    client.query(query,[req.params.estado], function (err, result) {
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
		        	queryIn+='WHERE td.tracking_id IN (';
		        	for(var x=0;x<ids.length;x++){
		        		if(x!==ids.length-1){
		        			queryIn+=ids[x]+','
		        		}else{
		        			queryIn+=ids[x]
		        		}
		        	}
		        	queryIn+=')';
		        }

		        let queryFinal="SELECT td.id,td.upload_id,td.fecha_recepcion,td.fecha_consolidado,td.codigo_interno,td.tipo_producto,td.producto,td.peso,td.volumen,td.observacion,td.tracking_id,td.estado,CASE WHEN td.foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN td.foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN td.foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,td.ancho,td.alto,td.altura,td.ubicacion FROM public.tracking_detalle td "+queryIn;
		        if(req.params.estado===1 || req.params.estado==='1'){
		        	queryFinal+=' and td.estado=1 and td.fk_consolidado_tracking_detalle is not null and NOT EXISTS (SELECT *FROM public.contenedor_proforma_detalle cpd WHERE cpd.fk_tracking_detalle = td.id)';
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

			        		if(obj.tracking_detalle && obj.tracking_detalle.length>0){
			        			arrayFinal.push(obj);
			        		}
			        		
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
exports.listByClient = async(req, res) => {
	try{
	const arrayFinal=[];

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

    let bodega=req.usuario.fk_bodega;
   /* if( req.usuario.fk_rol!==null){
    	 let rol = await client.query(` SELECT * FROM public.roles where id=`+req.usuario.fk_rol);
    	 if(rol.rows && rol.rows.length>0){
    	 	bodega=rol.rows[0].fk_bodega;
    	 }
    }*/

	let query='SELECT T.*,ct.fk_consolidado, c.codigo as fk_cliente_codigo,c."razonSocial" as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor left join public.consolidado_tracking ct on ct.fk_tracking=t.id where t.fk_cliente=$1 AND t.estado<2 AND t.fk_consolidado_tracking is null ';
    
	if(bodega!==null){
		query='SELECT T.*,ct.fk_consolidado, c.codigo as fk_cliente_codigo,c."razonSocial" as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor left join public.consolidado_tracking ct on ct.fk_tracking=t.id where t.fk_cliente=$1 AND t.estado<2 AND t.fk_bodega='+parseInt(bodega)+' AND t.fk_consolidado_tracking is null ';
	}

	let union=' UNION SELECT T.*,ct.fk_consolidado, c.codigo as fk_cliente_codigo,c."razonSocial" as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes ';
union+='FROM public.tracking t '; 
union+='left join public.clientes c on c.id=t.fk_cliente ';
union+='left join public.proveedores p on p.id=t.fk_proveedor '; 
union+='inner join public.consolidado_tracking ct on ct.fk_tracking=t.id ';
union+='inner join public.consolidado cnd on cnd.id=ct.fk_consolidado ';
union+='where t.fk_cliente=$1 AND t.estado<2 AND t.fk_consolidado_tracking IS NOT null AND cnd.estado=0 ';

    let queryF=query+union;
    console.log('queryF',queryF);
    client.query(queryF, [parseInt(req.params.id)], function (err, result) {
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

exports.create = async(req, res) => {
	try{
    if (!req.body.fecha_creacion){
        res.status(400).send({
            message: "La fecha de generacion es obligatorio",
            success:false
          });
          return;
    }

    const exists=await client.query("SELECT *FROM public.tracking where keyaux='"+req.body.keyaux+"'");

    if(exists && exists.rows.length===0){
    if(req.body.proveedor){
    	if(parseInt(req.body.proveedor.id)===0){
    		const query0 = {
		        text: 'INSERT INTO public.proveedores(codigo, nombre,fk_cliente,"nombreChi") VALUES($1, $2, $3, $4) RETURNING *',
		        values: [req.body.proveedor.codigo, req.body.proveedor.nombre,req.body.fk_cliente, req.body.proveedor.nombreChi],
		    };

		    console.log('query0',query0);

		    client.query(query0,"",function (err, result) {
	    	const err0=err;
	        const result0=result;
	        if (err0) {
	            console.log(err0);
	            res.status(400).send(err0);
	        }
	        console.log('aqui 1');
	        const query = {
		        text: 'INSERT INTO public.tracking(fk_proveedor,tipo,fecha_creacion,estado,fk_cliente,fecha_recepcion,cantidad_bultos,peso,volumen,tipo_carga,currier) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
		        values: [result.rows[0].id,req.body.tipo,req.body.fecha_creacion,req.body.estado,req.body.fk_cliente,req.body.fecha_recepcion,req.body.cantidad_bultos,req.body.peso,req.body.volumen,req.body.tipo_carga,req.body.currier],
		    	};

			    client.query(query,"",function (err, result) {
			    	const err1=err;
			        const result1=result;
			        if (err1) {
			            console.log(err1);
			            res.status(400).send(err1);
			        }
			       
                   console.log('aqui de nuevo 1');
			        if(result.rows && result.rows[0]){
			        	if(req.body.tracking_detalle && req.body.tracking_detalle.length>0){
			        		for(var i=0;i<req.body.tracking_detalle.length;i++){
			        				const query2={
						        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado,volumen,upload_id,ancho,alto,altura,codigo_interno,ubicacion,currier,fk_currier,numero_seguimiento) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *',
						        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,result.rows[0].id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].volumen,req.body.tracking_detalle[i].upload_id,req.body.tracking_detalle[i].ancho,req.body.tracking_detalle[i].alto,req.body.tracking_detalle[i].altura,req.body.tracking_detalle[i].codigo_interno,req.body.tracking_detalle[i].ubicacion,req.body.tracking_detalle[i].currier,req.body.tracking_detalle[i].fk_currier,req.body.tracking_detalle[i].numero_seguimiento],
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
		        text: 'INSERT INTO public.tracking(fk_proveedor,tipo,fecha_creacion,estado,fk_cliente,fecha_recepcion,cantidad_bultos,peso,volumen,tipo_carga,currier) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
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
						        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado,volumen,upload_id,ancho,alto,altura,codigo_interno,ubicacion,currier,fk_currier,numero_seguimiento) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *',
						        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,result.rows[0].id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].volumen,req.body.tracking_detalle[i].upload_id,req.body.tracking_detalle[i].ancho,req.body.tracking_detalle[i].alto,req.body.tracking_detalle[i].altura,req.body.tracking_detalle[i].codigo_interno,req.body.tracking_detalle[i].ubicacion,req.body.tracking_detalle[i].currier,req.body.tracking_detalle[i].fk_currier,req.body.tracking_detalle[i].numero_seguimiento],
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
						        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado,volumen,upload_id,ancho,alto,altura,codigo_interno,ubicacion,currier,fk_currier,numero_seguimiento) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *',
						        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,result.rows[0].id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].volumen,req.body.tracking_detalle[i].upload_id,req.body.tracking_detalle[i].ancho,req.body.tracking_detalle[i].alto,req.body.tracking_detalle[i].altura,req.body.tracking_detalle[i].codigo_interno,req.body.tracking_detalle[i].ubicacion,req.body.tracking_detalle[i].currier,req.body.tracking_detalle[i].fk_currier,req.body.tracking_detalle[i].numero_seguimiento],
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
            res.status(200).send('Intento duplicado');
            res.end(); res.connection.destroy();
    }
    
    } catch (error) {

            res.status(400).send({
                message: "ERROR :"+error,
                success:false,
            });
            res.end(); res.connection.destroy();

        }
};

exports.update = async(req,res) =>{
	try{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

    let fk_proveedor=0;
    if(req.body.fk_proveedor && req.body.fk_proveedor>0){
    	fk_proveedor=req.body.fk_proveedor;
    }
    if(req.body.proveedor && req.body.proveedor.id===0){
    	const query0 = {
		        text: 'INSERT INTO public.proveedores(codigo, nombre,fk_cliente,"nombreChi") VALUES($1, $2, $3, $4) RETURNING *',
		        values: [req.body.proveedor.codigo, req.body.proveedor.nombre,req.body.fk_cliente, req.body.proveedor.nombreChi],
		    };

    	let insertProveedor=await client.query(query0);
    	if(insertProveedor && insertProveedor.rows){
    		fk_proveedor=insertProveedor.rows[0].id;
    	}
    }
    const fechaRecepcion=moment().format('YYYYMMDD HHmmss');
    const query = {
        text: 'UPDATE public.tracking SET tipo=$1,estado=$2,fk_cliente=$3,fk_proveedor=$4,fecha_recepcion=$5,cantidad_bultos=$6,peso=$7,volumen=$8,tipo_carga=$9,currier=$10,prioridad=$11 WHERE id=$12 RETURNING *',
        values: [req.body.tipo, req.body.estado, req.body.fk_cliente, fk_proveedor,fechaRecepcion,req.body.cantidad_bultos,req.body.peso,req.body.volumen,req.body.tipo_carga,req.body.currier,req.body.prioridad,req.body.id],
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
		        		text: 'INSERT INTO public.tracking_detalle(fecha_recepcion,tipo_producto,producto,peso,observacion,tracking_id,estado,volumen,upload_id,ancho,alto,altura,codigo_interno,fecha_consolidado,ubicacion,currier) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',
		        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,req.params.id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].volumen,req.body.tracking_detalle[i].upload_id,req.body.tracking_detalle[i].ancho,req.body.tracking_detalle[i].alto,req.body.tracking_detalle[i].altura,req.body.tracking_detalle[i].codigo_interno,fechaConsolidado,req.body.tracking_detalle[i].ubicacion,req.body.tracking_detalle[i].currier],
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
		        		text: 'UPDATE public.tracking_detalle SET fecha_recepcion=$1,tipo_producto=$2,producto=$3,peso=$4,observacion=$5,tracking_id=$6,estado=$7,volumen=$8,upload_id=$9,ancho=$10,alto=$11,altura=$12,codigo_interno=$13,ubicacion=$14,currier=$15 WHERE id=$16 RETURNING *',
		        		values: [req.body.tracking_detalle[i].fecha_recepcion, req.body.tracking_detalle[i].tipo_producto,req.body.tracking_detalle[i].producto,req.body.tracking_detalle[i].peso,req.body.tracking_detalle[i].observacion,req.params.id,req.body.tracking_detalle[i].estado,req.body.tracking_detalle[i].volumen,req.body.tracking_detalle[i].upload_id,req.body.tracking_detalle[i].ancho,req.body.tracking_detalle[i].alto,req.body.tracking_detalle[i].altura,req.body.tracking_detalle[i].codigo_interno,req.body.tracking_detalle[i].ubicacion,req.body.tracking_detalle[i].currier,req.body.tracking_detalle[i].id],
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
	var ext = '';
	var type = '';
    let queryValues=[null,null,null,null,null,null,null,null,null,null,null,null,req.params.id];
    if(req.files.packingList1){
    	//console.log('pl1',req.files.packingList1);
		ext=''; type='';
    	ext = path.extname(req.files.packingList1.name);
    	
		if( ext.toLowerCase()=='.doc' ) { type="application/msword"; }
		else if( ext.toLowerCase()=='.docx' ) { type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"; }
		else if( ext.toLowerCase()=='.xls' ) { type="application/vnd.ms-excel"; }
		else if( ext.toLowerCase()=='.xlsx' ) { type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; }
		else if( ext.toLowerCase()=='.pdf' ) { type="application/pdf"; }
		else if( ext.toLowerCase()=='.bpm' ) { type="image/bmp"; }
		else if( ext.toLowerCase()=='.tiff' ) { type="image/tiff"; }
		else if( ext.toLowerCase()=='.csv' ) { type="text/csv"; }
		else if( ext.toLowerCase()=='.jpeg' ) { type="image/jpeg"; }
		else if( ext.toLowerCase()=='.txt' ) { type="text/plain"; }
		
		queryValues[0]=req.files.packingList1.data;
    	queryValues[1]=type;
    	queryValues[2]=ext;

    	let filename=req.params.id+'_packing_list1'+ext;
    	req.files.packingList1.mv('./uploads/'+filename,function(err){
    		if(err){
    			console.log("Error subiendo archivo",err);
    		}else{
    			console.log("Archivo Copiado");
    		}
    	})
    }

    if(req.files.packingList2){
		ext=''; type='';
    	ext = path.extname(req.files.packingList2.name);
    	
		if( ext.toLowerCase()=='.doc' ) { type="application/msword"; }
		else if( ext.toLowerCase()=='.docx' ) { type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"; }
		else if( ext.toLowerCase()=='.xls' ) { type="application/vnd.ms-excel"; }
		else if( ext.toLowerCase()=='.xlsx' ) { type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; }
		else if( ext.toLowerCase()=='.pdf' ) { type="application/pdf"; }
		else if( ext.toLowerCase()=='.bpm' ) { type="image/bmp"; }
		else if( ext.toLowerCase()=='.tiff' ) { type="image/tiff"; }
		else if( ext.toLowerCase()=='.csv' ) { type="text/csv"; }
		else if( ext.toLowerCase()=='.jpeg' ) { type="image/jpeg"; }
		else if( ext.toLowerCase()=='.txt' ) { type="text/plain"; }
		
		queryValues[3]=req.files.packingList2.data;
    	queryValues[4]=type;
    	queryValues[5]=ext;

    }

    if(req.files.invoice1){
		ext=''; type='';
    	ext = path.extname(req.files.invoice1.name);
    	
		if( ext.toLowerCase()=='.doc' ) { type="application/msword"; }
		else if( ext.toLowerCase()=='.docx' ) { type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"; }
		else if( ext.toLowerCase()=='.xls' ) { type="application/vnd.ms-excel"; }
		else if( ext.toLowerCase()=='.xlsx' ) { type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; }
		else if( ext.toLowerCase()=='.pdf' ) { type="application/pdf"; }
		else if( ext.toLowerCase()=='.bpm' ) { type="image/bmp"; }
		else if( ext.toLowerCase()=='.tiff' ) { type="image/tiff"; }
		else if( ext.toLowerCase()=='.csv' ) { type="text/csv"; }
		else if( ext.toLowerCase()=='.jpeg' ) { type="image/jpeg"; }
		else if( ext.toLowerCase()=='.txt' ) { type="text/plain"; }
		
		queryValues[6]=req.files.invoice1.data;
    	queryValues[7]=type;
    	queryValues[8]=ext;
    }

    if(req.files.invoice2){
		ext=''; type='';
    	ext = path.extname(req.files.invoice2.name);
    	
		if( ext.toLowerCase()=='.doc' ) { type="application/msword"; }
		else if( ext.toLowerCase()=='.docx' ) { type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"; }
		else if( ext.toLowerCase()=='.xls' ) { type="application/vnd.ms-excel"; }
		else if( ext.toLowerCase()=='.xlsx' ) { type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; }
		else if( ext.toLowerCase()=='.pdf' ) { type="application/pdf"; }
		else if( ext.toLowerCase()=='.bpm' ) { type="image/bmp"; }
		else if( ext.toLowerCase()=='.tiff' ) { type="image/tiff"; }
		else if( ext.toLowerCase()=='.csv' ) { type="text/csv"; }
		else if( ext.toLowerCase()=='.jpeg' ) { type="image/jpeg"; }
		else if( ext.toLowerCase()=='.txt' ) { type="text/plain"; }
		
		queryValues[9]=req.files.invoice2.data;
    	queryValues[10]=type;
    	queryValues[11]=ext;
    }

	const query = {
        text: ' UPDATE public.tracking SET packing_list1=$1, packing_list1_type=$2, packing_list1_ext=$3, packing_list2=$4, packing_list2_type=$5, packing_list2_ext=$6, invoice1=$7, invoice1_type=$8, invoice1_ext=$9, invoice2=$10, invoice2_type=$11, invoice2_ext=$12 WHERE id=$13 RETURNING *',
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

exports.getPackingList1 = async (req,res) =>{ try {

	var Archivo = await client.query(` 
	SELECT 
	id
	,packing_list1 as archivo
	,packing_list1_type as tipo
	,packing_list1_ext as extension
	from public.tracking WHERE id=`+req.params.id+` 
	`);
  
	if(Archivo.rows.length<=0)
	{
	  res.status(400).send({
	  message: "NO SE ENCONTRO UN ARCHIVO",
	  success:false }); res.end(); res.connection.destroy();
	}
	else
	{
	  res.setHeader('Content-Type', Archivo.rows[0].tipo); 
	  res.setHeader('Content-Disposition', 'attachment; filename=packing_list1_'+Archivo.rows[0].id+Archivo.rows[0].extension);
	  res.setHeader('Content-Length', Archivo.rows[0].archivo.length);
	  res.end(Archivo.rows[0].archivo, 'binary');
	  }
  
  } catch (error) {
	console.log("ERROR "+error);
	res.status(400).send({
	message: "ERROR AL CARGAR EL ARCHIVO",
	success:false,
	}); res.end(); res.connection.destroy();
  }};
  /************************************************************/
  /************************************************************/

  exports.getPackingList2 = async (req,res) =>{ try {

	var Archivo = await client.query(` 
	SELECT 
	id
	,packing_list2 as archivo
	,packing_list2_type as tipo
	,packing_list2_ext as extension
	from public.tracking WHERE id=`+req.params.id+` 
	`);
  
	if(Archivo.rows.length<=0)
	{
	  res.status(400).send({
	  message: "NO SE ENCONTRO UN ARCHIVO",
	  success:false }); res.end(); res.connection.destroy();
	}
	else
	{
	  res.setHeader('Content-Type', Archivo.rows[0].tipo); 
	  res.setHeader('Content-Disposition', 'attachment; filename=packing_list2_'+Archivo.rows[0].id+Archivo.rows[0].extension);
	  res.setHeader('Content-Length', Archivo.rows[0].archivo.length);
	  res.end(Archivo.rows[0].archivo, 'binary');
	  }
  
  } catch (error) {
	console.log("ERROR "+error);
	res.status(400).send({
	message: "ERROR AL CARGAR EL ARCHIVO",
	success:false,
	}); res.end(); res.connection.destroy();
  }};
  /************************************************************/
  /************************************************************/
  exports.getInvoice1 = async (req,res) =>{ try {

	var Archivo = await client.query(` 
	SELECT 
	id
	,invoice1 as archivo
	,invoice1_type as tipo
	,invoice1_ext as extension
	from public.tracking WHERE id=`+req.params.id+` 
	`);
  
	if(Archivo.rows.length<=0)
	{
	  res.status(400).send({
	  message: "NO SE ENCONTRO UN ARCHIVO",
	  success:false }); res.end(); res.connection.destroy();
	}
	else
	{
	  res.setHeader('Content-Type', Archivo.rows[0].tipo); 
	  res.setHeader('Content-Disposition', 'attachment; filename=invoice1_'+Archivo.rows[0].id+Archivo.rows[0].extension);
	  res.setHeader('Content-Length', Archivo.rows[0].archivo.length);
	  res.end(Archivo.rows[0].archivo, 'binary');
	  }
  
  } catch (error) {
	console.log("ERROR "+error);
	res.status(400).send({
	message: "ERROR AL CARGAR EL ARCHIVO",
	success:false,
	}); res.end(); res.connection.destroy();
  }};
  /************************************************************/
  /************************************************************/
  exports.getInvoice2 = async (req,res) =>{ try {

	var Archivo = await client.query(` 
	SELECT 
	id
	,invoice2 as archivo
	,invoice2_type as tipo
	,invoice2_ext as extension
	from public.tracking WHERE id=`+req.params.id+` 
	`);
  
	if(Archivo.rows.length<=0)
	{
	  res.status(400).send({
	  message: "NO SE ENCONTRO UN ARCHIVO",
	  success:false }); res.end(); res.connection.destroy();
	}
	else
	{
	  res.setHeader('Content-Type', Archivo.rows[0].tipo); 
	  res.setHeader('Content-Disposition', 'attachment; filename=invoice2_'+Archivo.rows[0].id+Archivo.rows[0].extension);
	  res.setHeader('Content-Length', Archivo.rows[0].archivo.length);
	  res.end(Archivo.rows[0].archivo, 'binary');
	  }
  
  } catch (error) {
	console.log("ERROR "+error);
	res.status(400).send({
	message: "ERROR AL CARGAR EL ARCHIVO",
	success:false,
	}); res.end(); res.connection.destroy();
  }};
  /************************************************************/
  /************************************************************/

  exports.delete = async (req,res) =>{
  	try{
  		if (!req.params.id) {
        	res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
   		}

   		//gc_propuestas_proveedores
   		const registro=await client.query(`SELECT *FROM public.tracking where id=`+parseInt(req.params.id));
   		if(registro && registro.rows){
   			await client.query(`DELETE FROM public.tracking_detalle where tracking_id=`+parseInt(req.params.id));
   			await client.query(`DELETE FROM public.tracking where id=`+parseInt(req.params.id));
   			if(registro.rows[0].fk_proveedor_cliente!==null){
   				await client.query('UPDATE public.gc_propuestas_proveedores SET estado=999 WHERE id='+parseInt(registro.rows[0].fk_proveedor_cliente));
   			}
   		}	
        res.status(200).send([]);
        res.end(); res.connection.destroy();

  	}catch (error) {
	console.log("ERROR "+error);
	res.status(400).send({
	message: "ERROR AL ELIMINAR EL TRACKING",
	success:false,
	}); res.end(); res.connection.destroy();
 	 }
  };
  exports.exports_excel = async (req,res)=>{
	  try{

		async function insertar_tracking(codCliente,nombreProveedor,fecha1,fecha2,bultos,peso,volumen,estado,bultosPorLlegar,producto)
		{
			let existeCliente=null;let idCliente=null;
			let existeProveedor=null;let idProveedor=null;let bultosFinales=0;let bultosFor=0;
			if(typeof codCliente!='undefined'){
				existeCliente = await client.query(` 
					select
					*
					from
					public.clientes
					where
					id=`+parseInt(codCliente));
			}
			
			if(existeCliente!==null && existeCliente.rows[0] && existeCliente.rows[0].id){
				//console.log(existeCliente.rows[0]);
				idCliente=existeCliente.rows[0].id;
			}

			if(typeof nombreProveedor!='undefined'){
				if(nombreProveedor.length>0){
					nombreProveedor=nombreProveedor.replace(/'/g, " ");
				}
				
				existeProveedor = await client.query(` 
					select
					*
					from
					public.proveedores
					where
					nombre='`+nombreProveedor+`'`);
			}else{
				nombreProveedor="";
			}

			if(existeProveedor!==null && existeProveedor.rows[0] && existeProveedor.rows[0].id){
				idProveedor=existeProveedor.rows[0].id;
			}else{
				let query0=`INSERT INTO public.proveedores(codigo,fk_cliente,"codigoTributario",nombre,"nombreChi") VALUES(`+null+`,`+idCliente+`,`+null+`,'`+nombreProveedor+`','`+nombreProveedor+`') RETURNING *`;
				let proveedor=await client.query(query0);
				if(proveedor.rows && proveedor.rows.length>0){
					idProveedor=proveedor.rows[0].id;
				}
			}

			if(parseInt(estado)===2){
				if(bultosPorLlegar!==null){
					bultosFinales=bultosPorLlegar;
					bultosFor=bultosFinales;
				}else if(bultos!==null){
					bultosFinales=bultos;
					bultosFor=bultos;
				}
			}else{
				if(bultosPorLlegar!==null){
					bultosFinales=bultosPorLlegar;
				}
				if(bultos!==null){
					bultosFor=bultos;
				}
			}
			

			let insert_1 = '';     let insert_2 = '';
			insert_1 += ` fecha_creacion, `;  
			if(fecha1!=null){
				insert_2 += ` '`+fecha1+`', `;
			}else{
				insert_2 += ` `+fecha1+`,`;
			}

			insert_1 += ` fecha_recepcion, `;  
			if(fecha2!=null){
				insert_2 += ` '`+fecha2+`', `;
			}else{
				insert_2 += ` `+fecha2+`,`;
			}
			
			insert_1 += ` cantidad_bultos, `;  
			insert_2 += ` `+bultosFinales+`,`;

			insert_1 += ` peso, `; 
			insert_2 += ` `+peso+`,`;

			insert_1 += ` volumen, `;  
			insert_2 += ` `+volumen+`,`;

			insert_1 += ` tipo_carga, `;  
			insert_2 += ` `+0+`,`;

			insert_1 += ` fk_proveedor, `;  
			insert_2 += ` `+idProveedor+`,`;

			insert_1 += ` fk_cliente, `;
			insert_2 += ` `+idCliente+`,`;
			
			insert_1 += ` tipo, `;  
			insert_2 += ` `+0+`,`;

			insert_1 += ` estado `;  

			insert_2 += ` `+parseInt(estado)+` `;



			let queryFinal=` INSERT INTO public.tracking ( `+insert_1+` ) values ( `+insert_2+` ); `;
			let newTracking=null;
			newTracking=await client.query(` INSERT INTO public.tracking ( `+insert_1+` ) values ( `+insert_2+` ) RETURNING * `);
			
			if(newTracking.rows && newTracking.rows.length>0){
				if(bultosFor>0){

					for(let x=0; x<bultosFor;x++){

						let ins1='';let ins2=''; let pesoD=0; let volumenD=0;

						if(peso!==null){
							pesoD=peso/bultosFor;
						}

						if(volumen!==null){
							volumenD=volumen/bultosFor;
						}

						if(typeof producto==='undefined'){
							producto='NN';
						}

						ins1+=` fecha_recepcion, `; 

						ins2+=` '`+moment().format('YYYYMMDD 000000')+`', `; 

						ins1+=` fecha_consolidado, `; 

						ins2+=` '`+moment().format('YYYYMMDD 000000')+`', `; 

						ins1+=` tipo_producto, `; 

						ins2+=` `+3+`,`;

						ins1+=` producto, `; 

						ins2+=` '`+producto+`', `; 

						ins1+=` peso, `; 
						ins2+=` `+pesoD+`,`;

						ins1+=` volumen, `; 

						ins2+=` `+volumenD+`,`;

						ins1+=` observacion, `; 

						ins2+=` 'CARGA MASIVA', `; 

						ins1+=` tracking_id, `; 

						ins2+=` `+newTracking.rows[0].id+`,`;

						ins1+=` estado `;

						ins2+=` `+2+` `;

						let queryFinal2=` INSERT INTO public.tracking_detalle ( `+ins1+` ) values ( `+ins2+` ); `;
						await client.query(queryFinal2);
						console.log(queryFinal2);
					}
				}
			}
			/*if(existe[0].length<=0)
			{
				var insert_1 = ``;  
				var insert_2 = ``;

				insert_1 += ` fecha, `;  
				insert_2 += ` '`+fecha+`', `;

				insert_1 += ` monto, `;
				insert_2 += ` `+monto+`, `;

				insert_1 += ` folio, `;  
				insert_2 += ` '`+folio+`', `;
				
				insert_1 += ` "createdAt", `;
				insert_2 += ` '`+dateTime+`', `;

				insert_1 += ` "updatedAt", `;
				insert_2 += ` '`+dateTime+`', `;

				insert_1 += ` fk_responsable, `;
				insert_2 += ` '`+SessionRut+`', `;

				insert_1 += ` codigo `;
				insert_2 += ` '`+aux_random+`' `;

				await db.query(` INSERT INTO public.tracking ( `+insert_1+` ) values ( `+insert_2+` ); `);
			}*/
		}
		const Archivo_Excel = xlsx.parse(`uploads/importacion_tracking.xlsx`);
		for(var row=1; row<Archivo_Excel[0].data.length; row++)
		{
			let fecha1=null;let fecha2=null;let peso=null;let volumen=null;let bultos=null;let bultosPorLlegar=null;
			if(Archivo_Excel[0].data[row][1]!==''){
				fecha1=moment(fromExcelDate(Archivo_Excel[0].data[row][1])).add(1, 'days').format("YYYYMMDD");
			}
			if(Archivo_Excel[0].data[row][2]!=''){
				fecha2=moment(fromExcelDate(Archivo_Excel[0].data[row][2])).add(1, 'days').format("YYYYMMDD");
			}

			if(Archivo_Excel[0].data[row][10]!==''){
				bultos=parseInt(Archivo_Excel[0].data[row][10])
			}

			if(Archivo_Excel[0].data[row][11]!==''){
				bultosPorLlegar=parseInt(Archivo_Excel[0].data[row][11])
			}

			if(Archivo_Excel[0].data[row][13]!==''){
				peso=parseFloat(Archivo_Excel[0].data[row][13]);
			}

			if(Archivo_Excel[0].data[row][12]!==''){
				volumen=parseFloat(Archivo_Excel[0].data[row][12]);
			}
			

			if(isNaN(bultos)){
				bultos=null;
			}

			if(isNaN(bultosPorLlegar)){
				bultosPorLlegar=null;
			}

			if(isNaN(peso)){
				peso=null;
			}

			if(isNaN(volumen)){
				volumen=null;
			}
			if(fecha1=='Invalid date'){
				fecha1=null;
			}

			if(fecha2=='Invalid date'){
				fecha2=null;
			}
			insertar_tracking(Archivo_Excel[0].data[row][3],Archivo_Excel[0].data[row][8],fecha1,fecha2,bultos,peso,volumen,Archivo_Excel[0].data[row][17],bultosPorLlegar,Archivo_Excel[0].data[row][9]);
		}

		res.status(200).send([]);
        res.end(); res.connection.destroy();
	  }catch (error) {
		//console.log("ERROR "+error);
		res.status(400).send({
		message: "ERROR AL IMPORTA EXCEL DEL TRACKING",
		success:false,
		}); res.end(); res.connection.destroy();
 	 }
  }
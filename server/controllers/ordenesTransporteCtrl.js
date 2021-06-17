const client = require('../config/db.client');
const bcrypt= require('bcrypt');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const moment=require('moment');

exports.list = async (req, res) => {
    try {
        const result=await client.query('SELECT ot.*,c.codigo as fk_contenedor_codigo,u.nombre as fk_usuario_creacion_nombre, u.apellidos as fk_usuario_creacion_apellidos,e.patente FROM public.orden_transporte ot LEFT JOIN public.contenedor c on c.id=ot.fk_contenedor INNER JOIN public.usuario u on u.id=ot.fk_usuario_creacion INNER JOIN public.equipos e on e.id=ot.fk_equipo ORDER BY ot.id DESC');
        
        const ids=[];
        if(result.rows && result.rows.length){
            const final=lodash.cloneDeep(result.rows);
            for(var i=0;i<result.rows.length;i++){
                ids.push(result.rows[i].id);
            }

            let queryIn='';
            if(ids.length>0){
                queryIn+='WHERE otd.fk_orden_transporte IN (';
                for(var x=0;x<ids.length;x++){
                    if(x!==ids.length-1){
                        queryIn+=ids[x]+','
                    }else{
                        queryIn+=ids[x]
                    }
                }
                queryIn+=')';
            }

            let queryFinal='SELECT td.id,td.upload_id,td.fecha_recepcion,td.fecha_consolidado,td.codigo_interno,td.tipo_producto,td.producto,td.peso,td.volumen,td.observacion,td.tracking_id,td.estado,CASE WHEN td.foto1 IS NOT NULL THEN TRUE ELSE FALSE END AS foto1,CASE WHEN td.foto2 IS NOT NULL THEN TRUE ELSE FALSE END AS foto2,CASE WHEN td.foto3 IS NOT NULL THEN TRUE ELSE FALSE END AS foto3,td.ancho,td.alto,td.altura,td.ubicacion,td.fk_currier,td.numero_seguimiento,c.nombre as fk_currier_nombre,c.nombre_chino as fk_currier_nombre_chino,ot.id as fk_orden_transporte,otd.id as fk_orden_transporte_detalle,cl.id as fk_cliente,cl.codigo as fk_cliente_codigo,cl."razonSocial" as fk_cliente_razon_social,p.id as fk_proveedor,p.codigo as fk_proveedor_codigo,p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino FROM public.tracking_detalle td inner join public.orden_transporte_detalle otd on otd.fk_tracking_detalle=td.id inner join public.orden_transporte ot on ot.id=otd.fk_orden_transporte left join public.currier c on c.id=td.fk_currier inner join public.tracking t on t.id=td.tracking_id inner join public.clientes cl on cl.id=t.fk_cliente inner join public.proveedores p on p.id=t.fk_proveedor '+queryIn;
            const resultFinal= await client.query(queryFinal);

            if(resultFinal && resultFinal.rows && resultFinal.rows.length>0){
                for(var i=0;i<final.length;i++){
                    const filterArray=resultFinal.rows.filter(y=>y.fk_orden_transporte===final[i].id);
                    if(filterArray){
                        final[i].detalle=filterArray;
                    }else{
                        final[i].detalle=[];
                    }
                }
            }

            res.status(200).send(final);
            res.end(); res.connection.destroy();
        }else{
            res.status(200).send([]);
            res.end(); res.connection.destroy();
        }    
    } catch (error) {
        console.log('ERROR LIST ORDEN TRANSPORTE '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL OBTENER EL LISTADO DE ORDENES DE TRANSPORTE",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.create = async (req, res) => {
    try {
        if (!req.body.ots) {
            res.status(400).send({
              message: "Las OT'S son obligatorias",
              success:false
            });
            return;
        }
        if(req.body.ots && req.body.ots.length>0){
            let query=null;

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

            for(let i=0;i< req.body.ots.length;i++){
               // if(req.body.tipo===2 || req.body.tipo===3){//contenedor o camion
                    query={
                        text:'INSERT INTO public.orden_transporte(fk_usuario_creacion, fecha_creacion,tipo,fk_equipo,fk_contenedor,estado,fecha) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING*',
                        values:[req.usuario.id,moment().format('YYYYMMDD HHmmss'), req.body.ots[i].tipo,req.body.ots[i].fk_equipo,req.body.ots[i].fk_contenedor,req.body.ots[i].estado,req.body.ots[i].fecha]
                    };

                    const result=await client.query(query);

                    if(result && result.rows && result.rows.length>0 && req.body.ots[i].detalle && req.body.ots[i].detalle){
                        for(let y=0;y<req.body.ots[i].detalle.length;y++){
                            let query2={
                                text:'INSERT INTO public.orden_transporte_detalle(fk_orden_transporte, fk_tracking_detalle,estado) VALUES($1,$2,$3) RETURNING*',
                                values:[result.rows[0].id,req.body.ots[i].detalle[y].id,0]
                            };
                            const result2=await client.query(query2);
                        }
                    }
               // }else if(tipo===1){//bodega
                    /*query={
                        text:'INSERT INTO public.orden_transporte(fk_usuario_creacion, fecha_creacion,tipo,fk_equipo,fk_contenedor,estado) VALUES($1,$2,$3,$4,$5,$6) RETURNING*',
                        values:[moment().format('YYYYMMDD HHmmss')]
                    }*/
                //}
                
            }
        }
        res.status(200).send([]);
        res.end(); res.connection.destroy();  
    } catch (error) {
        console.log('ERROR CREATE ORDEN TRANSPORTE '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL CREAR UNA ORDEN DE TRANSPORTE",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.delete = async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).send({
              message: "El id es obligatorio",
              success:false
            });
            return;
        }
        await client.query('DELETE FROM public.orden_transporte where id='+parseInt(req.params.id));
        await client.query('DELETE FROM public.orden_transporte_detalle where fk_orden_transporte='+parseInt(req.params.id));
        res.status(200).send([]);
        res.end(); res.connection.destroy();  
    } catch (error) {
        console.log('ERROR DELETE ORDEN TRANSPORTE '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL ELIMINAR UNA ORDEN DE TRANSPORTE",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.listByDate = async (req, res) => {
    try {
        const result=await client.query(`SELECT ot.*,c.codigo as fk_contenedor_codigo,u.nombre as fk_usuario_creacion_nombre, u.apellidos as fk_usuario_creacion_apellidos,e.patente FROM public.orden_transporte ot LEFT JOIN public.contenedor c on c.id=ot.fk_contenedor INNER JOIN public.usuario u on u.id=ot.fk_usuario_creacion INNER JOIN public.equipos e on e.id=ot.fk_equipo WHERE TO_CHAR(ot.fecha, 'DDMMYYYY')='`+req.params.fecha+`' ORDER BY ot.id DESC`);
        if(result.rows && result.rows.length){
            res.status(200).send(result.rows);
            res.end(); res.connection.destroy();
        }else{
            res.status(200).send([]);
            res.end(); res.connection.destroy();
        }    
    } catch (error) {
        console.log('ERROR LIST ORDEN TRANSPORTE '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL OBTENER EL LISTADO DE ORDENES DE TRANSPORTE",
        success:false,}); res.end(); res.connection.destroy();
    }
};
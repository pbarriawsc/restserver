const client = require('../config/db.client');
const bcrypt= require('bcrypt');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const moment=require('moment');
const enviarEmail = require('../../handlers/email');

exports.list = async (req, res) => {
    try {
        const result=await client.query('SELECT pld.*,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos,c.codigo as fk_contenedor_codigo FROM public.pl_desconsolidado pld inner join public.usuario u on u.id=pld.fk_usuario_creacion inner join public.contenedor c on c.id=pld.fk_contenedor');
        if(result.rows){
            res.status(200).send(result.rows);
            res.end(); res.connection.destroy();
        }else{
            res.status(200).send([]);
            res.end(); res.connection.destroy();
        }    
    } catch (error) {
        console.log('ERROR Create '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL OBTENER EL LISTADO DE PLANIFICACIONES",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.create = async (req, res) => {
    try {
        if (!req.body.fk_contenedor) {
            res.status(400).send({
              message: "El contenedor es obligatorio",
              success:false
            });
            return;
        }else if(!req.body.detalle) {
            res.status(400).send({
              message: "El detalle es obligatorio",
              success:false
            });
            return;
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

        const query={
            text:'INSERT INTO public.pl_desconsolidado(fk_contenedor,fk_usuario_creacion,fk_usuario_modificacion,fecha_creacion,fecha_descarga,estado) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            values:[req.body.fk_contenedor,req.usuario.id,req.usuario.id,moment().format('YYYYMMDD HHmmss'),req.body.fecha_descarga,0]
        };

        const result=await client.query(query);
        if(result && result.rows && result.rows.length>0 && req.body.detalle && req.body.detalle.length>0){
            for(let i=0;i<req.body.detalle.length;i++){
                let query2={
                    text:'INSERT INTO public.pl_desconsolidado_detalle(fk_pl_desconsolidado,fk_tracking_detalle,opcion,estado,fk_camion,fk_orden_transporte) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
                    values:[result.rows[0].id,req.body.detalle[i].id,req.body.detalle[i].accion,0,req.body.detalle[i].camion,req.body.detalle[i].fk_orden_transporte]
                };
                await client.query(query2);

                if(parseInt(req.body.detalle[i].fk_orden_transporte)>0){
                    let query21={
                                text:'INSERT INTO public.orden_transporte_detalle(fk_orden_transporte, fk_tracking_detalle,estado) VALUES($1,$2,$3) RETURNING*',
                                values:[parseInt(req.body.detalle[i].fk_orden_transporte),req.body.detalle[i].id,0]
                            };
                    const result21=await client.query(query21);
                }
            }

            /***ACTUALIZACION DE PAGOS***/
            if(req.body.pagos && req.body.pagos.length>0){
                for(let i=0;i<req.body.pagos.length;i++){
                    let query3={
                            text:'UPDATE public.tracking SET estado_pago=$1 where id=$2 RETURNING*',
                            values:[req.body.pagos[i].estado_pago,req.body.pagos[i].fk_tracking]
                    };
                    await client.query(query3);
                }
            }

            /***ACTUALIZACION DE PAGOS***/

            if(req.body.confirmar){
                /**ENVIAR EMAIL**/
                enviarEmail.mail_notificacion_planificacion_confirmada({ 
                    asunto:"WS CARGO - PLANIFICACION CONFIRMADA " + moment().format('DD-MM-YYYY HH:mm:ss') ,fecha_descarga:moment(req.body.fecha_descarga).format('DD-MM-YYYY'),email:'pbarria.reyes@gmail.com',contenedor:req.body.fk_contenedor_codigo,clientes:req.body.clientes_email
                 });
            }

            res.status(200).send(result.rows[0]);
            res.end(); res.connection.destroy();
        }else{
            res.status(400).send({
                message: "ERROR INSERT PLANIFICACION DE DESCONSOLIDADO",
                success:false,}); res.end(); res.connection.destroy();
        }
    } catch (error) {
        console.log('ERROR Create '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL CREAR UNA PLANIFICACION DE DESCONSOLIDADO",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.findOneBy = async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).send({
              message: "El id es obligatorio",
              success:false
            });
            return;
        }

        const result=await client.query('SELECT pld.*,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos,c.codigo as fk_contenedor_codigo FROM public.pl_desconsolidado pld inner join public.usuario u on u.id=pld.fk_usuario_creacion inner join public.contenedor c on c.id=pld.fk_contenedor WHERE pld.id='+parseInt(req.params.id))
        if(result && result.rows){
            const detalle=await client.query('SELECT pldd.*,td.fecha_recepcion,td.fecha_consolidado,td.tipo_producto,td.producto,td.peso,td.volumen,td.ubicacion,td.codigo_interno,td.observacion,t.fk_cliente,t.fk_proveedor,c.codigo as fk_cliente_codigo, c."razonSocial" as fk_cliente_razonsocial,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre, p."nombreChi" as fk_proveedor_nombre_chi,e.patente  FROM public.pl_desconsolidado_detalle pldd inner join public.tracking_detalle td on td.id=pldd.fk_tracking_detalle inner join public.tracking t on t.id=td.tracking_id inner join public.clientes c on c.id=t.fk_cliente inner join public.proveedores p on p.id=t.fk_proveedor left join public.equipos e on e.id= pldd.fk_camion WHERE pldd.fk_pl_desconsolidado='+parseInt(req.params.id));
            let newItem=lodash.cloneDeep(result.rows[0]);
            if(detalle && detalle.rows){
                newItem.detalle=detalle.rows;
            }else{
                newItem.detalle=[];
            }
            res.status(200).send(newItem);
            res.end(); res.connection.destroy();
        }else{
            console.log('ERROR AL OBTENER POR ID '); console.log(' '); console.log(' ');
            res.status(400).send({
            message: "ERROR AL OBTENER LA PLANIFICACION DE DESCONSOLIDADO POR ID",
            success:false,}); res.end(); res.connection.destroy();
        }
        
    } catch (error) {
        console.log('ERROR GET BY ID '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL OBTENER LA PLANIFICACION DE DESCONSOLIDADO POR ID",
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
        await client.query('DELETE FROM public.pl_desconsolidado WHERE id='+parseInt(req.params.id));
        await client.query('DELETE FROM public.pl_desconsolidado_detalle WHERE fk_pl_desconsolidado='+parseInt(req.params.id));
        res.status(200).send([]);
        res.end(); res.connection.destroy();
    } catch (error) {
        console.log('ERROR Create '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL ELIMINAR LA PLANIFICACION DE DESCONSOLIDADO",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).send({
              message: "El id es obligatorio",
              success:false
            });
            return;
          }
        res.status(200).send([]);
        res.end(); res.connection.destroy();
    } catch (error) {
        console.log('ERROR Create '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL ACTUALIZAR LA PLANIFICACION DE DESCONSOLIDADO",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.findOneByContenedor = async (req, res) => {
    try {
        if (!req.params.fk_contenedor) {
            res.status(400).send({
              message: "El contenedor es obligatorio",
              success:false
            });
            return;
        }

        const result=await client.query('SELECT pld.*,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos,c.codigo as fk_contenedor_codigo FROM public.pl_desconsolidado pld inner join public.usuario u on u.id=pld.fk_usuario_creacion inner join public.contenedor c on c.id=pld.fk_contenedor WHERE pld.fk_contenedor='+parseInt(req.params.fk_contenedor)+' and pld.estado=0');
        if(result && result.rows && result.rows.length>0){
            const detalle=await client.query('SELECT pldd.*,td.fecha_recepcion,td.fecha_consolidado,td.tipo_producto,td.producto,td.peso,td.volumen,td.ubicacion,td.codigo_interno,td.observacion,t.fk_cliente,t.fk_proveedor,c.codigo as fk_cliente_codigo, c."razonSocial" as fk_cliente_razonsocial,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre, p."nombreChi" as fk_proveedor_nombre_chi,e.patente  FROM public.pl_desconsolidado_detalle pldd inner join public.tracking_detalle td on td.id=pldd.fk_tracking_detalle inner join public.tracking t on t.id=td.tracking_id inner join public.clientes c on c.id=t.fk_cliente inner join public.proveedores p on p.id=t.fk_proveedor  left join public.equipos e on e.id= pldd.fk_camion WHERE pldd.fk_pl_desconsolidado='+parseInt(result.rows[0].id));
            let newItem=lodash.cloneDeep(result.rows[0]);
            if(detalle && detalle.rows){
                newItem.detalle=detalle.rows;
            }else{
                newItem.detalle=[];
            }
            res.status(200).send(newItem);
            res.end(); res.connection.destroy();
        }else{
            console.log('ERROR AL OBTENER POR ID '); console.log(' '); console.log(' ');
            res.status(400).send({
            message: "NO EXISTEN PLANIFICACIONES ASOCIADAS AL CONTENEDOR",
            success:false,}); res.end(); res.connection.destroy();
        }
        
    } catch (error) {
        console.log('ERROR GET BY ID '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL OBTENER LA PLANIFICACION DE DESCONSOLIDADO POR ID",
        success:false,}); res.end(); res.connection.destroy();
    }
};
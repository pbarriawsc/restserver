const client = require('../config/db.client');
const bcrypt= require('bcrypt');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const moment=require('moment');

exports.list = async (req, res) => {
    try {
        const result=await client.query('SELECT *FROM public.orden_transporte');
        if(result.rows){
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
                if(req.body.tipo===2 || req.body.tipo===3){//contenedor o camion
                    query={
                        text:'INSERT INTO public.orden_transporte(fk_usuario_creacion, fecha_creacion,tipo,fk_equipo,fk_contenedor,estado) VALUES($1,$2,$3,$4,$5,$6) RETURNING*',
                        values:[req.usuario.id,moment().format('YYYYMMDD HHmmss'), req.body.ots[i].tipo,req.body.ots[i].fk_equipo,req.body.ots[i].fk_contenedor,req.body.ots[i].estado]
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
                }else if(tipo===1){//bodega
                    /*query={
                        text:'INSERT INTO public.orden_transporte(fk_usuario_creacion, fecha_creacion,tipo,fk_equipo,fk_contenedor,estado) VALUES($1,$2,$3,$4,$5,$6) RETURNING*',
                        values:[moment().format('YYYYMMDD HHmmss')]
                    }*/
                }
                
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
const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const moment=require('moment');

exports.create = async (req, res) => {
    try {
        if (!req.body.fk_contenedor) {
            res.status(400).send({
              message: "El contenedor es obligatorio",
              success:false
            });
            return;
        }else if(!req.body.fk_cliente){
            res.status(400).send({
              message: "El cliente es obligatorio",
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

        let final=[];

        const query1={
            text:'SELECT *FROM public.cliente_gestion_despacho WHERE fk_cliente=$1 and fk_contenedor=$2 and estado=1',
            values:[req.body.fk_cliente,req.body.fk_contenedor]
        };
        const result1=await client.query(query1);


        if(result1 && result1.rows && result1.rows.length>0){
            const query2={
                text:'UPDATE public.cliente_gestion_despacho SET fk_cliente=$1,fk_contenedor=$2,fk_cliente_direccion_despacho=$3,fecha_despacho=$4,observacion_despacho=$5,tipo_despacho=$6,fk_usuario=$7 WHERE id=$8 RETURNING*',
                values:[req.body.fk_cliente,req.body.fk_contenedor,req.body.fk_direccion,req.body.fecha_despacho,req.body.observacion_despacho,req.body.tipo_despacho,req.usuario.id,result1.rows[0].id]
            };
            const result2=await client.query(query2);

            if(result2 && result2.rows){
                final=lodash.cloneDeep(result2.rows[0]);
            }
        }else{
            const query2={
                text:'INSERT INTO public.cliente_gestion_despacho(fk_cliente,fk_contenedor,fk_cliente_direccion_despacho,fecha_despacho,observacion_despacho,tipo_despacho,fk_usuario,estado) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING*',
                values:[req.body.fk_cliente,req.body.fk_contenedor,req.body.fk_direccion,req.body.fecha_despacho,req.body.observacion_despacho,req.body.tipo_despacho,req.usuario.id,1]
            };
            const result2=await client.query(query2);
            if(result2 && result2.rows){
                final=lodash.cloneDeep(result2.rows[0]);
            }
        }


        if(req.body.detalle && req.body.detalle.length>0){

            for(let i=0;i<req.body.detalle.length;i++){
                let query3={
                    text:'UPDATE public.tracking SET fk_cliente_direccion_despacho=$1,observacion_despacho=$2,fecha_despacho=$3,tipo_despacho=$4 WHERE id=$5 RETURNING*',
                    values:[req.body.detalle[i].fk_direccion,req.body.detalle[i].observacion_despacho,req.body.detalle[i].fecha_despacho,req.body.detalle[i].tipo_despacho,parseInt(req.body.detalle[i].id)]
                };

                let result3=await client.query(query3);
            }  
        }
        
            res.status(200).send(final);
            res.end(); res.connection.destroy();
    } catch (error) {
        console.log('ERROR Create '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR GUARDAR CLIENTE GESTION DESPACHO",
        success:false,}); res.end(); res.connection.destroy();
    }
};
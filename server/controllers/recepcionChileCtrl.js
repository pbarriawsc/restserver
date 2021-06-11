const client = require('../config/db.client');
const bcrypt= require('bcrypt');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const moment=require('moment');
const { result } = require('lodash');


exports.createSimple = async (req, res) => {
    try {
        if (!req.body.detalle) {
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
        let trackingId=0;
        let idsPl=[];
        
        if(req.body.detalle && req.body.detalle.length>0){
            trackingId=req.body.detalle[0].tracking_id;
            for(var i=0;i<req.body.detalle.length;i++){
                const result0=await client.query('SELECT *FROM movimiento_recepcion WHERE fk_contenedor='+parseInt(req.body.fk_contenedor)+' AND fk_tracking_detalle='+parseInt(req.body.detalle[i].id));
                if(result0 && result0.rows && result0.rows.length>0){
                    console.log('EXISTE EL REGISTRO');
                }else{
                    const query={
                        text:'INSERT INTO public.movimiento_recepcion(fk_contenedor,fk_tracking_detalle,fk_usuario,opcion,fecha,estado) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
                        values:[parseInt(req.body.fk_contenedor),parseInt(req.body.detalle[i].id),req.usuario.id,req.body.detalle[i].opcion,moment().format('YYYYMMDD HHmmss'),0]
                    };
                    const result=await client.query(query);
                    if(result && result.rows && result.rows.length>0){
                        const query2= {
                            text: 'UPDATE public.tracking_detalle SET estado=4 WHERE id=$1 RETURNING *',
                            values: [req.body.detalle[i].id],
                        };
                        const result2=await client.query(query2);
                        if(!result2 || !result2.rows){
                            console.log('ERROR AL ACTUALIZAR TABLA TRACKING DETALLE (MOVIMIENTO RECEPCION)');
                        }
                    }else{
                        console.log('ERROR AL INSERTAR TABLA MOVIMIENTO RECEPION');
                    }

                    if(req.body.detalle[i].fk_pl_desconsolidado_detalle  && req.body.detalle[i].fk_pl_desconsolidado_detalle!==null && req.body.detalle[i].fk_pl_desconsolidado_detalle>0){
                        const query3= {
                            text: 'UPDATE public.pl_desconsolidado_detalle SET estado=1 WHERE id=$1 RETURNING *',
                            values: [req.body.detalle[i].fk_pl_desconsolidado_detalle],
                        };
                        const result3=await client.query(query3);
                        if(!result3 || !result3.rows){
                            console.log('ERROR AL ACTUALIZAR TABLA PL DESCONSOLIDADO DETALLE (MOVIMIENTO RECEPCION)');
                        }

                        if(req.body.detalle[i].fk_pl_desconsolidado!==null && req.body.detalle[i].fk_pl_desconsolidado>0){
                            let find=idsPl.find(x=>x===req.body.detalle[i].fk_pl_desconsolidado);
                            if(!find){
                                idsPl.push(req.body.detalle[i].fk_pl_desconsolidado);
                                
                            }
                        }
                    }

                }
            } 
        }

        if(trackingId>0){
            const result4=await client.query('SELECT id FROM public.tracking_detalle where tracking_id='+parseInt(trackingId)+' and estado < 4 and estado >=0');
            if(result4 && result4.rows && result4.rows.length>0){
                //existen, por lo tanto no se cambia el estado de la cabecera
            }else{
                const query5= {
                    text: 'UPDATE public.tracking SET estado=4 WHERE id=$1 RETURNING *',
                    values: [parseInt(trackingId)],
                };
                const result5=await client.query(query5);
                if(result5 && result5.rows && result5.rows.length>0){
                    //actualizacion encabezado correcta
                }else{
                    console.log('ERROR AL ACTUALIZAR CABECERA TRACKING')
                }
            }
        }

        if(idsPl && idsPl.length>0){
            for(var x=0;x<idsPl.length;x++){
                const result6=await client.query('SELECT id FROM public.pl_desconsolidado_detalle WHERE fk_pl_desconsolidado='+parseInt(idsPl[x])+' AND estado=0');
                if(result6 && result6.rows && result6.rows.length>0){
                    //no se hace nada porque aun quedan registros pendientes
                }else{
                    const query7= {
                        text: 'UPDATE public.pl_desconsolidado SET estado=1 WHERE id=$1 RETURNING *',
                        values: [parseInt(idsPl[x])],
                    };
                    const result7=await client.query(query7);
                    if(result7 && result7.rows && result7.rows.length>0){
                        //actualizacion encabezado correcta
                    }else{

                        console.log('ERROR AL ACTUALIZAR CABECERA PL DESCONSOLIDADO')
                    }
                }
            }
        }
        res.status(200).send([]);
        res.end(); res.connection.destroy();
    } catch (error) {
        console.log('ERROR CREATE SIMPLE '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR CONFIRMAR LA RECEPCION",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.createBodega = async (req, res) => {
    try {
        if (!req.body.detalle) {
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
        let trackingId=0;
        let idsPl=[];
        let peso=0;
        let volumen=0;
        let saldo=0;
        let pesoSaldo=0;
        let volumenSaldo=0;
        let codigoInterno='';
        let fkUbicacion=0;
       
        if(req.body.detalle && req.body.detalle.length>0){
            trackingId=req.body.detalle[0].tracking_id;
            codigoInterno=req.body.detalle[0].codigo_interno;
            fkUbicacion=req.body.detalle[0].fk_ubicacion;
            for(var i=0;i<req.body.detalle.length;i++){
                peso=peso+req.body.detalle[i].peso;
                volumen=volumen+req.body.detalle[i].volumen;
                const result0=await client.query('SELECT *FROM movimiento_recepcion WHERE fk_contenedor='+parseInt(req.body.fk_contenedor)+' AND fk_tracking_detalle='+parseInt(req.body.detalle[i].id));
                if(result0 && result0.rows && result0.rows.length>0){
                    console.log('EXISTE EL REGISTRO');
                }else{
                    const query={
                        text:'INSERT INTO public.movimiento_recepcion(fk_contenedor,fk_tracking_detalle,fk_usuario,opcion,fecha,estado) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
                        values:[parseInt(req.body.fk_contenedor),parseInt(req.body.detalle[i].id),req.usuario.id,req.body.detalle[i].opcion,moment().format('YYYYMMDD HHmmss'),0]
                    };
                    const result=await client.query(query);
                    if(result && result.rows && result.rows.length>0){
                        const query2= {
                            text: 'UPDATE public.tracking_detalle SET estado=4 WHERE id=$1 RETURNING *',
                            values: [req.body.detalle[i].id],
                        };
                        const result2=await client.query(query2);
                        if(!result2 || !result2.rows){
                            console.log('ERROR AL ACTUALIZAR TABLA TRACKING DETALLE (MOVIMIENTO RECEPCION)');
                        }
                    }else{
                        console.log('ERROR AL INSERTAR TABLA MOVIMIENTO RECEPION');
                    }

                    if(req.body.detalle[i].fk_pl_desconsolidado_detalle  && req.body.detalle[i].fk_pl_desconsolidado_detalle!==null && req.body.detalle[i].fk_pl_desconsolidado_detalle>0){
                        const query3= {
                            text: 'UPDATE public.pl_desconsolidado_detalle SET estado=1 WHERE id=$1 RETURNING *',
                            values: [req.body.detalle[i].fk_pl_desconsolidado_detalle],
                        };
                        const result3=await client.query(query3);
                        if(!result3 || !result3.rows){
                            console.log('ERROR AL ACTUALIZAR TABLA PL DESCONSOLIDADO DETALLE (MOVIMIENTO RECEPCION)');
                        }

                        if(req.body.detalle[i].fk_pl_desconsolidado!==null && req.body.detalle[i].fk_pl_desconsolidado>0){
                            let find=idsPl.find(x=>x===req.body.detalle[i].fk_pl_desconsolidado);
                            if(!find){
                                idsPl.push(req.body.detalle[i].fk_pl_desconsolidado);
                                
                            }
                        }
                    }

                    const result31=await client.query('SELECT *FROM public.bodega_ubicacion_detalle WHERE fk_bodega_ubicacion='+ req.body.detalle[i].fk_ubicacion+' AND fk_tracking_detalle='+req.body.detalle[i].id);

                    if(result31 && result31.rows && result31.rows.length>0){

                    }else{
                        const query32={
                            text:'INSERT INTO public.bodega_ubicacion_detalle(fk_bodega_ubicacion,fk_contenedor,fk_tracking_detalle,fk_usuario,fecha,estado)VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
                            values:[req.body.detalle[i].fk_ubicacion,req.body.fk_contenedor,req.body.detalle[i].id,req.usuario.id,moment().format('YYYYMMDD HHmmss'),0]
                        };

                        const result32=await client.query(query32);
                        if(result32 && result32.rows && result32.rows.length>0){

                        }else{
                            console.log('ERROR AL INSERTAR TABLA BODEGA UBICACION DETALLE (MOVIMIENTO RECEPCION)');
                        }
                    }
                }
            } 

            //INSERCION KARDEX
            const result33=await client.query(`SELECT *FROM public.kardex WHERE fk_contenedor=`+req.body.fk_contenedor+` and codigo_interno='`+codigoInterno+`' and fk_tracking=`+trackingId+' and fk_bodega_ubicacion='+fkUbicacion+' and entrada='+req.body.detalle.length+' and peso='+peso+' and volumen='+volumen);
            if(result33 && result33.rows && result33.rows.length>0){
                console.log('EXISTE REGISTRO EN KARDEX (MOVIMIENTO RECEPCION)');
            }else{
                const result34=await client.query(`SELECT *FROM public.kardex WHERE fk_bodega_ubicacion=`+fkUbicacion+` order by id desc limit 1`);

                if(result34 && result34.rows && result34.rows.length>0){
                    saldo=saldo+result34.rows[0].saldo;
                    pesoSaldo=result34.rows[0].peso_saldo+peso;
                    volumenSaldo=result34.rows[0].volumen_saldo+volumen;
                }else{
                    saldo=req.body.detalle.length;
                    pesoSaldo=peso;
                    volumenSaldo=volumen;
                }

                const query35={
                    text:'INSERT INTO public.kardex(fk_contenedor,codigo_interno,fk_tracking,fk_bodega_ubicacion,entrada,peso,volumen,fk_usuario,fecha,estado,saldo,peso_saldo,volumen_saldo)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
                    values:[req.body.fk_contenedor,codigoInterno,trackingId,fkUbicacion,req.body.detalle.length,peso,volumen,req.usuario.id,moment().format('YYYYMMDD HHmmss'),0,saldo,pesoSaldo,volumenSaldo]
                };
                const result35=await client.query(query35);
                if(result35 && result35.rows && result35.rows.length>0){
                    console.log('EXITO AL INSERTAR TABLA KARDEX (MOVIMIENTO RECEPCION)');
                }else{
                    console.log('ERROR AL INSERTAR TABLA KARDEX (MOVIMIENTO RECEPCION)');
                }
            }
        }

        if(trackingId>0){
            const result4=await client.query('SELECT id FROM public.tracking_detalle where tracking_id='+parseInt(trackingId)+' and estado < 4 and estado >=0');
            if(result4 && result4.rows && result4.rows.length>0){
                //existen, por lo tanto no se cambia el estado de la cabecera
            }else{
                const query5= {
                    text: 'UPDATE public.tracking SET estado=4 WHERE id=$1 RETURNING *',
                    values: [parseInt(trackingId)],
                };
                const result5=await client.query(query5);
                if(result5 && result5.rows && result5.rows.length>0){
                    //actualizacion encabezado correcta
                }else{
                    console.log('ERROR AL ACTUALIZAR CABECERA TRACKING')
                }
            }
        }

        if(idsPl && idsPl.length>0){
            for(var x=0;x<idsPl.length;x++){
                const result6=await client.query('SELECT id FROM public.pl_desconsolidado_detalle WHERE fk_pl_desconsolidado='+parseInt(idsPl[x])+' AND estado=0');
                if(result6 && result6.rows && result6.rows.length>0){
                    //no se hace nada porque aun quedan registros pendientes
                }else{
                    const query7= {
                        text: 'UPDATE public.pl_desconsolidado SET estado=1 WHERE id=$1 RETURNING *',
                        values: [parseInt(idsPl[x])],
                    };
                    const result7=await client.query(query7);
                    if(result7 && result7.rows && result7.rows.length>0){
                        //actualizacion encabezado correcta
                    }else{

                        console.log('ERROR AL ACTUALIZAR CABECERA PL DESCONSOLIDADO')
                    }
                }
            }
        }
        res.status(200).send([]);
        res.end(); res.connection.destroy();
    } catch (error) {
        console.log('ERROR CREATE SIMPLE '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR CONFIRMAR LA RECEPCION",
        success:false,}); res.end(); res.connection.destroy();
    }
};
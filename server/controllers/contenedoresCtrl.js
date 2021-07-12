const client = require('../config/db.client');
const moment=require('moment');
const jwt=require('jsonwebtoken');

exports.list = async (req, res) => {
    try{
    let result=await client.query('SELECT c.*,(SELECT count(id) FROM public.contenedor_historial WHERE fk_contenedor=c.id)::integer AS historial,n.nave_nombre as fk_nave_nombre,ne.eta_fecha,ne.eta_hora,ne.etd_fecha,ne.etd_hora,ln.nombre as fk_linea_naviera_nombre,e.nombre as fk_embarcadora_nombre,(SELECT ne.etd_Fecha FROM naves_eta ne LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking WHERE ct.fk_contenedor=c.id and ct.estado=0 order by ne.id asc limit 1) as fecha_salida,(SELECT ne.eta_Fecha FROM naves_eta ne LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking WHERE ct.fk_contenedor=c.id and ct.estado=0 order by ne.id desc limit 1) as fecha_llegada,(SELECT n2.nave_nombre FROM naves2 n2 LEFT JOIN naves_eta ne on ne.fk_nave=n2.nave_id LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking  where ct.fk_contenedor=c.id and ne.estado<2 and ct.estado=0 order by ne.id asc limit 1) as nave_nombre,(SELECT pl.id FROM public.pl_desconsolidado pl where c.id=pl.fk_contenedor and pl.estado=0 order by pl.id limit 1) as fk_planificacion,(SELECT pl.estado FROM public.pl_desconsolidado pl where c.id=pl.fk_contenedor and pl.estado=0 order by pl.id limit 1) as fk_planificacion_estado,(SELECT pl.fecha_descarga FROM public.pl_desconsolidado pl where c.id=pl.fk_contenedor and pl.estado=0 order by pl.id limit 1) as fk_planificacion_fecha_descarga FROM public.contenedor c LEFT JOIN public.naves2 n on n.nave_id=c.fk_nave LEFT JOIN public.naves_eta ne on ne.id=c.fk_nave_eta LEFT JOIN public.lineas_navieras ln on ln.id=c.fk_linea_naviera LEFT JOIN public.embarcadoras e on e.id=c.fk_embarcadora ORDER BY id DESC');
    
    if(result && result.rows){
        res.status(200).send(result.rows);
        res.end(); res.connection.destroy();
    }else{
        res.status(400).send('PROBLEMAS AL OBTENER EL LISTADO DE CONTENEDORES'); 
        res.end(); res.connection.destroy();
    }

    /*client.query('SELECT c.*,(SELECT count(id) FROM public.contenedor_historial WHERE fk_contenedor=c.id)::integer AS historial,n.nave_nombre as fk_nave_nombre,ne.eta_fecha,ne.eta_hora,ne.etd_fecha,ne.etd_hora,ln.nombre as fk_linea_naviera_nombre,e.nombre as fk_embarcadora_nombre,(SELECT ne.etd_Fecha FROM naves_eta ne LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking WHERE ct.fk_contenedor=c.id and ct.estado=0 order by ne.id asc limit 1) as fecha_salida,(SELECT ne.eta_Fecha FROM naves_eta ne LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking WHERE ct.fk_contenedor=c.id and ct.estado=0 order by ne.id desc limit 1) as fecha_llegada,(SELECT n2.nave_nombre FROM naves2 n2 LEFT JOIN naves_eta ne on ne.fk_nave=n2.nave_id LEFT JOIN contenedor_viajes_detalle cvd on cvd.fk_nave_eta=ne.id LEFT JOIN contenedor_tracking ct on ct.id=cvd.fk_contenedor_tracking  where ct.fk_contenedor=c.id and ne.estado<2 and ct.estado=0 order by ne.id asc limit 1) as nave_nombre,(SELECT pl.id FROM public.pl_desconsolidado pl where c.id=pl.fk_contenedor) as fk_planificacion,(SELECT pl.estado FROM public.pl_desconsolidado pl where c.id=pl.fk_contenedor) as fk_planificacion_estado,(SELECT pl.fecha_descarga FROM public.pl_desconsolidado pl where c.id=pl.fk_contenedor) as fk_planificacion_fecha_descarga FROM public.contenedor c LEFT JOIN public.naves2 n on n.nave_id=c.fk_nave LEFT JOIN public.naves_eta ne on ne.id=c.fk_nave_eta LEFT JOIN public.lineas_navieras ln on ln.id=c.fk_linea_naviera LEFT JOIN public.embarcadoras e on e.id=c.fk_embarcadora ORDER BY id DESC', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   */
    } catch (error) {
        res.status(400).send({
            message: "ERROR GET LISTADO CONTENEDORES:"+error,
            success:false,
        });
        res.end(); res.connection.destroy();
    }
};

exports.create = (req, res) => {
    // Validate request
    if (!req.body.codigo) {
      res.status(400).send({
        message: "El codigo es obligatorio",
        success:false
      });
      return;
    }

    const query = {
        text: 'INSERT INTO public.contenedor(codigo, reserva,viaje,volumen,estado,fk_linea_naviera,fk_embarcadora,numero_sello) VALUES($1, $2, $3,$4,$5,$6,$7,$8) RETURNING *',
        values: [req.body.codigo, req.body.reserva,req.body.viaje,req.body.volumen,req.body.estado,req.body.fk_linea_naviera,req.body.fk_embarcadora,req.body.numero_sello]
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
};

exports.update = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }
    const query = {
        text: 'UPDATE public.contenedor SET codigo=$1,reserva=$2,viaje=$3,estado=$4,volumen=$5,fk_linea_naviera=$6,fk_embarcadora=$7,numero_sello=$8 WHERE id=$9 RETURNING *',
        values: [req.body.codigo, req.body.reserva,req.body.viaje,req.body.estado,req.body.volumen,req.body.fk_linea_naviera,req.body.fk_embarcadora,req.body.numero_sello,req.body.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
};

exports.updateShipEta = async(req,res)=>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }

    const query0={
        text: 'SELECT id,fk_nave,fk_nave_eta FROM public.contenedor WHERE id=$1',
        values: [req.params.id],
    };

    

    client.query(query0,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }

        if(result.rows.length>0 && result.rows[0].fk_nave!==null){
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
            const queryH={
                text: 'INSERT INTO public.contenedor_historial(fk_usuario,fk_contenedor,fk_nave_1,fk_nave_eta_1,fk_nave_2,fk_nave_eta_2,fecha) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                values: [req.usuario.id,req.params.id,result.rows[0].fk_nave, result.rows[0].fk_nave_eta,req.body.fk_nave, req.body.fk_nave_eta,moment().format('YYYYMMDD HHmmss')],
            };
            client.query(queryH,"",function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            //res.status(200).send(result.rows[0]);
            });
        }

        const query = {
        text: 'UPDATE public.contenedor SET fk_nave=$1,fk_nave_eta=$2 WHERE id=$3 RETURNING *',
        values: [req.body.fk_nave, req.body.fk_nave_eta,req.params.id],
        };

        client.query(query,"",function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
           // res.status(200).send(result.rows[0]);
        });

        const query00={
            text: 'SELECT *FROM public.contenedor_detalle WHERE fk_contenedor=$1',
            values: [req.params.id],
        };

        client.query(query00,"",function (err00, result00) {
            if (err00) {
                console.log(err00);
                res.status(400).send(err00);
            }

            if(result00 && result00.rows && result00.rows.length>0){
               const ids=[];
               for(var i=0;i<result00.rows.length;i++){
                 ids.push(result00.rows[i].fk_tracking_detalle);
               }
               let queryIn='';
               if(ids.length>0){
                    queryIn+='WHERE id IN (';
                    for(var x=0;x<ids.length;x++){
                        if(x!==ids.length-1){
                            queryIn+=ids[x]+','
                        }else{
                            queryIn+=ids[x]
                        }
                    }
                    queryIn+=')';
                }

                let queryFinal='UPDATE public.tracking_detalle SET fk_contenedor='+req.params.id+',fk_nave='+req.body.fk_nave+',fk_nave_eta='+req.body.fk_nave_eta+' '+queryIn;

                client.query(queryFinal,"",function (err001, result001) {
                    if (err001) {
                        console.log(err001);
                        res.status(400).send(err001);
                    }
                    //res.status(200).send(result.rows[0]);
                });

            }
            
        });

        
            res.status(200).send(result.rows[0]);
    });

    
}

exports.delete = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }
    client.query('DELETE FROM public.contenedor where id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send({
            message: "El contenedor ha sido eliminado correctamente",
            success:true
            });
    });
};
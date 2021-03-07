const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');
const moment=require('moment');
exports.create = (req, res) => {
    // Validate request
    if (!req.body.fk_cliente) {
      res.status(400).send({
        message: "El cliente es obligatorio",
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

    const query = {
        text: 'INSERT INTO public.consolidado(nombre, fk_cliente,estado,prioridad,fk_usuario,fecha,fk_contenedor) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        values: [req.body.nombre,req.body.fk_cliente,req.body.estado,req.body.prioridad,req.usuario.id,moment().format('YYYYMMDD HHmmss'),null],
    };

    client.query(query,"",function (err, result) {
        if (err) {

            console.log(err);
            res.status(400).send(err);
        }

        if(req.body.trackings && req.body.trackings.length >0){
          for(var i=0;i<req.body.trackings.length;i++){
            const query2={
              text: 'INSERT INTO public.consolidado_tracking(fk_consolidado,fk_tracking,estado) VALUES($1, $2,$3) RETURNING *',
              values: [result.rows[0].id,req.body.trackings[i],0],
            };
            const vls=[0,req.body.trackings[i]];
            client.query(query2,"",function (err2, result2) {
              if (err2) {
                      console.log(err2);
                      res.status(400).send(err2);
                    } 
                  vls[0]=result2.rows[0].id;
                 const query21={
                  text:'UPDATE public.tracking SET fk_consolidado_tracking=$1 where id=$2',
                  values: vls
                 };

                 client.query(query21,"",function (err21, result21) {
                  if (err21) {
                      console.log(err21);
                      res.status(400).send(err21);
                    } 
                  });
            });
          }
        }

        if(req.body.tracking_detalle && req.body.tracking_detalle.length >0){
          for(var i=0;i<req.body.tracking_detalle.length;i++){
            const query3={
              text: 'INSERT INTO public.consolidado_tracking_detalle(fk_consolidado,fk_tracking,fk_tracking_detalle,estado) VALUES($1, $2,$3,$4) RETURNING *',
              values: [result.rows[0].id,req.body.tracking_detalle[i].tracking_id,req.body.tracking_detalle[i].id,0],
            };
            const values=[0,req.body.tracking_detalle[i].id];
            client.query(query3,"",function (err3, result3) {
              if (err) {
                      console.log(err3);
                      res.status(400).send(err3);
                    } 
                    values[0]=result3.rows[0].id;
                const query31={
                  text:'UPDATE public.tracking_detalle SET fk_consolidado_tracking_detalle=$1 where id=$2',
                  values: values
                 };

                 client.query(query31,"",function (err31, result31) {
                  if (err31) {
                      console.log(err31);
                      res.status(400).send(err31);
                    } 
                  });
            });
          }
        }
        
        res.status(200).send(result.rows[0]);
    });
};

exports.listTrackingConsolidadoByClient = (req, res) => {
  const arrayFinal=[];
    client.query('SELECT T.*, c.codigo as fk_cliente_codigo,c.nombre as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor where t.fk_cliente=$1 AND t.estado<2 AND t.fk_consolidado_tracking is null AND t.estado>=0 AND t.fk_propuesta is null ORDER BY T.id DESC', [parseInt(req.params.id)], function (err, result) {
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

          let queryFinal="SELECT id,upload_id,fecha_recepcion,fecha_consolidado,codigo_interno,tipo_producto,producto,peso,volumen,observacion,tracking_id,estado,CASE WHEN foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,ancho,alto,altura FROM public.tracking_detalle "+queryIn+ " and fk_consolidado_tracking_detalle IS NULL";
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
  };

  exports.listByClient = (req, res) => {
    if (!req.params.id) {
      res.status(400).send({
        message: "El cliente es obligatorio",
        success:false
      });
      return;
    }

    client.query('SELECT c.*,u.nombre as fk_usuario_nombre, u.apellidos as fk_usuario_apellidos,cl.nombre as fk_cliente_nombre FROM public.consolidado c inner join usuario u on u.id=c.fk_usuario inner join public.clientes cl on cl.id=c.fk_cliente where c.fk_cliente=$1', [parseInt(req.params.id)], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
         res.status(200).send(result.rows);
    });

  }

  exports.listTrackingConsolidadoById = (req, res) => {
    if (!req.params.id) {
      res.status(400).send({
        message: "El id del consolidado es obligatorio",
        success:false
      });
      return;
    }
  const arrayFinal=[];
    client.query('SELECT ct.fk_tracking,t.id,t.fecha_creacion,t.cantidad_bultos,t.peso,t.volumen,t.tipo_carga,t.fk_proveedor,t.estado,t.prioridad,p.nombre as fk_proveedor_nombre,p.codigo as fk_proveedor_codigo FROM public.consolidado c inner join public.consolidado_tracking ct on ct.fk_consolidado=c.id inner join public.tracking t on t.id=ct.fk_tracking inner join public.proveedores p on p.id=t.fk_proveedor where c.id=$1', [parseInt(req.params.id)], function (err, result) {
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

          let queryFinal="SELECT td.fk_consolidado_tracking_detalle,td.id,td.fecha_recepcion,td.fecha_consolidado,td.codigo_interno,td.tipo_producto,td.producto,td.peso,td.volumen,td.observacion,td.tracking_id,td.estado,td.ancho,td.alto,td.altura FROM public.tracking_detalle td inner join public.consolidado_tracking_detalle ctd on ctd.id=td.fk_consolidado_tracking_detalle "+queryIn+ " and ctd.fk_consolidado=$1 and td.fk_consolidado_tracking_detalle IS NOT NULL";
          client.query(queryFinal, [parseInt(req.params.id)], function (err, result) {
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
  };

  exports.update = (req, res) => {
    // Validate request
    if (!req.params.id) {
      res.status(400).send({
        message: "El id del consolidado es obligatorio",
        success:false
      });
      return;
    }
    //BORRANDO REGISTROS DE TRACKING (CABECERA) DE LA TABLA CONSOLIDADO
    if(req.body.delete_tracking_ids && req.body.delete_tracking_ids.length>0){
        for(var i=0;i<req.body.delete_tracking_ids.length;i++){
          //QUERY DE ACTUALIZACIÓN DEL REGISTRO PARA DESLIGAR EL ID DE CONSOLIDADO
           const query = {
                text: 'UPDATE public.tracking SET fk_consolidado_tracking=null WHERE id=$1 RETURNING *',
                values: [req.body.delete_tracking_ids[i]],
            };

          client.query('DELETE FROM public.consolidado_tracking where fk_tracking = $1 and fk_consolidado=$2', [req.body.delete_tracking_ids[i],req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }

            client.query(query,"",function (err, result) {
              if (err) {
                  console.log(err);
                  res.status(400).send(err);
              }
            });
          });
        }
    }

    //BORRANDO REGISTROS DE TRACKING_DETALLE (LINEAS) DE LA TABLA CONSOLIDADO
    if(req.body.delete_tracking_detalle_ids && req.body.delete_tracking_detalle_ids.length>0){
      for(var i=0;i<req.body.delete_tracking_detalle_ids.length;i++){
          //QUERY DE ACTUALIZACIÓN DEL REGISTRO PARA DESLIGAR EL ID DE CONSOLIDADO
           const query1 = {
                text: 'UPDATE public.tracking_detalle SET fk_consolidado_tracking_detalle=null WHERE id=$1 RETURNING *',
                values: [req.body.delete_tracking_detalle_ids[i]],
            };

          client.query('DELETE FROM public.consolidado_tracking_detalle where fk_tracking_detalle = $1 and fk_consolidado=$2', [req.body.delete_tracking_detalle_ids[i],req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }

            client.query(query1,"",function (err, result) {
              if (err) {
                  console.log(err);
                  res.status(400).send(err);
              }
            });
          });
        }
    }

//INSERCIÓN DE NUEVOS DATOS TIPO TRACKING EN LA TABLA DE CONSOLIDADOS
    if(req.body.trackings && req.body.trackings.length>0){
      for(var i=0;i<req.body.trackings.length;i++){
          const query2 = {
                  text: 'SELECT *from public.consolidado_tracking where fk_tracking = $1 and fk_consolidado=$2',
                  values: [req.body.trackings[i],req.params.id],
          };

          const query3={
            text: 'INSERT INTO public.consolidado_tracking(fk_consolidado,fk_tracking,estado) VALUES($1, $2,$3) RETURNING *',
            values: [req.params.id,req.body.trackings[i],0]
          };

          let values4=[0,req.body.trackings[i]];

          client.query(query2,"",function (err2, result2) {//pregunto si existe el registro de tracking en el consolidado
                if (err2) {
                    console.log(err2);
                    res.status(400).send(err2);
                }

                if(result2.rows.length===0){// si el tracking no está en el consolidado, se inserta (query3)
                  client.query(query3,"",function (err3, result3) {
                    if (err3) {
                        console.log(err3);
                        res.status(400).send(err3);
                    }
                    if(result3.rows.length>0){//se actualiza el registro de tracking enlazandolo con el nuevo id de consolidado_tracking
                      values4[0]=result3.rows[0].id;
                      const query4 = {
                            text: 'UPDATE public.tracking SET fk_consolidado_tracking=$1 WHERE id=$2 RETURNING *',
                            values: values4,
                      };
                      client.query(query4,"",function (err4, result4) {
                        if (err4) {
                            console.log(err4);
                            res.status(400).send(err4);
                        }
                      });
                    }
                  });
                }
          });
      }
    }

    //INSERCIÓN DE NUEVOS DATOS TIPO TRACKING DETALLE EN LA TABLA DE CONSOLIDADOS
    if(req.body.tracking_detalle && req.body.tracking_detalle.length>0){console.log("TRACKING DETALLE");
      for(var i=0;i<req.body.tracking_detalle.length;i++){
          const query5 = {
                  text: 'SELECT *from public.consolidado_tracking_detalle where fk_tracking_detalle = $1 and fk_consolidado=$2',
                  values: [req.body.tracking_detalle[i].id,req.params.id],
          };

          const query6={
            text: 'INSERT INTO public.consolidado_tracking_detalle(fk_consolidado,fk_tracking,fk_tracking_detalle,estado) VALUES($1, $2,$3,$4) RETURNING *',
            values: [req.params.id,req.body.tracking_detalle[i].tracking_id,req.body.tracking_detalle[i].id,0]
          };

          let values7=[0,req.body.tracking_detalle[i].id];

          client.query(query5,"",function (err5, result5) {//pregunto si existe el registro de tracking detalle en el consolidado
                if (err5) {
                    console.log(err5);
                    res.status(400).send(err5);
                }

                if(result5.rows.length===0){// si el tracking detalle no está en el consolidado, se inserta (query6)
                  client.query(query6,"",function (err6, result6) {
                    if (err6) {
                        console.log(err6);
                        res.status(400).send(err6);
                    }
                    if(result6.rows.length>0){//se actualiza el registro de tracking enlazandolo con el nuevo id de consolidado_tracking
                      values7[0]=result6.rows[0].id;
                      const query7 = {
                            text: 'UPDATE public.tracking_detalle SET fk_consolidado_tracking_detalle=$1 WHERE id=$2 RETURNING *',
                            values: values7,
                      };
                      client.query(query7,"",function (err7, result7) {
                        if (err7) {
                            console.log(err7);
                            res.status(400).send(err7);
                        }
                      });
                    }
                  });
                }
          });
      }
    }

    if(req.body.delete_tracking_merge && req.body.delete_tracking_merge.length>0){
      for(let i=0;i<req.body.delete_tracking_merge.length;i++){
        const query8 = {
            text: 'UPDATE public.tracking SET estado=-1 WHERE id=$1 RETURNING *',
            values: [req.body.delete_tracking_merge[i]],
        };
        client.query(query8,"",function (err8, result8) {
          if (err8) {
              console.log(err8);
              res.status(400).send(err8);
          }
        });
      }
      
    }

    if(req.body.update_tracking_merge && req.body.update_tracking_merge.length>0){
      for(let i=0;i<req.body.update_tracking_merge.length;i++){
        if(req.body.update_tracking_merge[i].tracking_detalle && req.body.update_tracking_merge[i].tracking_detalle.length>0){

          for(let y=0;y<req.body.update_tracking_merge[i].tracking_detalle.length;y++){
            const query9 = {
              text: 'UPDATE public.tracking_detalle SET tracking_id=$1 WHERE id=$2 RETURNING *',
              values: [req.body.update_tracking_merge[i].tracking_detalle[y].tracking_id,req.body.update_tracking_merge[i].tracking_detalle[y].id],
            };
            client.query(query9,"",function (err9, result9) {
              if (err9) {
                  console.log(err8);
                  res.status(400).send(err8);
              }
            });
          }
        }
      }
    }

    res.status(200).send([]);
  };

  exports.listGcConsolidadoByClient = (req, res) => {
    if (!req.params.id) {
      res.status(400).send({
        message: "El id del cliente es obligatorio",
        success:false
      });
      return;
    }
     const arrayFinal=[];
     client.query('SELECT pc.* from public.gc_propuestas_cabeceras pc WHERE EXISTS (SELECT 1 FROM public.tracking where fk_propuesta=pc.id) and pc.fk_cliente=$1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }   
            const cloneResult=result.rows;
            let ids=[];
            if(cloneResult && cloneResult.length>0){
              for(var i=0;i<cloneResult.length;i++){
                ids.push(cloneResult[i].id);
              }

              let queryIn='';
              if(ids.length>0){
                queryIn+='WHERE t.fk_propuesta IN (';
                for(var x=0;x<ids.length;x++){
                  if(x!==ids.length-1){
                    queryIn+=ids[x]+','
                  }else{
                    queryIn+=ids[x]
                  }
                }
                queryIn+=')';
              }

              let queryFinal='SELECT T.*, c.codigo as fk_cliente_codigo,c.nombre as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor '+queryIn+' and t.fk_consolidado_tracking is null ORDER BY T.id DESC';
               client.query(queryFinal, "", function (err2, result2) {
                  if (err2) {
                      console.log(err2);
                      res.status(400).send(err2);
                  }  
                  

                  let queryIn2='';let ids2=[];
                  if(result2.rows && result2.rows.length>0){
                    for(var i=0;i<result2.rows.length;i++){
                      ids2.push(result2.rows[i].id);
                    }
                  }
                  if(ids2.length>0){
                    queryIn2+='WHERE tracking_id IN (';
                    for(var x=0;x<ids2.length;x++){
                      if(x!==ids2.length-1){
                        queryIn2+=ids2[x]+','
                      }else{
                        queryIn2+=ids2[x]
                      }
                    }
                    queryIn2+=')';
                  }

                  let queryFinal2="SELECT id,upload_id,fecha_recepcion,fecha_consolidado,codigo_interno,tipo_producto,producto,peso,volumen,observacion,tracking_id,estado,CASE WHEN foto1 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto1,CASE WHEN foto2 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto2,CASE WHEN foto3 IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS foto3,ancho,alto,altura FROM public.tracking_detalle "+queryIn2;

                  client.query(queryFinal2, "", function (err3, result3) {
                  if (err3) {
                      console.log(err3);
                      res.status(400).send(err3);
                  }  


                  for(var i=0;i<cloneResult.length;i++){
                    let obj=lodash.cloneDeep(cloneResult[i]);
                    const arrayFind=result2.rows.filter(y=>y.fk_propuesta===cloneResult[i].id);
                    if(arrayFind){
                      for(var x=0;x<arrayFind.length;x++){
                        const arrayFind2=result3.rows.filter(y=>y.tracking_id===arrayFind[x].id);
                        if(arrayFind2){
                          arrayFind[x].tracking_detalle=arrayFind2;
                        }else{
                          arrayFind[x].tracking_detalle=[];
                        }
                      }
                      obj.tracking=arrayFind;
                    }else{
                      obj.tracking=[];
                    }
                     arrayFinal.push(obj);
                  }
                  res.status(200).send(arrayFinal);

                  });
                });
            }else{
                 console.log('vacio');
                 res.status(200).send([]);
            }    
      });
  };
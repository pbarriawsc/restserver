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
                  values0[0]=result2.rows[0].id;
                  console.log(values0);
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

exports.listByClient = (req, res) => {
  const arrayFinal=[];
    client.query('SELECT T.*, c.codigo as fk_cliente_codigo,c.nombre as fk_cliente_nombre,p.codigo as fk_proveedor_codigo, p.nombre as fk_proveedor_nombre,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=0)::integer AS bultos_pendientes,(SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=T.id and estado=1)::integer AS bultos_completos FROM public.tracking t left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor where t.fk_cliente=$1 AND t.estado<2 ORDER BY T.id DESC', [parseInt(req.params.id)], function (err, result) {
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
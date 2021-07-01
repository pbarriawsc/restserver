const client = require('../config/db.client');

exports.listByContenedor = (req, res) => {
	if (!req.params.id) {
      res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }
    client.query('SELECT cd.id as contenedor_detalle_id,cd.fk_contenedor as fk_contenedor_cd,td.*,t.fk_cliente_direccion_despacho as fk_direccion,t.direccion_manual,t.tipo_despacho,t.observacion_despacho,t.fecha_despacho,t.fk_cliente,c."razonSocial" as fk_cliente_nombre,t.fk_proveedor, p.nombre as fk_proveedor_nombre FROM public.contenedor_detalle cd inner join public.tracking_detalle td on td.id=cd.fk_tracking_detalle inner join tracking t on t.id=td.tracking_id left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor where cd.fk_contenedor=$1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
};
exports.create = async (req, res) => {
    // Validate request
    if (!req.params.id) {
      res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }

    if(!req.body.detalle){
    	res.status(400).send({
        message: "El detalle es obligatorio",
        success:false
      });
      return;
    }

    let arrayTracking=[];
    for(var i=0;i<req.body.detalle.length;i++){
    	if(arrayTracking.length===0){
    		arrayTracking.push(req.body.detalle[i].tracking_id);
    	}else{
    		const find=arrayTracking.find(x=>x===req.body.detalle[i].tracking_id);
    		if(!find){
    			arrayTracking.push(req.body.detalle[i].tracking_id);
    		}
    	}

        const contenedor=await client.query(`SELECT * FROM public.contenedor where id=`+req.params.id);
    	const query = {
	        text: 'INSERT INTO public.contenedor_detalle(fk_contenedor, fk_tracking_detalle) VALUES($1, $2) RETURNING *',
	        values: [req.params.id,req.body.detalle[i].id],
	    };
        let query2 ={
                text: 'UPDATE public.tracking_detalle SET estado=$2 WHERE id=$1 RETURNING *',
                values: [req.body.detalle[i].id,2]
        };

        if(contenedor.rows && contenedor.rows.length>0){
            query2 ={
                text: 'UPDATE public.tracking_detalle SET estado=$2,fk_contenedor=$3,fk_nave=$4,fk_nave_eta=$5 WHERE id=$1 RETURNING *',
                values: [req.body.detalle[i].id,2,req.params.id,contenedor.rows[0].fk_nave,contenedor.rows[0].fk_nave_eta]
            };
        }

	    

	    client.query(query,"",function (err, result) {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	       // res.status(200).send(result.rows[0]);
	    });

        client.query(query2,"",function (err, result) {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	        //res.status(200).send(result.rows[0]);
	     });
    }

    /*
    if(arrayTracking.length>0){
    	for(var i=0;i<arrayTracking.length;i++){
    		const query3 = {
		        text: 'UPDATE public.tracking SET estado=$1 WHERE id=$2 RETURNING *',
				values: [2, arrayTracking[i]],
		    };
    		client.query('SELECT * FROM public.tracking_detalle where tracking_id=$1 and estado<2',[arrayTracking[i]], function (err, result) {
		        if (err) {
		            console.log(err);
		            //res.status(400).send(err);
		        }
		        
		        if(result.rows.length===0){//verifico que no existan detalles pendientes, si es asi, debo cambiar el estado del encabezado a completado
		        	client.query(query3,"",function (err, result) {
			        if (err) {
			            console.log(err);
			            res.status(400).send(err);
			        }
				 	});
		        }
	    	});  
    	}
    }

    if(req.body.estado){
        const query4 = {
                text: 'UPDATE public.contenedor SET estado=$1 WHERE id=$2 RETURNING *',
                values: [req.body.estado, req.params.id],
        };
        client.query(query4,"",function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
        });
    }*/
    res.status(200).send({});
};

exports.updateEstadoTracking = (req, res) => {
    if(!req.params.id){
        res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }
    if(!req.body.detalle){
        res.status(400).send({
        message: "El detalle es obligatorio",
        success:false
      });
      return;
    }

    if(!req.body.estado){
        res.status(400).send({
        message: "El estado es obligatorio",
        success:false
      });
      return;
    }

    if(req.body.detalle.length>0){
        for(var i=0;i<req.body.detalle.length;i++){
            const query3 = {
                text: 'UPDATE public.tracking SET estado=$1 WHERE id=$2 RETURNING *',
                values: [2, req.body.detalle[i]],
            };
            client.query('SELECT * FROM public.tracking_detalle where tracking_id=$1 and estado<2',[req.body.detalle[i]], function (err, result) {
                if (err) {
                    console.log(err);
                    //res.status(400).send(err);
                }
                
                if(result.rows.length===0){//verifico que no existan detalles pendientes, si es asi, debo cambiar el estado del encabezado a completado
                    client.query(query3,"",function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    });
                }
            });  
        }
    }

    if(req.body.estado){
        const query4 = {
                text: 'UPDATE public.contenedor SET estado=$1 WHERE id=$2 RETURNING *',
                values: [req.body.estado, req.params.id],
        };
        client.query(query4,"",function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
        });
    }
    res.status(200).send({});
};

exports.delete = (req, res) => {
    if(!req.params.id){
        res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }

    const query1={
        text: 'SELECT *FROM public.contenedor_detalle where id=$1',
        values: [req.params.id],
    };

    client.query(query1,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }

        if(result.rows.length>0){
            const query2={
                text: 'SELECT *FROM public.tracking_detalle where id=$1',
                values: [result.rows[0].fk_tracking_detalle],
            };

            client.query(query2,"",function (err2, result2) {
                    if (err2) {
                        console.log(err2);
                        res.status(400).send(err2);
                    }
                    if(result2.rows.length>0){
                        //borro y actualizo detalle
                        const query3={
                            text: 'DELETE FROM public.contenedor_detalle where id=$1',
                            values: [req.params.id],
                        };

                        const query4={
                            text: 'UPDATE public.tracking_detalle SET estado=$1,fk_contenedor=null,fk_nave=null,fk_nave_eta=null where id=$2',
                            values: [1,result2.rows[0].id],
                        };

                        const query5={
                            text:'SELECT * FROM public.tracking_detalle where tracking_id=$1 and estado<2',
                            values:[result2.rows[0].tracking_id]
                        };

                        const query6={
                            text: 'UPDATE public.tracking SET estado=$1 where id=$2',
                            values: [1,result2.rows[0].tracking_id],
                        };

                        client.query(query3,"",function (err3, result3) {
                                    if (err3) {
                                        console.log(err3);
                                        res.status(400).send(err3);
                                    }
                            client.query(query4,"",function (err4, result4) {
                                    if (err4) {
                                        console.log(err4);
                                        res.status(400).send(err4);
                                    }

                                    client.query(query5,"",function (err5, result5) {
                                        if (err5) {
                                            console.log(err5);
                                            res.status(400).send(err5);
                                        }
                                        if(result5.rows.length>0){
                                            client.query(query6,"",function (err6, result6) {
                                                        if (err6) {
                                                            console.log(err6);
                                                            res.status(400).send(err6);
                                                        }
                                            });
                                        }
                                    
                                    });
                                    
                            });
                        });

                    }
            });
        }
    });

    res.status(200).send({
            message: "El articulo ha sido eliminado correctamente del contenedor",
            success:true
            });
};

exports.listByContenedorNoPlanificado = (req, res) => {
	if (!req.params.id) {
      res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }
    client.query('SELECT cd.id as contenedor_detalle_id,cd.fk_contenedor as fk_contenedor_cd,td.*,t.fk_cliente,t.estado_pago,c."razonSocial" as fk_cliente_nombre,t.fk_proveedor, p.nombre as fk_proveedor_nombre FROM public.contenedor_detalle cd inner join public.tracking_detalle td on td.id=cd.fk_tracking_detalle inner join tracking t on t.id=td.tracking_id left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor where cd.fk_contenedor=$1 and NOT EXISTS (SELECT *FROM public.pl_desconsolidado_detalle dcd WHERE dcd.fk_tracking_detalle = td.id)', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
};

exports.getByClientAndContainer = async (req, res) => {
    try {
        if (!req.params.fk_cliente) {
            res.status(400).send({
              message: "El cliente es obligatorio",
              success:false
            });
            return;
        }

        if (!req.params.fk_contenedor) {
            res.status(400).send({
              message: "El contenedor es obligatorio",
              success:false
            });
            return;
        }

        const query={
            text:'SELECT cd.id as contenedor_detalle_id,cd.fk_contenedor as fk_contenedor_cd,td.*,t.fk_cliente,c."razonSocial" as fk_cliente_nombre,t.fk_proveedor, p.nombre as fk_proveedor_nombre,pldd.opcion,pldd.fk_camion,eq.patente,pldd.id as fk_pl_desconsolidado_detalle,pld.id as fk_pl_desconsolidado FROM public.contenedor_detalle cd inner join public.tracking_detalle td on td.id=cd.fk_tracking_detalle inner join tracking t on t.id=td.tracking_id left join public.clientes c on c.id=t.fk_cliente left join public.proveedores p on p.id=t.fk_proveedor left join public.pl_desconsolidado_detalle pldd on pldd.fk_tracking_detalle=td.id left join public.pl_desconsolidado pld on pld.id=pldd.fk_pl_desconsolidado left join public.equipos eq on eq.id=pldd.fk_camion where cd.fk_contenedor=$1 AND t.fk_cliente=$2 AND td.estado<4',
            values:[req.params.fk_contenedor,req.params.fk_cliente]
        };
        
        let result=await client.query(query);

        if(result && result.rows && result.rows.length>0){
            res.status(200).send(result.rows);
            res.end(); res.connection.destroy();
        }else{
            res.status(400).send({
            message: "NO EXISTEN BULTOS ASOCIADOS AL CLIENTE EN ESTE CONTENEDOR",
            success:false,}); res.end(); res.connection.destroy();
        }

    } catch (error) {
        console.log('ERROR GET BY CLIENT AND CONTAINER DETAIL '+error); console.log(' '); console.log(' ');
        res.status(400).send({
        message: "ERROR AL OBTENER EL DETALLE DEL CONTENEDOR POR CLIENTE",
        success:false,}); res.end(); res.connection.destroy();
    }
};
const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const moment=require('moment');
const lodash=require('lodash');
exports.list = async (req, res) => {
    try{
        let result=await client.query('SELECT v.*,n.nave_nombre as fk_nave_nombre,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos FROM public.viajes v inner join public.usuario u on u.id=v.fk_usuario inner join public.naves2 n on n.nave_id=v.fk_nave');   
        let arrayFinal=[];
        if(result && result.rows){
            let ids=[];
            for(var i=0;i<result.rows.length;i++){
        		ids.push(result.rows[i].id);
        	}
            
            let queryIn='';
            if(ids.length>0){
                queryIn+='WHERE viaje_id IN (';
                for(var x=0;x<ids.length;x++){
                    if(x!==ids.length-1){
                        queryIn+=ids[x]+','
                    }else{
                        queryIn+=ids[x]
                    }
                }
                queryIn+=')';
            }

            let queryDetalle='SELECT *FROM public.naves_eta '+queryIn;
            let resultDetalle=await client.query(queryDetalle);
            if(result.rows.length>0){
                result.rows.map(function(item){
                    let obj=lodash.cloneDeep(item);
                    const arrayFind=resultDetalle.rows.filter(y=>y.viaje_id===item.id);
                    if(arrayFind){
                        obj.viaje_detalle=arrayFind;
                    }else{
                        obj.viaje_detalle=[];
                    }
                    arrayFinal.push(obj);
                })
            }

            res.status(200).send(arrayFinal); 
        }else{
            console.log("ERROR AL OBTENER LISTADO DE VIAJES");
            res.status(400).send({ message: "ERROR AL OBTENER LISTADO DE VIAJES ", success:false});
            res.end(); res.connection.destroy();
        }
    }catch (error) {
        console.log("ERROR "+error);
        res.status(400).send({ message: "ERROR AL OBTENER LISTADO DE VIAJES ", success:false, });
        res.end(); res.connection.destroy();
    }
    
};

exports.create = async (req, res) => {
    try{
    // Validate request
    if (!req.body.codigo) {
      res.status(400).send({
        message: "El codigo es obligatorio",
        success:false
      });
      return;
    }else if(!req.body.keyaux){
    	 res.status(400).send({
        message: "El key es obligatorio",
        success:false
      });
      return;
    }else if(!req.body.fk_nave){
        res.status(400).send({
       message: "La nave es obligatoria",
       success:false
     });
     return;
    }

    const exist= await client.query("SELECT * FROM public.viajes where keyaux='"+req.body.key+"' and codigo='"+req.body.codigo+"'");

    if(exist.rows && exist.rows.length==0){
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

		const fecha=moment().format('YYYYMMDD HHmmss');

    	const query = {
	        text: 'INSERT INTO public.viajes(codigo,keyaux,estado,fk_usuario,fecha_creacion,fecha_modificacion,fk_nave) VALUES($1, $2, $3, $4, $5, $6,$7) RETURNING *',
	        values: [req.body.codigo,req.body.keyaux,req.body.estado,req.usuario.id,fecha,fecha,req.body.fk_nave],
	    };

        const result=await client.query(query);

        if(result && result.rows){
            if(req.body.viaje_detalle && req.body.viaje_detalle.length>0){
                for(var i=0;i<req.body.viaje_detalle.length;i++){
                    const query2 = {
                        text: 'INSERT INTO public.naves_eta(fk_nave,viaje_id,fk_puerto,eta_fecha,eta_hora,etd_fecha,etd_hora,estado,tipo) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
                        values: [req.body.fk_nave, result.rows[0].id,req.body.viaje_detalle[i].fk_puerto,req.body.viaje_detalle[i].eta_fecha,req.body.viaje_detalle[i].eta_hora,req.body.viaje_detalle[i].etd_fecha,req.body.viaje_detalle[i].etd_hora,req.body.viaje_detalle[i].estado,req.body.viaje_detalle[i].tipo],
                    };
                    client.query(query2,"",function (err2, result2) {
                        if (err2) {
                          console.log(err2);
                          res.status(400).send(err2);
                        }	
                    });
                }
            }

            res.status(200).send(result.rows[0]);
            res.end(); res.connection.destroy();
        }else{
            console.log('ERROR');
	        res.status(400).send('ERROR INGRESANDO VIAJE');
        }    
    }else if(exist.rows.length>0){
    	res.status(200).send('Intento duplicado');
        res.end(); res.connection.destroy();
    }
    }catch (error) {
        console.log("ERROR "+error);
        res.status(400).send({ message: "ERROR AL CREAR VIAJE ", success:false, });
        res.end(); res.connection.destroy();
    }
};

exports.delete = async (req, res) => {
    try{
        if (!req.params.id) {
            res.status(400).send({
              message: "El id es obligatorio",
              success:false
            });
            return;
          }
        await client.query(`DELETE FROM public.viajes where id=`+parseInt(req.params.id));
        await client.query(`DELETE FROM public.naves_eta where viaje_id=`+parseInt(req.params.id));
        res.status(200).send([]);
        res.end(); res.connection.destroy();
    }catch (error) {
        console.log("ERROR "+error);
        res.status(400).send({ message: "ERROR AL ELIMINAR VIAJE ", success:false, });
        res.end(); res.connection.destroy();
    }
};
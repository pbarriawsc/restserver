const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const moment=require('moment');
exports.list = (req, res) => {
    client.query('SELECT v.*,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos FROM public.viajes v inner join public.usuario u on u.id=v.fk_usuario', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
};

exports.create = async (req, res) => {
    // Validate request
    if (!req.body.codigo) {
      res.status(400).send({
        message: "El codigo es obligatorio",
        success:false
      });
      return;
    }else if(!req.body.key){
    	 res.status(400).send({
        message: "El key es obligatorio",
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
	        text: 'INSERT INTO public.viajes(codigo,keyaux,estado,fk_usuario,fecha_creacion,fecha_modificacion) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
	        values: [req.body.codigo,req.body.key,req.body.estado,req.usuario.id,fecha,fecha],
	    };

	    client.query(query,"",function (err, result) {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	        res.status(200).send(result.rows[0]);
	    });
    }else if(exist.rows.length>0){
    	res.status(200).send('Intento duplicado');
    }
};
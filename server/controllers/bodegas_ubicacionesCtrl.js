const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
const lodash= require('lodash');

exports.list = (req, res) => {
    // Validate request
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

    let bodega=req.usuario.fk_bodega;
    
    let query='SELECT *FROM public.bodegas_ubicaciones';

    if(bodega!==null){
    	query='SELECT *FROM public.bodegas_ubicaciones where fk_bodega='+bodega;
    }

    client.query(query,"",function (err, result)
    {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
        res.end();
        res.connection.destroy();
    });
}
const client = require('../config/db.client');
exports.list = (req, res) => {
	try {
    client.query('SELECT * FROM public.lineas_navieras order by id desc', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
    } catch (error) {
        console.log('ERROR GetLineasNavieras'+error);
        res.status(400).send({
        message: "Problemas al obtener el listado de lineas navieras",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.listByEstado = (req, res) => {
	try {
		if (!req.params.estado) {
	      res.status(400).send({
	        message: "El estado es obligatorio",
	        success:false
	      });
	      return;
	    }
    client.query('SELECT * FROM public.lineas_navieras where estado=$1 order by id desc', [req.params.estado], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
    } catch (error) {
        console.log('ERROR GetLineasNavierasByEstado'+error);
        res.status(400).send({
        message: "Problemas al obtener el listado de lineas navieras por estado",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.create = (req, res) => {
	try {
	    if (!req.body.nombre) {
	      res.status(400).send({
	        message: "El nombre es obligatorio",
	        success:false
	      });
	      return;
	    }else if(!req.body.nombre.length===0){
	    	res.status(400).send({
	        message: "El nombre debe tener a lo menos un carácter",
	        success:false
	      });
	    }

	    const query = {
	        text: 'INSERT INTO public.lineas_navieras(nombre, estado) VALUES($1, $2) RETURNING *',
	        values: [req.body.nombre,req.body.estado]
	    };

	    client.query(query,"",function (err, result) {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	        res.status(200).send(result.rows[0]);
	        res.end(); res.connection.destroy();
	    });
    } catch (error) {
        console.log('ERROR PostLineasNavieras'+error);
        res.status(400).send({
        message: "Problemas al guardar lineas navieras",
        success:false,}); res.end(); res.connection.destroy();
    }
};

exports.update = async(req, res) => {
	try {
		 if (!req.params.id) {
        	res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    	}
	    const query = {
	        text: 'UPDATE public.lineas_navieras SET nombre=$1,estado=$2 WHERE id=$3 RETURNING *',
	        values: [req.body.nombre,req.body.estado,req.params.id],
	    };

	    client.query(query,"",function (err, result) {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	        res.status(200).send(result.rows[0]);
	    });
	} catch (error) {
        console.log('ERROR UpdateLineasNavieras'+error);
        res.status(400).send({
        message: "Problemas al actualizar linea naviera",
        success:false,}); res.end(); res.connection.destroy();
    }
};
exports.delete = async(req, res) => {
	try {
	    if (!req.params.id) {
	      res.status(400).send({
	        message: "El id es obligatorio",
	        success:false
	      });
	      return;
	    }

	    let exists=await client.query("SELECT *FROM public.contenedor where fk_linea_naviera="+req.params.id);
	    if(exists.rows && exists.rows.length>0){
	        res.status(400).send({
	        message: "NO SE PUEDE ELIMINAR LA LINEA NAVIERA, YA QUE SE ENCUENTRA ASOCIADA A UN CONTENEDOR",
	        success:false,}); res.end(); res.connection.destroy();
	    }else{
	    	client.query("DELETE FROM public.lineas_navieras where id=$1",[req.params.id],function (err, result) {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	        res.status(200).send(result.rows[0]);
	        res.end(); res.connection.destroy();
	    	});
	    }
	    
    } catch (error) {
        console.log('ERROR DeleteLineasNavieras'+error);
        res.status(400).send({
        message: "Problemas al eliminar linea naviera",
        success:false,}); res.end(); res.connection.destroy();
    }
};
const client = require('../config/db.client');
const bcrypt= require('bcrypt');
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nombre) {
      res.status(400).send({
        message: "El nombre es obligatorio",
        success:false
      });
      return;
    }else if (!req.body.password){
        res.status(400).send({
            message: "El password es obligatorio",
            success:false
          });
          return;
    }else if (!req.body.fk_rol){
        res.status(400).send({
            message: "El rol es obligatorio",
            success:false
          });
          return;
    }
    const query = {
        text: 'INSERT INTO public.usuario(nombre, password,usuario,apellidos,email,telefono,rut,fk_rol,estado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        values: [req.body.nombre, bcrypt.hashSync(req.body.password,10),req.body.usuario,req.body.apellidos,req.body.email,req.body.telefono,req.body.rut,req.body.fk_rol,req.body.estado],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
};

exports.list = (req, res) => {
    client.query('SELECT u.*,r.nombre as fk_rol_nombre FROM public.usuario u inner join public.roles r on r.id = u.fk_rol ORDER BY id DESC', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
};

exports.findOneBy = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }
    client.query('SELECT * FROM public.usuario where id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
};

exports.delete = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id es obligatorio",
            success:false
            });
            return;
    }
    client.query('DELETE FROM public.usuario where id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send({
            message: "El usuario ha sido eliminado correctamente",
            success:true
            });
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
        text: 'UPDATE public.usuario SET usuario=$1,nombre=$2,apellidos=$3,email=$4,telefono=$5,rut=$6,fk_rol=$7,estado=$8 WHERE id=$9 RETURNING *',
        values: [req.body.usuario, req.body.nombre, req.body.apellido, req.body.email, req.body.telefono,req.body.rut,req.body.fk_rol,req.body.estado,req.body.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
};
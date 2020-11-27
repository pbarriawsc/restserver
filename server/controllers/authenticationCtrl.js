const client = require('../config/db.client');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
exports.postToken = (req, res) => {
    if (!req.body.usuario) {
        res.status(400).send({
          message: "El usuario es obligatorio",
          success:false
        });
        return;
    }else if (!req.body.password){
          res.status(400).send({
              message: "El password es obligatorio",
              success:false
            });
            return;
    }
    client.query('SELECT * FROM public.usuario where usuario = $1', [req.body.usuario], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        if(result.rows && result.rows.length>0){
            if(bcrypt.compareSync(req.body.password,result.rows[0].password)){//generando token y resguardando los campos que se envian para el encriptado
               const usuario={id:result.rows[0].id,
                usuario:result.rows[0].usuario,
                nombre:result.rows[0].nombre,
                apellidos:result.rows[0].apellidos,
                email:result.rows[0].email,
                telefono:result.rows[0].telefono};
                let token=jwt.sign({
                    usuario
                },process.env.SECRET,{expiresIn:process.env.EXPIRATION_TOKEN})
                //res.status(200).send(result.rows);
                res.json({success:true,token,usuario});
            }else{
                res.status(400).send({
                    message: "Credenciales incorrectas",
                    success:false});
            }
        }else if(result.rows && result.rows.length==0){
            res.status(400).send({
            message: "No se ha encontrado un usuario válido con las credenciales ingresadas",
            success:false});
        }
        
    });
}
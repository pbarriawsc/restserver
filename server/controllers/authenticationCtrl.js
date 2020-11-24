const client = require('../config/db.client');
const bcrypt= require('bcrypt');
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
    client.query('SELECT * FROM public.usuario where nombre = $1', [req.body.usuario], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        if(result.rows && result.rows.length>0){
            if(bcrypt.compareSync(req.body.password,result.rows[0].password)){
                res.status(200).send(result.rows);
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
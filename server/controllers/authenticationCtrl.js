const client = require('../config/db.client');
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
    client.query('SELECT * FROM public.usuario where nombre = $1 and password=$2', [req.body.usuario,req.body.password], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        console.log(result);
        res.status(200).send(result.rows);
    });
}
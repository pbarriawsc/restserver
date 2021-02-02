const client = require('../config/db.client');

exports.findOneBy = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "El id de la nave es obligatorio",
            success:false
            });
            return;
    }
    client.query('SELECT * FROM public.naves_eta where id = $1 and estado=0 LIMIT 1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
};

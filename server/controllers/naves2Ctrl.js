const client = require('../config/db.client');
exports.list = (req, res) => {
    client.query('SELECT n2.*,(SELECT count(id) FROM public.naves_eta WHERE fk_nave=n2.nave_id and estado=0)::integer AS count_eta FROM public.naves2 n2', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
        res.end();
        res.connection.destroy();
    });   
};
const client = require('../config/db.client');
exports.list = (req, res) => {
    client.query('SELECT * FROM public.banco', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });   
};
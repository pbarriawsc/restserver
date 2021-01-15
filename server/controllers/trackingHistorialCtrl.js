const client = require('../config/db.client');
exports.list = (req, res) => {
	if (!req.params.id) {
      res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }
    client.query('SELECT h.*,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos FROM public.tracking_historial h inner join public.usuario u ON u.id = h.fk_usuario where h.fk_tracking=$1 ORDER BY h.id DESC', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
        res.end();
        res.connection.destroy();
    });   
};
const client = require('../config/db.client');

exports.list = (req, res) => {
	if (!req.params.id) {
      res.status(400).send({
        message: "El id es obligatorio",
        success:false
      });
      return;
    }
    client.query('SELECT ch.*,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos,n1.nave_nombre as fk_nave_1_nombre,n2.nave_nombre as fk_nave_2_nombre FROM public.contenedor_historial ch INNER JOIN public.usuario u ON U.id=ch.fk_usuario INNER JOIN public.naves2 n1 on n1.nave_id=ch.fk_nave_1 INNER JOIN public.naves2 n2 on n2.nave_id=ch.fk_nave_2  where ch.fk_contenedor=$1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
        res.end();
        res.connection.destroy();
    });   
};
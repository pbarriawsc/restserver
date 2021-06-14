const client = require('../config/db.client');
exports.list = (req, res) => {
	try {
        let query='SELECT k.*,u.nombre as fk_usuario_nombre,u.apellidos as fk_usuario_apellidos,c.codigo as fk_contenedor_codigo,bu.nombre as fk_bodega_ubicacion_nombre,';
        query+='cl.id as fk_cliente,cl.codigo as fk_cliente_codigo,cl."razonSocial" as fk_cliente_razon_social,p.id as fk_proveedor,p.codigo as fk_proveedor_codigo,p.nombre as fk_proveedor_nombre,p."nombreChi" as fk_proveedor_nombre_chino' 
        query+=' FROM public.kardex k'; 
        query+=' INNER JOIN public.usuario u on u.id=k.fk_usuario ';
        query+=' INNER JOIN public.contenedor c on c.id=k.fk_contenedor ';
        query+=' INNER JOIN public.bodegas_ubicaciones bu on bu.id=k.fk_bodega_ubicacion ';
        query+=' INNER JOIN public.tracking t on t.id=k.fk_tracking ';
        query+=' INNER JOIN public.clientes cl on cl.id=t.fk_cliente ';
        query+=' INNER JOIN public.proveedores p on p.id=t.fk_proveedor ';
        query+=' order by k.id desc limit 100';

        client.query(query, "", function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });   
    } catch (error) {
        console.log('ERROR GetKardex'+error);
        res.status(400).send({
        message: "Problemas al obtener el listado kardex",
        success:false,}); res.end(); res.connection.destroy();
    }
};
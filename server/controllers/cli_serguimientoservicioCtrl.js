const client = require('../config/db.client');
const jwt=require('jsonwebtoken');

/************************************************************/
/************************************************************/
exports.SLISEGSER_GetTodosList = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    let Lista = await client.query(`
    SELECT 
    cli.rut as cli_rut
    ,cli.codigo as cli_nombrecorto
    ,cli."razonSocial" as cli_razon
    ,cons.id
    ,const.fk_tracking
    , TO_CHAR(coalesce((
        SELECT MIN(temp1.fecha_recepcion) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),null),'DD-MM-YYYY') as recepcion_1
    , TO_CHAR(coalesce((
        SELECT MAX(temp1.fecha_recepcion) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),null),'DD-MM-YYYY') as recepcion_2
    , track.cantidad_bultos as bultos_pro
    ,( SELECT COUNT(temp1.id) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id ) as bultos_rep 
    ,track.cantidad_bultos - ( SELECT COUNT(temp1.id) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id ) as bultos_dif 
    ,coalesce((
        SELECT SUM(temp1.volumen) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),0) as volumen
    ,coalesce((
        SELECT SUM(temp1.peso) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),0) as peso
    ,coalesce((
        SELECT 
        temp4.codigo
        FROM public.tracking_detalle as temp1
        inner join public.tracking as temp2 on temp1.tracking_id=temp2.id
        inner join public.contenedor_detalle as temp3 on temp1.id=temp3.fk_tracking_detalle
        inner join public.contenedor as temp4 on temp3.fk_contenedor=temp4.id
        where temp2.id=track.id
        limit 1
    ),'') as contenedor
    , (
    SELECT 
    temp3.codigo
    FROM public.contenedor_tracking as temp1
    inner join public.contenedor_viajes as temp2 on temp1.id=temp2.fk_contenedor_tracking
    inner join public.viajes as temp3 on temp2.fk_viaje=temp3.id
    where
    temp1.fk_contenedor=coalesce((
        SELECT 
        temp4.id
        FROM public.tracking_detalle as temp1
        inner join public.tracking as temp2 on temp1.tracking_id=temp2.id
        inner join public.contenedor_detalle as temp3 on temp1.id=temp3.fk_tracking_detalle
        inner join public.contenedor as temp4 on temp3.fk_contenedor=temp4.id
        where temp2.id=track.id
        limit 1
    ),0)
    limit 1
    ) as viaje
    FROM public.usuario as usu
    inner join public.clientes_usuarios as cliusu on usu.id=cliusu.fk_usuario
    inner join public.clientes as cli on cliusu.fk_cliente=cli.id
    inner join public.consolidado as cons on cli.id=cons.fk_cliente
    inner join public.consolidado_tracking as const on cons.id=const.fk_consolidado
    inner join public.tracking as track on const.fk_tracking=track.id

    where usu.id=`+req.usuario.id+`
    `);

    res.status(200).send(Lista.rows); res.end(); res.connection.destroy();

} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "ERROR AL CARGAR INFORMACION DEL CLIENTE ",
success:false,
}); res.end(); res.connection.destroy();
} };

/************************************************************/
/************************************************************/
exports.SLISEGSER_GetPorDespacharList = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    let Lista = await client.query(`
    SELECT 
    cli.rut as cli_rut
    ,cli.codigo as cli_nombrecorto
    ,cli."razonSocial" as cli_razon
    ,cons.id
    ,const.fk_tracking
    , TO_CHAR(coalesce((
        SELECT MIN(temp1.fecha_recepcion) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),null),'DD-MM-YYYY') as recepcion_1
    , TO_CHAR(coalesce((
        SELECT MAX(temp1.fecha_recepcion) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),null),'DD-MM-YYYY') as recepcion_2
    , track.cantidad_bultos as bultos_pro
    ,( SELECT COUNT(temp1.id) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id ) as bultos_rep 
    ,track.cantidad_bultos - ( SELECT COUNT(temp1.id) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id ) as bultos_dif 
    ,coalesce((
        SELECT SUM(temp1.volumen) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),0) as volumen
    ,coalesce((
        SELECT SUM(temp1.peso) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),0) as peso
    ,coalesce((
        SELECT 
        temp4.codigo
        FROM public.tracking_detalle as temp1
        inner join public.tracking as temp2 on temp1.tracking_id=temp2.id
        inner join public.contenedor_detalle as temp3 on temp1.id=temp3.fk_tracking_detalle
        inner join public.contenedor as temp4 on temp3.fk_contenedor=temp4.id
        where temp2.id=track.id
        limit 1
    ),'') as contenedor
    , (
    SELECT 
    temp3.codigo
    FROM public.contenedor_tracking as temp1
    inner join public.contenedor_viajes as temp2 on temp1.id=temp2.fk_contenedor_tracking
    inner join public.viajes as temp3 on temp2.fk_viaje=temp3.id
    where
    temp1.fk_contenedor=coalesce((
        SELECT 
        temp4.id
        FROM public.tracking_detalle as temp1
        inner join public.tracking as temp2 on temp1.tracking_id=temp2.id
        inner join public.contenedor_detalle as temp3 on temp1.id=temp3.fk_tracking_detalle
        inner join public.contenedor as temp4 on temp3.fk_contenedor=temp4.id
        where temp2.id=track.id
        limit 1
    ),0)
    limit 1
    ) as viaje


    FROM public.usuario as usu
    inner join public.clientes_usuarios as cliusu on usu.id=cliusu.fk_usuario
    inner join public.clientes as cli on cliusu.fk_cliente=cli.id
    inner join public.consolidado as cons on cli.id=cons.fk_cliente
    inner join public.consolidado_tracking as const on cons.id=const.fk_consolidado
    inner join public.tracking as track on const.fk_tracking=track.id

    where usu.id=`+req.usuario.id+`
    and (
        SELECT 
        temp3.codigo
        FROM public.contenedor_tracking as temp1
        inner join public.contenedor_viajes as temp2 on temp1.id=temp2.fk_contenedor_tracking
        inner join public.viajes as temp3 on temp2.fk_viaje=temp3.id
        where
        temp1.fk_contenedor=coalesce((
            SELECT 
            temp4.id
            FROM public.tracking_detalle as temp1
            inner join public.tracking as temp2 on temp1.tracking_id=temp2.id
            inner join public.contenedor_detalle as temp3 on temp1.id=temp3.fk_tracking_detalle
            inner join public.contenedor as temp4 on temp3.fk_contenedor=temp4.id
            where temp2.id=track.id
            limit 1
        ),0)
        limit 1
        ) is null
    `);

    res.status(200).send(Lista.rows); res.end(); res.connection.destroy();

} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "ERROR AL CARGAR INFORMACION DEL CLIENTE ",
success:false,
}); res.end(); res.connection.destroy();
}};

/************************************************************/
/************************************************************/
exports.SLISEGSER_GetEnTransitoList = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    let Lista = await client.query(`
    SELECT 
    cli.rut as cli_rut
    ,cli.codigo as cli_nombrecorto
    ,cli."razonSocial" as cli_razon
    ,cons.id
    ,const.fk_tracking
    , TO_CHAR(coalesce((
        SELECT MIN(temp1.fecha_recepcion) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),null),'DD-MM-YYYY') as recepcion_1
    , TO_CHAR(coalesce((
        SELECT MAX(temp1.fecha_recepcion) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),null),'DD-MM-YYYY') as recepcion_2
    , track.cantidad_bultos as bultos_pro
    ,( SELECT COUNT(temp1.id) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id ) as bultos_rep 
    ,track.cantidad_bultos - ( SELECT COUNT(temp1.id) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id ) as bultos_dif 
    ,coalesce((
        SELECT SUM(temp1.volumen) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),0) as volumen
    ,coalesce((
        SELECT SUM(temp1.peso) FROM public.tracking_detalle as temp1 WHERE const.fk_tracking=temp1.tracking_id
    ),0) as peso
    ,coalesce((
        SELECT 
        temp4.codigo
        FROM public.tracking_detalle as temp1
        inner join public.tracking as temp2 on temp1.tracking_id=temp2.id
        inner join public.contenedor_detalle as temp3 on temp1.id=temp3.fk_tracking_detalle
        inner join public.contenedor as temp4 on temp3.fk_contenedor=temp4.id
        where temp2.id=track.id
        limit 1
    ),'') as contenedor
    ,coalesce((
        SELECT 
        temp4.codigo
        FROM public.tracking_detalle as temp1
        inner join public.tracking as temp2 on temp1.tracking_id=temp2.id
        inner join public.contenedor_detalle as temp3 on temp1.id=temp3.fk_tracking_detalle
        inner join public.contenedor as temp4 on temp3.fk_contenedor=temp4.id
        where temp2.id=track.id
        limit 1
    ),'') as contenedor
    , (
    SELECT 
    temp3.codigo
    FROM public.contenedor_tracking as temp1
    inner join public.contenedor_viajes as temp2 on temp1.id=temp2.fk_contenedor_tracking
    inner join public.viajes as temp3 on temp2.fk_viaje=temp3.id
    where
    temp1.fk_contenedor=coalesce((
        SELECT 
        temp4.id
        FROM public.tracking_detalle as temp1
        inner join public.tracking as temp2 on temp1.tracking_id=temp2.id
        inner join public.contenedor_detalle as temp3 on temp1.id=temp3.fk_tracking_detalle
        inner join public.contenedor as temp4 on temp3.fk_contenedor=temp4.id
        where temp2.id=track.id
        limit 1
    ),0)
    limit 1
    ) as viaje


    FROM public.usuario as usu
    inner join public.clientes_usuarios as cliusu on usu.id=cliusu.fk_usuario
    inner join public.clientes as cli on cliusu.fk_cliente=cli.id
    inner join public.consolidado as cons on cli.id=cons.fk_cliente
    inner join public.consolidado_tracking as const on cons.id=const.fk_consolidado
    inner join public.tracking as track on const.fk_tracking=track.id

    where usu.id=`+req.usuario.id+`
    and (
        SELECT 
        temp3.codigo
        FROM public.contenedor_tracking as temp1
        inner join public.contenedor_viajes as temp2 on temp1.id=temp2.fk_contenedor_tracking
        inner join public.viajes as temp3 on temp2.fk_viaje=temp3.id
        where
        temp1.fk_contenedor=coalesce((
            SELECT 
            temp4.id
            FROM public.tracking_detalle as temp1
            inner join public.tracking as temp2 on temp1.tracking_id=temp2.id
            inner join public.contenedor_detalle as temp3 on temp1.id=temp3.fk_tracking_detalle
            inner join public.contenedor as temp4 on temp3.fk_contenedor=temp4.id
            where temp2.id=track.id
            limit 1
        ),0)
        limit 1
        ) is not null
    `);

    res.status(200).send(Lista.rows); res.end(); res.connection.destroy();

} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "ERROR AL CARGAR INFORMACION DEL CLIENTE ",
success:false,
}); res.end(); res.connection.destroy();
} };
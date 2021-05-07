const client = require('../config/db.client');
const jwt=require('jsonwebtoken');

/************************************************************/
/************************************************************/
exports.PERCLI_GetList = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    let Lista = await client.query(`
    SELECT 
    cli.id
    , cli.codigo
    , cli."razonSocial" as razonSocial
    FROM public.clientes_usuarios as cliusu
    inner join public.clientes as cli on cliusu.fk_cliente=cli.id
    where
    cliusu.estado is true
    and cliusu.fk_usuario=`+req.usuario.id+`
    group by 
    cli.id
    , cli.codigo
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
exports.PERCLI_GetInfo = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    let Lista = await client.query(`
    SELECT
    id
    , estado
    , rut
    , codigo
    , "razonSocial"
    , web
    , telefono1
    , telefono2
    , "dteEmail"
    , "aproComercial"
    , "aproFinanciera"
    , "codigoSii"
    , giro
    , "repLegalRut"
    , "repLegalNombre"
    , "repLegalApellido"
    , "repLegalMail"
    , fk_responsable
    , fk_comercial

    , CASE WHEN 
    cedula_2 is not null and LENGTH(cedula_2)>0
    and cedula_1_type is not null and LENGTH(cedula_1_type)>0
    and cedula_1_ext is not null and LENGTH(cedula_1_ext)>0
    then 'SI' else null end as cedula_1

    , CASE WHEN 
    cedula_2 is not null and LENGTH(cedula_2)>0
    and cedula_2_type is not null and LENGTH(cedula_2_type)>0
    and cedula_2_ext is not null and LENGTH(cedula_2_ext)>0
    then 'SI' else null end as cedula_2
     
    , CASE WHEN 
    podersimple_1 is not null and LENGTH(podersimple_1)>0
    and podersimple_1_type is not null and LENGTH(podersimple_1_type)>0
    and podersimple_1_ext is not null and LENGTH(podersimple_1_ext)>0
    then 'SI' else null end as podersimple_1
         
    , CASE WHEN 
    podersimple_2 is not null and LENGTH(podersimple_2)>0
    and podersimple_2_type is not null and LENGTH(podersimple_2_type)>0
    and podersimple_2_ext is not null and LENGTH(podersimple_2_ext)>0
    then 'SI' else null end as podersimple_2
    
    FROM public.clientes
    where id=`+parseInt(req.params.id)+`
    order by codigo asc
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
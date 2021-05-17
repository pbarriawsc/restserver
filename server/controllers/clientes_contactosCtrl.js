const client = require('../config/db.client');
const bcrypt= require('bcrypt');
const enviarEmail = require('../../handlers/email');

exports.CLICONT_Post = async (req,res) =>{
    var moment = require('moment');

    if (!req.body.fk_cliente) {
        res.status(400).send({
        message: "EL CLIENTE ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.nombre) {
        res.status(400).send({
        message: "EL NOMBRE ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.apellido){
        res.status(400).send({
        message: "EL APELLIDO ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.telefono_1){
        res.status(400).send({
        message: "EL TELEFONO PRINCIPAL ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.email){
        res.status(400).send({
        message: "EL EMAIL ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.fk_tipo){
        res.status(400).send({
        message: "EL TIPO ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if ( (!req.body.rut || req.body.rut.length==0) && req.body.fk_tipo==4 ){
        res.status(400).send({
            message: "EL RUT ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
    }
    else{

        let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

        function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }
        function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
        function LimpiarFecha (fecha) { if(!fecha || fecha.length<10 ) { return null; } else { return fecha; } }
        function LimpiarFk (fk) { if(!fk || fk==0 || fk.length<10 ) { return null; } else { return fk; } }

        var nombre = LimpiarTexto(req.body.nombre);
        var rut = LimpiarTexto(req.body.rut);
        var apellido = LimpiarTexto(req.body.apellido);
        var telefono_1 = LimpiarTexto(req.body.telefono_1);
        var telefono_2 = LimpiarTexto(req.body.telefono_2);
        var email = LimpiarTexto(req.body.email);
        var cargo = LimpiarTexto(req.body.cargo);
        var fk_tipo = LimpiarFk(req.body.fk_tipo);
        var fk_cliente = LimpiarFk(req.body.fk_cliente);
        var comentario = LimpiarTexto(req.body.comentario);
    
        var columna = ''; var valor = '';
        columna+=`nombre,`; valor+=`'`+nombre+`',`;
        columna+=`rut,`; valor+=`'`+rut+`',`;
        columna+=`apellido,`; valor+=`'`+apellido+`',`;
        columna+=`telefono_1,`; valor+=`'`+telefono_1+`',`;
        columna+=`telefono_2,`; valor+=`'`+telefono_2+`',`;
        columna+=`email,`; valor+=`'`+email+`',`;
        columna+=`cargo,`; valor+=`'`+cargo+`',`;
        columna+=`fk_tipo,`; valor+=``+fk_tipo+`,`;
        columna+=`fk_cliente,`; valor+=``+fk_cliente+`,`;
        columna+=`comentario,`; valor+=`'`+comentario+`',`;
        columna+=`estado`; valor+=`true`;
    
        await client.query(` INSERT INTO public.clientes_contactos (`+columna+`) VALUES (`+valor+`) `);

        var UltId = await client.query(` SELECT * FROM public.clientes_contactos where email='`+email+`' order by id desc limit 1 `);

        if(fk_tipo==4 && UltId.rowCount>0)
        {
            var ExisteArchivo = await client.query(` SELECT * FROM public.clientes_contactos_archivos where fk_contacto=`+UltId.rows[0]['id']+` `);

            if(ExisteArchivo.rowCount<=0)
            {
                columna = ''; valor = '';
                columna+=`fk_contacto,`; valor+=``+UltId.rows[0]['id']+`,`;
                columna+=`cedula_1,`; valor+=`null,`;
                columna+=`cedula_1_type,`; valor+=`null,`;
                columna+=`cedula_1_ext,`; valor+=`null,`;
                columna+=`cedula_2,`; valor+=`null,`;
                columna+=`cedula_2_type,`; valor+=`null,`;
                columna+=`cedula_2_ext,`; valor+=`null,`;
                columna+=`podersimple_1,`; valor+=`null,`;
                columna+=`podersimple_1_type,`; valor+=`null,`;
                columna+=`podersimple_1_ext,`; valor+=`null,`;
                columna+=`podersimple_2,`; valor+=`null,`;
                columna+=`podersimple_2_type,`; valor+=`null,`;
                columna+=`podersimple_2_ext`; valor+=`null`;

                await client.query(` INSERT INTO public.clientes_contactos_archivos (`+columna+`) VALUES (`+valor+`) `);
            }
        }
        res.status(200).send([]); res.end(); res.connection.destroy();
    }
}

exports.CLICONT_Put = async (req,res) =>{
    var moment = require('moment');

    if (!req.body.id) {
        res.status(400).send({
        message: "NO SE DETECTO UN CONTACTO A EDITAR",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.fk_cliente) {
        res.status(400).send({
        message: "EL CLIENTE ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.nombre) {
        res.status(400).send({
        message: "EL NOMBRE ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.apellido){
        res.status(400).send({
        message: "EL APELLIDO ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.telefono_1){
        res.status(400).send({
        message: "EL TELEFONO PRINCIPAL ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.email){
        res.status(400).send({
        message: "EL EMAIL ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.cargo){
        res.status(400).send({
        message: "EL CARGO ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.fk_tipo){
        res.status(400).send({
        message: "EL TIPO ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }   
    else
    {
        let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        
        function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }
        function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
        function LimpiarFecha (fecha) { if(!fecha || fecha.length<10 ) { return null; } else { return fecha; } }
        function LimpiarFk (fk) { if(!fk || fk==0 || fk.length<10 ) { return null; } else { return fk; } }

        var id = LimpiarNumero(req.body.id);
        var nombre = LimpiarTexto(req.body.nombre);
        var apellido = LimpiarTexto(req.body.apellido);
        var telefono_1 = LimpiarTexto(req.body.telefono_1);
        var telefono_2 = LimpiarTexto(req.body.telefono_2);
        var email = LimpiarTexto(req.body.email);
        var cargo = LimpiarTexto(req.body.cargo);
        var fk_tipo = LimpiarFk(req.body.fk_tipo);
        var comentario = LimpiarTexto(req.body.comentario);

        var valores='';
        valores+=`nombre='`+nombre+`',`;
        valores+=`apellido='`+apellido+`',`;
        valores+=`telefono_1='`+telefono_1+`',`;
        valores+=`telefono_2='`+telefono_2+`',`;
        valores+=`email='`+email+`',`;
        valores+=`cargo='`+cargo+`',`;
        valores+=`fk_tipo=`+fk_tipo+`,`;
        valores+=`comentario='`+comentario+`'`;

        console.log(` UPDATE public.clientes_contactos SET `+valores+` where id=`+id+` `);
        await client.query(` UPDATE public.clientes_contactos SET `+valores+` where id=`+id+` `);
        res.status(200).send([]); res.end(); res.connection.destroy();
    }
}

exports.CLICONT_GetList = async (req,res) =>{

    function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
    var id = LimpiarNumero(req.params.id);
    
    var Lista = await client.query(` 
    SELECT 
    clicont.id
    , coalesce(clicont.rut,'') as rut
    , coalesce(clicont.nombre,'') as nombre
    , coalesce(clicont.apellido,'') as apellido
    , coalesce(clicont.email,'') as email
    , coalesce(clicont.telefono_1,'') as telefono_1
    , clicont.fk_cliente
    , coalesce(usu.usuario,'') as usuario
    , coalesce(tipo.nombre,'') as tipo_nombre
    from 
    public.clientes_contactos as clicont
    inner join public.contacto_tipo as tipo on clicont.fk_tipo=tipo.id
    left join usuario as usu on clicont.fk_usuario=usu.id
    WHERE 
    clicont.fk_cliente=`+id+` and clicont.estado is true 
    `);
    res.status(200).send(Lista.rows); res.end(); res.connection.destroy();

};

exports.CLICONT_Get = async (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
        message: "NO SE DETECTO UN ID A ACTUALIZAR",
        success:false }); res.end(); res.connection.destroy();
    }
    else
    {
        function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
        var id = LimpiarNumero(req.params.id);
        var Lista = await client.query(` 
        SELECT 
        cont.*
        , CASE WHEN 
        arch.cedula_1 is not null and LENGTH(arch.cedula_1)>0
        and arch.cedula_1_type is not null and LENGTH(arch.cedula_1_type)>0
        and arch.cedula_1_ext is not null and LENGTH(arch.cedula_1_ext)>0
        then 'SI' else null end as cedula_1
    
        , CASE WHEN 
        arch.cedula_2 is not null and LENGTH(arch.cedula_2)>0
        and arch.cedula_2_type is not null and LENGTH(arch.cedula_2_type)>0
        and arch.cedula_2_ext is not null and LENGTH(arch.cedula_2_ext)>0
        then 'SI' else null end as cedula_2
         
        , CASE WHEN 
        arch.podersimple_1 is not null and LENGTH(arch.podersimple_1)>0
        and arch.podersimple_1_type is not null and LENGTH(arch.podersimple_1_type)>0
        and arch.podersimple_1_ext is not null and LENGTH(arch.podersimple_1_ext)>0
        then 'SI' else null end as podersimple_1
             
        , CASE WHEN 
        arch.podersimple_2 is not null and LENGTH(arch.podersimple_2)>0
        and arch.podersimple_2_type is not null and LENGTH(arch.podersimple_2_type)>0
        and arch.podersimple_2_ext is not null and LENGTH(arch.podersimple_2_ext)>0
        then 'SI' else null end as podersimple_2
        
        from public.clientes_contactos as cont
        left join public.clientes_contactos_archivos as arch on cont.id=arch.fk_contacto
        WHERE cont.id=`+id+` 
        `);
        res.status(200).send(Lista.rows); res.end(); res.connection.destroy();
    }
};

exports.CLICONT_Delete = async (req,res) =>{

    if (!req.params.id) {
        res.status(400).send({
        message: "NO SE DETECTO UN ID A ELIMINAR",
        success:false }); res.end(); res.connection.destroy();
    }
    else
    {
        try{
            function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
            var id = LimpiarNumero(req.params.id);
            var Lista = await client.query(` DELETE FROM public.clientes_contactos WHERE id=`+id+` `);
            res.status(200).send(Lista.rows); res.end(); res.connection.destroy();
        } catch (error) {
            console.log("ERROR "+error);
            res.status(400).send({
                message: "NO SE PUEDE ELIMIAR, EL REGISTRO TIENE INFORMACIÓN RELACIONADA",
                success:false,
            });
            res.end(); res.connection.destroy();
        }
    }

};

exports.CLICONT_GetTipos = async (req,res) =>{

    try{
        var Lista = await client.query(` SELECT * FROM public.contacto_tipo order by nombre asc `);
        res.status(200).send(Lista.rows); res.end(); res.connection.destroy();
    } catch (error) {
        console.log("ERROR "+error);
        res.status(400).send({
            message: "NO SE PUDO CARGAR EL LISTADO DE LOS TIPOS DE CONTACTOS",
            success:false,
        });
        res.end(); res.connection.destroy();
    }

};
/************************************************************/
/************************************************************/
exports.CLICONT_UploadFile = async (req,res) =>{ try {

    const query = {
        text: 'UPDATE public.clientes_contactos_archivos SET '+req.body.tipo+'=$1, '+req.body.tipo+'_type=$2, '+req.body.tipo+'_ext=$3 WHERE fk_contacto=$4 RETURNING *',
        values: [req.files.archivo.data, req.body.type, req.body.ext, req.body.id],
    };

    client.query(query,"",function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        else
        {
            res.status(200).send("OK");
        }
    });

} catch (error) {
    console.log("ERROR "+error);
    res.status(400).send({
        message: "ERROR AL SUBIR ARCHIVO",
        success:false,
    }); res.end(); res.connection.destroy();
}};
/************************************************************/
/************************************************************/
exports.CLICONT_Cedula_1 = async (req,res) =>{ try {

    var Archivo = await client.query(` 
  SELECT 
  id
  ,cedula_1 as archivo
  ,cedula_1_type as tipo
  ,cedula_1_ext as extension
  from public.clientes_contactos_archivos WHERE fk_contacto=`+req.params.id+` 
  `);

    if(Archivo.rows.length<=0)
    {
        res.status(400).send({
            message: "NO SE ENCONTRO UN ARCHIVO",
            success:false }); res.end(); res.connection.destroy();
    }
    else
    {
        res.setHeader('Content-Type', Archivo.rows[0].tipo);
        res.setHeader('Content-Disposition', 'attachment; filename=cedula_1_'+Archivo.rows[0].id+Archivo.rows[0].extension);
        res.setHeader('Content-Length', Archivo.rows[0].archivo.length);
        res.end(Archivo.rows[0].archivo, 'binary');
    }

} catch (error) {
    console.log("ERROR "+error);
    res.status(400).send({
        message: "ERROR AL CARGAR EL ARCHIVO",
        success:false,
    }); res.end(); res.connection.destroy();
}};
/************************************************************/
/************************************************************/
exports.CLICONT_Cedula_2 = async (req,res) =>{ try {

    var Archivo = await client.query(` 
  SELECT 
  id
  ,cedula_2 as archivo
  ,cedula_2_type as tipo
  ,cedula_2_ext as extension
  from public.clientes_contactos_archivos WHERE fk_contacto=`+req.params.id+` 
  `);

    if(Archivo.rows.length<=0)
    {
        res.status(400).send({
            message: "NO SE ENCONTRO UN ARCHIVO",
            success:false }); res.end(); res.connection.destroy();
    }
    else
    {
        res.setHeader('Content-Type', Archivo.rows[0].tipo);
        res.setHeader('Content-Disposition', 'attachment; filename=cedula_2_'+Archivo.rows[0].id+Archivo.rows[0].extension);
        res.setHeader('Content-Length', Archivo.rows[0].archivo.length);
        res.end(Archivo.rows[0].archivo, 'binary');
    }

} catch (error) {
    console.log("ERROR "+error);
    res.status(400).send({
        message: "ERROR AL CARGAR EL ARCHIVO",
        success:false,
    }); res.end(); res.connection.destroy();
}};
/************************************************************/
/************************************************************/
exports.CLICONT_PoderSimple_1 = async (req,res) =>{ try {

    var Archivo = await client.query(` 
  SELECT 
  id
  ,podersimple_1 as archivo
  ,podersimple_1_type as tipo
  ,podersimple_1_ext as extension
  from public.clientes_contactos_archivos WHERE fk_contacto=`+req.params.id+` 
  `);

    if(Archivo.rows.length<=0)
    {
        res.status(400).send({
            message: "NO SE ENCONTRO UN ARCHIVO",
            success:false }); res.end(); res.connection.destroy();
    }
    else
    {
        res.setHeader('Content-Type', Archivo.rows[0].tipo);
        res.setHeader('Content-Disposition', 'attachment; filename=podersimple_1_'+Archivo.rows[0].id+Archivo.rows[0].extension);
        res.setHeader('Content-Length', Archivo.rows[0].archivo.length);
        res.end(Archivo.rows[0].archivo, 'binary');
    }

} catch (error) {
    console.log("ERROR "+error);
    res.status(400).send({
        message: "ERROR AL CARGAR EL ARCHIVO",
        success:false,
    }); res.end(); res.connection.destroy();
}};
/************************************************************/
/************************************************************/
exports.CLICONT_PoderSimple_2 = async (req,res) =>{ try {

    var Archivo = await client.query(` 
  SELECT 
  id
  ,podersimple_2 as archivo
  ,podersimple_2_type as tipo
  ,podersimple_2_ext as extension
  from public.clientes_contactos_archivos WHERE fk_contacto=`+req.params.id+` 
  `);

    if(Archivo.rows.length<=0)
    {
        res.status(400).send({
            message: "NO SE ENCONTRO UN ARCHIVO",
            success:false }); res.end(); res.connection.destroy();
    }
    else
    {
        res.setHeader('Content-Type', Archivo.rows[0].tipo);
        res.setHeader('Content-Disposition', 'attachment; filename=podersimple_2_'+Archivo.rows[0].id+Archivo.rows[0].extension);
        res.setHeader('Content-Length', Archivo.rows[0].archivo.length);
        res.end(Archivo.rows[0].archivo, 'binary');
    }

} catch (error) {
    console.log("ERROR "+error);
    res.status(400).send({
        message: "ERROR AL CARGAR EL ARCHIVO",
        success:false,
    }); res.end(); res.connection.destroy();
}};
/************************************************************/
/************************************************************/
exports.CLICONT_CrearUsuario = async (req,res) =>{
        var moment = require('moment');

        console.log(JSON.stringify(req.body));

        if (!req.body.id) {
            res.status(400).send({
                message: "NO SE DETECTO UN ID DE USUARIO",
                success:false }); res.end(); res.connection.destroy();
        }
        else if (!req.body.email) {
            res.status(400).send({
                message: "EL EMAIL ES OBLIGATORIO",
                success:false }); res.end(); res.connection.destroy();
        }
        else{

            let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

            function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }
            function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }

            var id = LimpiarNumero(req.body.id);
            var nombre = LimpiarTexto(req.body.nombre);
            var fk_cliente = LimpiarNumero(req.body.fk_cliente);
            var email = LimpiarTexto(req.body.email);
            var apellido = LimpiarTexto(req.body.apellido);
            var telefono_1 = LimpiarTexto(req.body.telefono_1);
            var rut = LimpiarTexto(req.body.rut);

            var Existe = await client.query(` SELECT * FROM public.usuario where email='`+email+`' and fk_rol=4 `);

            if(Existe.rowCount>0)
            {
                var fk_usuario = Existe.rows[0]['id'];

                var ExisteClienteUsuario = await client.query(` 
                SELECT 
                * 
                FROM 
                public.clientes_usuarios 
                where 
                fk_cliente=`+fk_cliente+` 
                and fk_usuario=`+fk_usuario+` 
                limit 1 `);

                if( ExisteClienteUsuario.rowCount<=0)
                {
                    columna = ''; valor = '';
                    columna+=`fk_cliente,`; valor+=``+fk_cliente+`,`;
                    columna+=`fk_usuario,`; valor+=``+UltId.rows[0]['id']+`,`;
                    columna+=`estado`; valor+=`true`;
                    await client.query(` INSERT INTO public.clientes_usuarios (`+columna+`) VALUES (`+valor+`) `);

                    var columna = ''; var valor = '';
                    columna+=`fk_cliente,`; valor+=``+fk_cliente+`,`;
                    columna+=`fk_usuario,`; valor+=``+fk_usuario+`,`;
                    columna+=`estado`; valor+=`true`;
                    await client.query(` INSERT INTO public.clientes_usuarios (`+columna+`) VALUES (`+valor+`) `);
                    await client.query(`UPDATE public.clientes_contactos SET fk_usuario=`+fk_usuario+` where id=`+id+` `);
                }

                res.status(200).send([]); res.end(); res.connection.destroy();
            }
            else
            {
                var contrasenia = Math.random().toString().substr(2, 8);
                var columna = ''; var valor = '';
                columna+=`nombre,`; valor+=`'`+nombre+`',`;
                columna+=`password,`; valor+=`'`+bcrypt.hashSync(contrasenia,10)+`',`;
                columna+=`usuario,`; valor+=`'`+email.toLowerCase()+`',`;
                columna+=`apellidos,`; valor+=`'`+apellido+`',`;
                columna+=`email,`; valor+=`'`+email+`',`;
                columna+=`telefono,`; valor+=`'`+telefono_1+`',`;
                columna+=`rut,`; valor+=`'`+rut+`',`;
                columna+=`fk_rol,`; valor+=`4,`;
                columna+=`estado`; valor+=`true`;

                await client.query(` INSERT INTO public.usuario (`+columna+`) VALUES (`+valor+`) `);

                var UltId = await client.query(` SELECT * FROM public.usuario where email='`+email+`' order by id desc limit 1 `);

                var ExisteClienteUsuario = await client.query(` 
                SELECT 
                * 
                FROM 
                public.clientes_usuarios 
                where 
                fk_cliente=`+fk_cliente+` 
                and fk_usuario=`+UltId.rows[0]['id']+` 
                limit 1 `);

                if( ExisteClienteUsuario.rowCount<=0)
                {
                    columna = ''; valor = '';
                    columna+=`fk_cliente,`; valor+=``+fk_cliente+`,`;
                    columna+=`fk_usuario,`; valor+=``+UltId.rows[0]['id']+`,`;
                    columna+=`estado`; valor+=`true`;
                    await client.query(` INSERT INTO public.clientes_usuarios (`+columna+`) VALUES (`+valor+`) `);
                }

                await client.query(`UPDATE public.clientes_contactos SET fk_usuario=`+UltId.rows[0]['id']+` where id=`+id+` `);

                var asunto = "CREACION DE CUENTA DE USUARIO";
                email = email.toLowerCase();
                var telefono = telefono_1;
                var usuario = email.toLowerCase();

                var estadoCorreo = await enviarEmail.mail_nuevo_usuario({
                    nombre
                    , apellido
                    , email
                    , usuario
                    , telefono
                    , asunto
                    , contrasenia
                });

                if( estadoCorreo )
                {
                    res.status(200).send([]); res.end(); res.connection.destroy();
                }
                else
                {
                    res.status(400).send({
                        message: "EL EMAIL YA ESTA REGISTRADO",
                        success:false }); res.end(); res.connection.destroy();
                }
            }


        }
    }

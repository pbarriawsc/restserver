const client = require('../config/db.client');
const bcrypt= require('bcrypt');
const enviarEmail = require('../../handlers/email');

exports.CLIUSU_GetList = async (req,res) =>{

    function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
    var id = LimpiarNumero(req.params.id);
    
    var Lista = await client.query(` 
    SELECT 
    cliusu.id
    , cliusu.fk_cliente
    , cliusu.fk_usuario
    , UPPER(concat(coalesce(usu.nombre,''),' ',coalesce(usu.apellidos,''))) as usuario
    , coalesce(usu.email,'') as email
    , coalesce(usu.telefono,'') as telefono
    , cliusu.estado
    FROM public.clientes_usuarios as cliusu
    inner join usuario as usu on cliusu.fk_usuario=usu.id
    where
    cliusu.fk_cliente=`+id+`
    `);
    
    res.status(200).send(Lista.rows); res.end(); res.connection.destroy();

};

exports.CLINOUSU_GetList = async (req,res) =>{

    function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
    var id = LimpiarNumero(req.params.id);
    
    var Lista = await client.query(` 
    SELECT 
    usu.id
    , UPPER(concat(coalesce(usu.nombre,''),' ',coalesce(usu.apellidos,''))) as usuario
    FROM usuario as usu 
    LEFT JOIN public.clientes_usuarios as cliusu on cliusu.fk_usuario=usu.id and cliusu.fk_cliente=`+id+`
    where
    usu.fk_rol=4 and cliusu.id is null
    `);
    
    res.status(200).send(Lista.rows); res.end(); res.connection.destroy();

};

exports.CLIUSU_PostNuevo = async (req,res) =>{

    if (!req.body.fk_cliente) {
        res.status(400).send({
        message: "EL CLIENTE ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.rut) {
        res.status(400).send({
        message: "EL RUT ES OBLIGATORIO",
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
    else if (!req.body.email){
        res.status(400).send({
        message: "EL EMAIL ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.usuario){
        res.status(400).send({
        message: "EL USUARIO ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.contrasenia){
        res.status(400).send({
        message: "LA CONSTRASEÑA ES OBLIGATORIA",
        success:false }); res.end(); res.connection.destroy();
    }    
    else{

        function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }
        function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
        function LimpiarFecha (fecha) { if(!fecha || fecha.length<10 ) { return null; } else { return fecha; } }
        function LimpiarFk (fk) { if(!fk || fk==0 || fk.length<10 ) { return null; } else { return fk; } }
    
        var rut = LimpiarTexto(req.body.rut);
        var nombre = LimpiarTexto(req.body.nombre);
        var apellido = LimpiarTexto(req.body.apellido);
        var email = LimpiarTexto(req.body.email.toLowerCase());
        var telefono = LimpiarTexto(req.body.telefono);
        var usuario = LimpiarTexto(req.body.usuario.toLowerCase());
        var contrasenia = LimpiarTexto(req.body.contrasenia.toLowerCase());
        var fk_cliente = LimpiarFk(req.body.fk_cliente);
    
        var existe_rut = await client.query(` SELECT id FROM public.usuario where rut='`+rut+`' limit 1 `);
        var existe_email = await client.query(` SELECT id FROM public.usuario where email='`+email+`' limit 1 `);
        var existe_usuario = await client.query(` SELECT id FROM public.usuario where usuario='`+usuario+`' limit 1 `);

        console.log("EXISTE RUT "+existe_rut.rowCount);
        console.log("EXISTE RUT "+existe_rut.rows.length);

        if(existe_rut.rowCount>0) {
            res.status(400).send({
            message: "EL RUT YA ESTA REGISTRADO",
            success:false }); res.end(); res.connection.destroy();
        }
        else if(existe_email.rowCount>0) {
            res.status(400).send({
            message: "EL EMAIL YA ESTA REGISTRADO",
            success:false }); res.end(); res.connection.destroy();
        }
        else if(existe_usuario.rowCount>0) {
            res.status(400).send({
            message: "EL USUARIO YA ESTA REGISTRADO",
            success:false }); res.end(); res.connection.destroy();
        }        
        else {
            var columna = ''; var valor = '';
            columna+=`nombre,`; valor+=`'`+nombre+`',`;
            columna+=`password,`; valor+=`'`+bcrypt.hashSync(contrasenia,10)+`',`;
            columna+=`usuario,`; valor+=`'`+usuario+`',`;
            columna+=`apellidos,`; valor+=`'`+apellido+`',`;
            columna+=`email,`; valor+=`'`+email+`',`;
            columna+=`telefono,`; valor+=`'`+telefono+`',`;
            columna+=`rut,`; valor+=`'`+rut+`',`;
            columna+=`fk_rol,`; valor+=`4,`;
            columna+=`estado`; valor+=`true`;
        
            await client.query(` INSERT INTO public.usuario (`+columna+`) VALUES (`+valor+`) `);

            var fk_usuario = await client.query(` SELECT id FROM public.usuario where rut='`+rut+`' limit 1 `);
            if(fk_usuario.rowCount>0)
            {
                fk_usuario = fk_usuario.rows[0]['id'];
                columna = ''; valor = '';
                columna+=`fk_cliente,`; valor+=``+fk_cliente+`,`;
                columna+=`fk_usuario,`; valor+=``+fk_usuario+`,`;
                columna+=`estado`; valor+=`true`;
                await client.query(` INSERT INTO public.clientes_usuarios (`+columna+`) VALUES (`+valor+`) `);
            
                var asunto = "CREACION DE CUENTA DE USUARIO";
                email = email.toLowerCase();
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
            else
            {
                res.status(400).send({
                message: "NO SE PUDO ENVIAR EL CORREO A "+email,
                success:false }); res.end(); res.connection.destroy();
            }   
        }
    }
};

exports.CLINOUSU_PostNuevo = async (req,res) =>{

    if (!req.body.fk_cliente) {
        res.status(400).send({
        message: "EL CLIENTE ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }
    else if (!req.body.fk_usuario) {
        res.status(400).send({
        message: "EL USUARIO ES OBLIGATORIO",
        success:false }); res.end(); res.connection.destroy();
    }    
    else{

        function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }
        function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
        function LimpiarFecha (fecha) { if(!fecha || fecha.length<10 ) { return null; } else { return fecha; } }
        function LimpiarFk (fk) { if(!fk || fk==0 || fk.length<10 ) { return null; } else { return fk; } }
    
        var fk_cliente = LimpiarFk(req.body.fk_cliente);
        var fk_usuario = LimpiarFk(req.body.fk_usuario);
    
        var columna = ''; var valor = '';
        columna+=`fk_cliente,`; valor+=``+fk_cliente+`,`;
        columna+=`fk_usuario,`; valor+=``+fk_usuario+`,`;
        columna+=`estado`; valor+=`true`;
        await client.query(` INSERT INTO public.clientes_usuarios (`+columna+`) VALUES (`+valor+`) `);
        res.status(200).send([]); res.end(); res.connection.destroy();

    }
};

exports.CLIUSU_DELETE = async (req,res) =>{

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
            var Lista = await client.query(` DELETE FROM public.clientes_usuarios WHERE id=`+id+` `);
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
        var Lista = await client.query(` SELECT * from public.clientes_contactos WHERE id=`+id+` `);
        res.status(200).send(Lista.rows); res.end(); res.connection.destroy();
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


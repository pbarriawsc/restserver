const client = require('../config/db.client');

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
    else{

        let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

        function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }
        function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
        function LimpiarFecha (fecha) { if(!fecha || fecha.length<10 ) { return null; } else { return fecha; } }
        function LimpiarFk (fk) { if(!fk || fk==0 || fk.length<10 ) { return null; } else { return fk; } }
    
        var nombre = LimpiarTexto(req.body.nombre);
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
    , clicont.nombre
    , clicont.fk_cliente
    , clicont.apellido
    , clicont.email
    , clicont.telefono_1
    , coalesce(tipo.nombre,'') as tipo_nombre
    from 
    public.clientes_contactos as clicont
    inner join public.contacto_tipo as tipo on clicont.fk_tipo=tipo.id
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
        var Lista = await client.query(` SELECT * from public.clientes_contactos WHERE id=`+id+` `);
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


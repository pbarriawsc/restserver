const client = require('../config/db.client');
const jwt=require('jsonwebtoken');

/************************************************************/
/************************************************************/
exports.GetList = async (req,res) =>{

    let token= req.get('Authorization');
    jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    try {
        let Lista = await client.query(`
        SELECT
        *
        FROM public.bodegas where estado=true
        order by id desc
        `);
        res.status(200).send(Lista.rows); res.end(); res.connection.destroy();
    } catch (error) {
        console.log("ERROR "+error);
        res.status(400).send({
        message: "ERROR AL CARGAR LISTADO",
        success:false,
        }); res.end(); res.connection.destroy();
    }
};
/************************************************************/
/************************************************************/
exports.Post = async (req,res) =>{
    var moment = require('moment');

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });
    try {
        if ( !req.body.fk_empresa || req.body.fk_empresa==0 ) {
            res.status(400).send({
            message: "EL PAIS ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.fk_zona || req.body.fk_zona==0 ) {
            res.status(400).send({
            message: "LA ZONA TARIFARIA ES OBLIGATORIA",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.nombre || req.body.nombre.trim()==0 ) {
            res.status(400).send({
            message: "EL NONBRE ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else {

            function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }
            function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
            function LimpiarFecha (fecha) { if(!fecha || fecha.length<10 ) { return null; } else { return fecha; } }
            function LimpiarFk (fk) { if(!fk || fk==0 || fk.length<10 ) { return null; } else { return fk; } }

            var nombre = LimpiarTexto(req.body.nombre);
            var fk_empresa = req.body.fk_empresa;
            var fk_zona = req.body.fk_zona;

            var Existenombre = await client.query(`SELECT * from public.bodegas where nombre='`+nombre+`' and fk_empresa=`+fk_empresa+` and "fk_zonaTarifaria"=`+fk_zona+` `);

            if(Existenombre.rows.length>0) {
                res.status(400).send({
                message: "EL NOMBRE YA ESTA INGRESADO",
                success:false }); res.end(); res.connection.destroy();
            }
            else {

                var columna = ''; var valor = '';
                columna+=`estado,`; valor+=`true,`;
                columna+=`"fk_zonaTarifaria",`; valor+=``+fk_zona+`,`;
                columna+=`fk_empresa,`; valor+=``+fk_empresa+`,`;
                columna+=`nombre`; valor+=`'`+nombre+`'`;

                await client.query(` INSERT INTO public.bodegas (`+columna+`) VALUES (`+valor+`) `);
                res.status(200).send([]); res.end(); res.connection.destroy();
            }
        }
    } catch (error) {
        console.log("ERROR "+error);
        res.status(400).send({
            message: "ERROR AL GUARDAR",
            success:false,
        });
        res.end(); res.connection.destroy();
    }
};
/************************************************************/
/************************************************************/
exports.Delete = async (req,res) =>{
    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });
    try {
        if ( !req.params.id || req.params.id==0 ) {
            res.status(400).send({
            message: "NO SE DETECTO UN ID A ELIMINAR",
            success:false }); res.end(); res.connection.destroy();
        }
        else {
            await client.query(`UPDATE public.bodegas set estado=false WHERE id=`+parseInt(req.params.id)+` `);
            res.status(200).send([]); res.end(); res.connection.destroy();
        }
    } catch (error) {
        console.log("ERROR "+error);
        res.status(400).send({
            message: "NO SE PUEDE ELIMIAR, EL REGISTRO TIENE INFORMACIÓN RELACIONADA",
            success:false,
        });
        res.end(); res.connection.destroy();
    }
};
/************************************************************/
/************************************************************/
exports.Get = async (req,res) =>{
    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });
    try {
          var Lista = await client.query(` SELECT * FROM public.bodegas WHERE id=`+parseInt(req.params.id)+` `);
          res.status(200).send(Lista.rows); res.end(); res.connection.destroy();
    } catch (error) {
        console.log("ERROR "+error);
        res.status(400).send({
            message: "NO SE LOGRO CARGAR LA INFORMACIÓN",
            success:false,
        });
        res.end(); res.connection.destroy();
    }
};
/************************************************************/
/************************************************************/
exports.Put = async (req,res) =>{
    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });
    try {
        if ( !req.body.id || req.body.id==0 ) {
            res.status(400).send({
            message: "NO SE DETECTO UN ID PARA ACTUALIZAR",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.fk_empresa || req.body.fk_empresa==0 ) {
            res.status(400).send({
            message: "EL PAIS ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.fk_zona || req.body.fk_zona==0 ) {
            res.status(400).send({
            message: "LA ZONA TARIFARIA ES OBLIGATORIA",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.nombre || req.body.nombre==0 ) {
            res.status(400).send({
            message: "EL NOMBRE ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else {

            function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }
            function LimpiarNumero (numero) { if(!numero) { return 0; } else { return parseInt(numero); } }
            function LimpiarFecha (fecha) { if(!fecha || fecha.length<10 ) { return null; } else { return fecha; } }
            function LimpiarFk (fk) { if(!fk || fk==0 || fk.length<10 ) { return null; } else { return fk; } }

            var id = req.body.id;
            var nombre = LimpiarTexto(req.body.nombre);
            var fk_empresa = req.body.fk_empresa;
            var fk_zona = req.body.fk_zona;

            var Existenombre = await client.query(`SELECT * from public.bodegas where id!=`+id+` and nombre='`+nombre+`' and fk_empresa=`+fk_empresa+` and "fk_zonaTarifaria"=`+fk_zona+` `);

            if(Existenombre.rows.length>0) {
                res.status(400).send({
                message: "EL NOMBRE YA ESTA INGRESADO",
                success:false }); res.end(); res.connection.destroy();
            }
            else {

                var valores='';
                valores+=`fk_empresa=`+fk_empresa+`,`;
                valores+=`"fk_zonaTarifaria"=`+fk_zona+`,`;
                valores+=`nombre='`+nombre+`'`;

                await client.query(` UPDATE public.bodegas SET `+valores+` where id=`+id);
                res.status(200).send([]); res.end(); res.connection.destroy();
            }
        }
    } catch (error) {
        console.log("ERROR "+error);
        res.status(400).send({
            message: "ERROR AL CARGAR LISTADO",
            success:false,
        });
        res.end(); res.connection.destroy();
    }
};
/************************************************************/
/************************************************************/
exports.GetRegionPais = async (req,res) =>{

    let token= req.get('Authorization');
    jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    try {
        let Lista = await client.query(`
        SELECT
        *
        FROM public.bodegas
        where fk_empresa=`+parseInt(req.params.id)+`
        order by id desc
        `);
        res.status(200).send(Lista.rows); res.end(); res.connection.destroy();
    } catch (error) {
        console.log("ERROR "+error);
        res.status(400).send({
        message: "ERROR AL CARGAR LISTADO",
        success:false,
        }); res.end(); res.connection.destroy();
    }
};
/************************************************************/
/************************************************************/

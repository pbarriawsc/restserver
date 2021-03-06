const client = require('../config/db.client');
const jwt=require('jsonwebtoken');

/************************************************************/
/************************************************************/
exports.GetList = async (req,res) =>{

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    try {

        let Lista = await client.query(`
        SELECT
        *
        FROM public.naves
        order by id desc
        `);
        res.status(200).send(Lista.rows); res.end(); res.connection.destroy();

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
exports.Post = async (req,res) =>{
    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });
    try {
        if ( !req.body.mmsi || req.body.mmsi.trim()==0 ) {
            res.status(400).send({
            message: "EL MMSI ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.imo || req.body.imo.trim()==0 ) {
            res.status(400).send({
            message: "EL IMO ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.nombre || req.body.nombre.trim()==0 ) {
            res.status(400).send({
            message: "EL NOMBRE ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.bandera || req.body.nombre.trim()==0 ) {
            res.status(400).send({
            message: "LA BANDERA ES OBLIGATORIA",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.tipo || req.body.tipo.trim()==0 ) {
            res.status(400).send({
            message: "EL TIPO ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else {

            var mmsi = req.body.mmsi.trim();
            var imo = req.body.imo.trim();
            var nombre = req.body.nombre.trim();
            var bandera = req.body.bandera.trim();
            var tipo = req.body.tipo.trim();

            var Existe = await client.query(`SELECT * from public.naves where mmsi='`+mmsi+`' `);
            if(Existe.rows.length>0) {
                res.status(400).send({
                message: "EL MMSI YA ESTA INGRESADO",
                success:false }); res.end(); res.connection.destroy();
            }
            else {
                var columna = ''; var valor = '';
                columna+=`mmsi,`; valor+=`'`+mmsi+`',`;
                columna+=`imo,`; valor+=`'`+imo+`',`;
                columna+=`nombre,`; valor+=`'`+nombre+`',`;
                columna+=`bandera,`; valor+=`'`+bandera+`',`;
                columna+=`tipo`; valor+=`'`+tipo+`'`;

                await client.query(` INSERT INTO public.naves (`+columna+`) VALUES (`+valor+`) `);
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
            await client.query(` DELETE FROM public.naves WHERE id=`+parseInt(req.params.id)+` `);
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
          var Lista = await client.query(` SELECT * FROM public.naves WHERE id=`+parseInt(req.params.id)+` `);
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
        if ( !req.body.mmsi || req.body.mmsi.trim()==0 ) {
            res.status(400).send({
            message: "EL MMSI ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.imo || req.body.imo.trim()==0 ) {
            res.status(400).send({
            message: "EL IMO ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.nombre || req.body.nombre.trim()==0 ) {
            res.status(400).send({
            message: "EL NOMBRE ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.bandera || req.body.nombre.trim()==0 ) {
            res.status(400).send({
            message: "LA BANDERA ES OBLIGATORIA",
            success:false }); res.end(); res.connection.destroy();
        }
        else if ( !req.body.tipo || req.body.tipo.trim()==0 ) {
            res.status(400).send({
            message: "EL TIPO ES OBLIGATORIO",
            success:false }); res.end(); res.connection.destroy();
        }
        else {

            var id = req.body.id;
            var mmsi = req.body.mmsi.trim();
            var imo = req.body.imo.trim();
            var nombre = req.body.nombre.trim();
            var tipo = req.body.tipo.trim();
            var bandera = req.body.bandera.trim();

            var Existe = await client.query(`SELECT * from public.naves where mmsi='`+mmsi+`' and id!=`+id+` `);

            if(Existe.rows.length>0) {
                res.status(400).send({
                message: "EL MMSI YA ESTA INGRESADO",
                success:false }); res.end(); res.connection.destroy();
            }
            else {

                var valores='';
                valores+=`mmsi='`+mmsi+`',`;
                valores+=`imo='`+imo+`',`;
                valores+=`nombre='`+nombre+`',`;
                valores+=`tipo='`+tipo+`',`;
                valores+=`bandera='`+bandera+`'`;

                await client.query(` UPDATE public.naves SET `+valores+` where id=`+id);
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

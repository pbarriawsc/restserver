const client = require('../config/db.client');
const jwt=require('jsonwebtoken');

/************************************************************/
/************************************************************/
exports.GetClientesList = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    var condicion = ` `;

    if(parseInt(req.params.id)!=1)
    {
        var condicion = ` and id=-1 `;
    }

    if(req.usuario.fk_rol==2)
    {
        if(condicion!='')
        {
          var condicion = ` and fk_comercial=`+req.usuario.id+``;
        }
        else
        {
          var condicion = ` and fk_comercial=`+req.usuario.id+``;
        }

    }

    let Lista = await client.query(`
    SELECT
    *
    FROM public.clientes
    where
    estado is true
    `+condicion+`
    order by codigo asc`);

    res.status(200).send(Lista.rows); res.end(); res.connection.destroy();

} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "ERROR AL CARGAR LISTA DE CLIENTES ",
success:false,
}); res.end(); res.connection.destroy();
} };
/************************************************************/
/************************************************************/
exports.GetCliente = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    let Cliente = await client.query(`
    SELECT
    *
    FROM public.clientes
    where id=`+parseInt(req.params.id)+`
    order by codigo asc`);

    res.status(200).send(Cliente.rows); res.end(); res.connection.destroy();

} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "ERROR AL CARGAR CLIENTE ",
success:false,
}); res.end(); res.connection.destroy();
} };
/************************************************************/
/************************************************************/
exports.PostCliente = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });
    function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }

    if (!req.body.codigo || req.body.codigo.trim().length==0) {
      res.status(400).send({
      message: "EL NOMBRE CORTO ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else if (!req.body.rut || req.body.rut.trim().length==0) {
      res.status(400).send({
      message: "EL RUT ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else if (!req.body.razonSocial || req.body.razonSocial.trim().length==0) {
      res.status(400).send({
      message: "LA RAZON SOCIAL ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else if (!req.body.telefono1 || req.body.telefono1.trim().length==0) {
      res.status(400).send({
      message: "EL TELEFONO ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else if (!req.body.dteEmail || req.body.dteEmail.trim().length==0) {
      res.status(400).send({
      message: "EL EMAIL ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else
    {

      var codigo          = LimpiarTexto(req.body.codigo);
      var rut             = LimpiarTexto(req.body.rut);
      var razonSocial     = LimpiarTexto(req.body.razonSocial);
      var codigoSii       = LimpiarTexto(req.body.codigoSii);
      var giro            = LimpiarTexto(req.body.giro);
      var web             = LimpiarTexto(req.body.web);
      var telefono1       = LimpiarTexto(req.body.telefono1);
      var telefono2       = LimpiarTexto(req.body.telefono2);
      var dteEmail        = LimpiarTexto(req.body.dteEmail);
      var aproComercial   = req.body.aproComercial;
      var aproFinanciera  = req.body.aproFinanciera;
      var repLegalRut     = LimpiarTexto(req.body.repLegalRut);
      var repLegalNombre    = LimpiarTexto(req.body.repLegalNombre);
      var repLegalApellido  = LimpiarTexto(req.body.repLegalApellido);
      var repLegalMail      = LimpiarTexto(req.body.repLegalMail);

      let ExisteCodigo = await client.query(` SELECT * FROM public.clientes WHERE codigo='`+codigo+`' `);

      let ExisteRut = await client.query(` SELECT * FROM public.clientes WHERE rut='`+rut+`' and LENGTH(rut)>0 `);

      let ExisteEmail = await client.query(` SELECT * FROM public.clientes WHERE "dteEmail"='`+dteEmail+`' and LENGTH("dteEmail")>0 `);

      if( ExisteCodigo.rows.length>0 ) {
        res.status(400).send({
        message: "EL NOMBRE CORTO YA ESTÁ INGRESADO",
        success:false
        }); res.end(); res.connection.destroy();
      }
      else if( ExisteRut.rows.length>0 ) {
        res.status(400).send({
        message: "EL RUT YA ESTÁ INGRESADO",
        success:false
        }); res.end(); res.connection.destroy();
      }
      else if( ExisteEmail.rows.length>0 ) {
        res.status(400).send({
        message: "EL EMAIL YA ESTÁ INGRESADO",
        success:false
        }); res.end(); res.connection.destroy();
      }
      else
      {
          let columnas = '';     let datos = '';

          columnas=`codigo,`;             datos=`'`+codigo+`', `;
          columnas+=`estado, `;           datos+=`true, `;
          columnas+=`rut, `;              datos+=`'`+rut+`', `;
          columnas+=`"razonSocial", `;    datos+=`'`+razonSocial+`', `;
          columnas+=`"codigoSii", `;      datos+=`'`+codigoSii+`', `;
          columnas+=`web, `;              datos+=`'`+web+`', `;
          columnas+=`telefono1, `;        datos+=`'`+telefono1+`', `;
          columnas+=`telefono2, `;        datos+=`'`+telefono2+`', `;
          columnas+=`"dteEmail", `;       datos+=`'`+dteEmail+`', `;
          columnas+=`"aproComercial", `;  datos+= aproComercial+`, `;
          columnas+=`fk_responsable, `;   datos+= req.usuario.id+`, `;
          columnas+=`fk_comercial, `;     datos+= req.usuario.id+`, `;
          columnas+=`giro, `;             datos+= `'`+giro+`', `;
          columnas+=`"repLegalRut", `;    datos+= `'`+repLegalRut+`', `;
          columnas+=`"repLegalNombre", `; datos+= `'`+repLegalNombre+`', `;
          columnas+=`"repLegalApellido", `; datos+= `'`+repLegalApellido+`', `;
          columnas+=`"repLegalMail", `;   datos+= `'`+repLegalMail+`', `;
          columnas+=`"aproFinanciera" `;  datos+= aproFinanciera+` `;

          console.log(`INSERT INTO public.clientes (`+columnas+`) values (`+datos+`)`);
          await client.query(`INSERT INTO public.clientes (`+columnas+`) values (`+datos+`)`);

          var Lista = await client.query(`SELECT * FROM clientes where fk_responsable=`+req.usuario.id+` order by id desc limit 1` );

          res.status(200).send(Lista.rows); res.end(); res.connection.destroy();
        }
    }

} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "ERROR AL CARGAR CLIENTE ",
success:false,
}); res.end(); res.connection.destroy();
} };
/************************************************************/
/************************************************************/
exports.GetComercialesList = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    var condicion = ` `;

    if(req.usuario.fk_rol==2)
    {
      var condicion = ` and id=`+req.usuario.id+``;
    }

    let Lista = await client.query(`
    SELECT
    id, rut, usuario, nombre, password, apellidos, email, telefono, estado, fk_rol
    FROM public.usuario
    where
    fk_rol=2
    `+condicion+`
    order by nombre asc`);

    res.status(200).send(Lista.rows); res.end(); res.connection.destroy();

} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "ERROR AL CARGAR LISTA DE CLIENTES ",
success:false,
}); res.end(); res.connection.destroy();
} };
/************************************************************/
/************************************************************/
exports.PutCliente = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });
    function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }

    if (!req.body.id || req.body.id==0 ) {
      res.status(400).send({
      message: "EL ID ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else if (!req.body.codigo || req.body.codigo.trim().length==0) {
      res.status(400).send({
      message: "EL NOMBRE CORTO ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else if (!req.body.rut || req.body.rut.trim().length==0) {
      res.status(400).send({
      message: "EL RUT ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else if (!req.body.razonSocial || req.body.razonSocial.trim().length==0) {
      res.status(400).send({
      message: "LA RAZON SOCIAL ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else if (!req.body.telefono1 || req.body.telefono1.trim().length==0) {
      res.status(400).send({
      message: "EL TELEFONO ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else if (!req.body.dteEmail || req.body.dteEmail.trim().length==0) {
      res.status(400).send({
      message: "EL EMAIL ES OBLIGATORIO",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else
    {

      var id          = req.body.id;
      var codigo          = LimpiarTexto(req.body.codigo);
      var rut             = LimpiarTexto(req.body.rut);
      var razonSocial     = LimpiarTexto(req.body.razonSocial);
      var codigoSii       = LimpiarTexto(req.body.codigoSii);
      var giro            = LimpiarTexto(req.body.giro);
      var web             = LimpiarTexto(req.body.web);
      var telefono1       = LimpiarTexto(req.body.telefono1);
      var telefono2       = LimpiarTexto(req.body.telefono2);
      var dteEmail        = LimpiarTexto(req.body.dteEmail);
      var aproComercial   = req.body.aproComercial;
      var aproFinanciera  = req.body.aproFinanciera;
      var repLegalRut     = LimpiarTexto(req.body.repLegalRut);
      var repLegalNombre    = LimpiarTexto(req.body.repLegalNombre);
      var repLegalApellido  = LimpiarTexto(req.body.repLegalApellido);
      var repLegalMail      = LimpiarTexto(req.body.repLegalMail);

      let ExisteCodigo = await client.query(` SELECT * FROM public.clientes WHERE codigo='`+codigo+`' and id!=`+id+` `);

      let ExisteRut = await client.query(` SELECT * FROM public.clientes WHERE rut='`+rut+`' and LENGTH(rut)>0 and id!=`+id+` `);

      let ExisteEmail = await client.query(` SELECT * FROM public.clientes WHERE "dteEmail"='`+dteEmail+`' and LENGTH("dteEmail")>0 and id!=`+id+` `);

      if( ExisteCodigo.rows.length>0 ) {
        res.status(400).send({
        message: "EL NOMBRE CORTO YA ESTÁ INGRESADO",
        success:false
        }); res.end(); res.connection.destroy();
      }
      else if( ExisteRut.rows.length>0 ) {
        res.status(400).send({
        message: "EL RUT YA ESTÁ INGRESADO",
        success:false
        }); res.end(); res.connection.destroy();
      }
      else if( ExisteEmail.rows.length>0 ) {
        res.status(400).send({
        message: "EL EMAIL YA ESTÁ INGRESADO",
        success:false
        }); res.end(); res.connection.destroy();
      }
      else
      {
          let datos = '';

          datos+=`codigo='`+codigo+`', `;
          datos+=`estado=true', `;
          datos+=`rut='`+rut+`', `;
          datos+=`"razonSocial"='`+razonSocial+`', `;
          datos+=`"codigoSii"='`+codigoSii+`', `;
          datos+=`web='`+web+`', `;
          datos+=`telefono1='`+telefono1+`', `;
          datos+=`telefono2='`+telefono2+`', `;
          datos+=`"dteEmail"='`+dteEmail+`', `;
          datos+= `"aproComercial"=`+aproComercial+`, `;
          datos+= `fk_comercial=`+req.usuario.id+`, `;
          datos+= `giro='`+giro+`', `;
          datos+= `"repLegalRut"='`+repLegalRut+`', `;
          datos+= `"repLegalNombre"='`+repLegalNombre+`', `;
          datos+= `"repLegalApellido"='`+repLegalApellido+`', `;
          datos+= `"repLegalMail"='`+repLegalMail+`', `;
          datos+= `"aproFinanciera"=`+aproFinanciera+` `;

          console.log(`UPDATE public.clientes set `+datos+` where id=`+req.body.id);
          await client.query(`UPDATE public.clientes set `+datos+` where id=`+req.body.id);

          res.status(200).send([]); res.end(); res.connection.destroy();
        }
    }

} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "ERROR AL CARGAR CLIENTE ",
success:false,
}); res.end(); res.connection.destroy();
} };
/************************************************************/
/************************************************************/
exports.DeleteCliente = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });
    await client.query(`UPDATE public.clientes SET estado=false where id=`+parseInt(req.params.id));
    res.status(200).send([]); res.end(); res.connection.destroy();

} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "NO SE PUEDE ELIMINAR, TIENE INFORMACIÓN RELACIONADA",
success:false,
}); res.end(); res.connection.destroy();
} };
/************************************************************/
/************************************************************/
exports.GetInfoQr = async (req,res) =>{ try {

    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    var InfoQr = await client.query(`
    SELECT
    CLI.id
    , CLI."razonSocial"
    , CLI.rut
    , '' as direccion
    , CLI.telefono1
    , CLI.codigo
    , COALESCE(CONCAT(dir.nombre,', ',dir.direccion,' ',dir.numero,', ',comunas.nombre),'') as direccion
    from public.clientes as cli
    inner join public.clientes_direcciones as dir on cli.id=dir.fk_cliente
    inner join direcciones_tipos as dir_tipo on dir_tipo.id=dir.fk_tipo
    inner join pais on pais.id=dir.fk_pais
    inner join region on region.id=dir.fk_region
    inner join comunas on comunas.id=dir.fk_comuna
    where
    cli.id=`+parseInt(req.params.id)+`
    limit 1
    `
    );

    if(InfoQr.rows.length>0)
    {
      res.status(200).send(InfoQr.rows); res.end(); res.connection.destroy();
    }
    else {
      res.status(200).send([]); res.end(); res.connection.destroy();
    }

} catch (error) {
console.log("ERROR "+error);
res.status(400).send({
message: "NO SE PUEDE ELIMINAR, TIENE INFORMACIÓN RELACIONADA",
success:false,
}); res.end(); res.connection.destroy();
} };
/************************************************************/
/************************************************************/
exports.update = (req, res) => {
    // Validate request
    if (!req.body.codigo){
        res.status(400).send({
            message: "EL CODIGO ES OBLIGATORIO",
            success:false
          });
          return;
    }else if (!req.body.nombre){
        res.status(400).send({
            message: "EL NOMBRE ES OBLIGATORIO",
            success:false
          });
          return;
    }

    const query = {
        text: 'UPDATE public.clientes SET codigo=$1, rut=$2, nombre=$3, "razonSocial"=$4, web=$5, telefono1=$6, telefono2=$7, "dteEmail"=$8, "aproComercial"=$9, "aproFinanciera"=$10 where id=$11 RETURNING *',
        values: [req.body.codigo, req.body.rut, req.body.nombre, req.body.razonSocial, req.body.web, req.body.telefono1, req.body.telefono2, req.body.dteEmail, req.body.aproComercial, req.body.aproFinanciera, req.body.id],
    };

    client.query(query,"",function (err, result)
    {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
}

  exports.list = (req, res) => {
    client.query('SELECT * FROM public.clientes', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
  };

  exports.findOneBy = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "EL ID ES OBLIGATORIO",
            success:false
          });
          return;
    }
    client.query('SELECT * FROM public.clientes where id = $1', [parseInt(req.params.id)], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    };

exports.findOneByCodigo = (req,res) =>{
    if (!req.params.codigo) {
        res.status(400).send({
            message: "EL ID ES OBLIGATORIO",
            success:false
          });
          return;
    }
    let query="SELECT * FROM public.clientes where codigo ='"+req.params.codigo+"' LIMIT 1";
        client.query(query,"", function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
};
exports.delete = async (req,res) =>{

    try {
        if (!req.params.id){
            res.status(400).send({ message: "NO SE DETECTO UN CLIENTE A ELIMINAR", success:false,});
            res.end(); res.connection.destroy();
        }else {
            await client.query(`DELETE FROM public.clientes where id=`+parseInt(req.params.id));
            res.status(200).send([]);
        }
    } catch (error) {
        console.log("====== DELETE CLIENTE ======");console.log(error);console.log("");console.log("");
        res.status(400).send({message: "NO SE PUEDE ELIMINAR EL CLIENTE, TIENE INFORMACIÓN RELACIONADA ", success:false,});
        res.end(); res.connection.destroy();
    }
};

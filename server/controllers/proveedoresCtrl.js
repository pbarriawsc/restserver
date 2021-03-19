const client = require('../config/db.client');
const jwt=require('jsonwebtoken');
/************************************************************/
/************************************************************/
exports.GetClientes = async (req, res) => {
    try {

        let Lista = await client.query(` SELECT * FROM public.clientes order by "razonSocial" asc`);
        res.status(200).send(Lista.rows);
        res.end(); res.connection.destroy();

    } catch (error) {
      console.log('ERROR GetClientes');
      console.log('ERROR GetClientes');
      console.log(error);
      console.log('ERROR GetClientes');
      console.log('ERROR GetClientes');
        res.status(400).send({
            message: "ERROR AL CARGAR CLIENTES "+error,
            success:false,
        });
        res.end(); res.connection.destroy();
    }

};
/************************************************************/
/************************************************************/
exports.GetProveedoresClientes = async (req, res) => {
  try {
      let Lista = await client.query(` SELECT * FROM public.proveedores where fk_cliente=`+parseInt(req.params.id)+` order by id desc`);
      res.status(200).send(Lista.rows);
      res.end(); res.connection.destroy();

  } catch (error) {
    console.log('ERROR GetProveedoresClientes');
    console.log('ERROR GetProveedoresClientes');
    console.log(error);
    console.log('ERROR GetProveedoresClientes');
    console.log('ERROR GetProveedoresClientes');
      res.status(400).send({
          message: "ERROR AL CARGAR PROVEEDORES "+error,
          success:false,
      });
      res.end(); res.connection.destroy();
  }

};
/************************************************************/
/************************************************************/
exports.Create = async (req, res) => { try {
    if (!req.body.fk_cliente || req.body.fk_cliente=='0') {
      res.status(400).send({
        message: "EL CLIENTE ES OBLIGATORIO",
        success:false
      }); res.end(); res.connection.destroy();
    }else if (!req.body.codigo || req.body.codigo.trim().length==0) {
      res.status(400).send({
        message: "EL CODIGO ES OBLIGATORIO",
        success:false
      }); res.end(); res.connection.destroy();
    }else if (!req.body.nombre || req.body.nombre.trim().length==0) {
      res.status(400).send({
        message: "EL NOMBRE ESPAÑOL ES OBLIGATORIO",
        success:false
      }); res.end(); res.connection.destroy();
    }
    else
    {

      var codigo = req.body.codigo.trim();
      var nombre = req.body.nombre.trim();
      var fk_cliente = req.body.fk_cliente;

      if(!req.body.codigoTributario || req.body.codigoTributario.trim().length==0)
      { var codigoTributario = ''; } else { var codigoTributario = req.body.codigoTributario.trim(); }

      if(!req.body.nombreChi || req.body.nombreChi.trim().length==0)
      { var nombreChi = ''; } else { var nombreChi = req.body.nombreChi.trim(); }

      let ExisteCodigo = await client.query(` SELECT * FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+` and codigo='`+req.body.codigo+`' `);

      let ExisteCodigoTributario = await client.query(` SELECT * FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+` and "codigoTributario"='`+req.body.codigoTarifario+`' and length("codigoTributario")>0  `);

      let Existenombre = await client.query(` SELECT * FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+` and nombre='`+req.body.nombre+`' `);

      let ExisteNombreChi = await client.query(` SELECT * FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+` and "nombreChi"='`+req.body.nombreChi+`' and length("nombreChi")>0 `);

      if( ExisteCodigo.rows.length>0 ) {
        res.status(400).send({
            message: "EL CÓDIGO YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      } else if( ExisteCodigoTributario.rows.length>0 ) {
          res.status(400).send({
              message: "EL CÓDIGO TRIBUTARIO YA ESTÁ INGRESADO",
              success:false
          }); res.end(); res.connection.destroy();
      } else if( Existenombre.rows.length>0 ) {
        res.status(400).send({
            message: "EL NOMBRE ESPAÑOL YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      } else if( ExisteNombreChi.rows.length>0 ) {
        res.status(400).send({
            message: "EL NOMBRE CHINO YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      }
      else
      {


        let qry_1 = '';     let qry_2 = '';

        qry_1 = ` codigo, `;
        qry_2 = ` '`+codigo+`', `;

        qry_1 += ` "codigoTributario", `;
        qry_2 += ` '`+codigoTributario+`', `;

        qry_1 += ` nombre, `;
        qry_2 += ` '`+nombre+`', `;

        qry_1 += ` "nombreChi", `;
        qry_2 += ` '`+nombreChi+`', `;

        qry_1 += ` fk_cliente `;
        qry_2 += ` `+fk_cliente+` `;

        await client.query(`INSERT INTO public.proveedores (`+qry_1+`) values (`+qry_2+`)`);

        let Listado = await client.query(`
        SELECT
        *
        FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+`
        ORDER BY id DESC
        `);

        res.status(200).send(Listado.rows);

      }

    }

} catch (error) {
console.log('ERROR Create');
console.log('ERROR Create');
console.log(error);
console.log('ERROR Create');
console.log('ERROR Create');
    res.status(400).send({ message: "ERROR AL GUARDAR INFORMACIÓN "+error, success:false, }); res.end(); res.connection.destroy(); } }
/************************************************************/
/************************************************************/
exports.GetProveedor = async (req, res) => {
    try {

        let Lista = await client.query(` SELECT * FROM public.proveedores where id=`+parseInt(req.params.id)+` limit 1`);
        res.status(200).send(Lista.rows);
        res.end(); res.connection.destroy();

    } catch (error) {
      console.log('ERROR GetProveedor');
      console.log('ERROR GetProveedor');
      console.log(error);
      console.log('ERROR GetProveedor');
      console.log('ERROR GetProveedor');
        res.status(400).send({
            message: "ERROR AL CARGAR PROVEEDOR "+error,
            success:false,
        });
        res.end(); res.connection.destroy();
    }

};
/************************************************************/
/************************************************************/
exports.Update = async (req, res) => { try {

    if (!req.body.id || req.body.id=='0') {
      res.status(400).send({
        message: "NO SE DETECTO UN PROVEEDOR A EDITAR",
        success:false
      }); res.end(); res.connection.destroy();
    }
    else if (!req.body.fk_cliente || req.body.fk_cliente=='0') {
      res.status(400).send({
        message: "EL CLIENTE ES OBLIGATORIO",
        success:false
      }); res.end(); res.connection.destroy();
    }else if (!req.body.codigo || req.body.codigo.trim().length==0) {
      res.status(400).send({
        message: "EL CODIGO ES OBLIGATORIO",
        success:false
      }); res.end(); res.connection.destroy();
    }else if (!req.body.nombre || req.body.nombre.trim().length==0) {
      res.status(400).send({
        message: "EL NOMBRE ESPAÑOL ES OBLIGATORIO",
        success:false
      }); res.end(); res.connection.destroy();
    }
    else
    {

      var codigo = req.body.codigo.trim();
      var nombre = req.body.nombre.trim();
      var fk_cliente = req.body.fk_cliente;

      if(!req.body.codigoTributario || req.body.codigoTributario.trim().length==0)
      { var codigoTributario = ''; } else { var codigoTributario = req.body.codigoTributario.trim(); }

      if(!req.body.nombreChi || req.body.nombreChi.trim().length==0)
      { var nombreChi = ''; } else { var nombreChi = req.body.nombreChi.trim(); }

      let ExisteCodigo = await client.query(` SELECT * FROM public.proveedores WHERE id!=`+req.body.id+` and fk_cliente=`+req.body.fk_cliente+` and codigo='`+req.body.codigo+`' `);

      let ExisteCodigoTributario = await client.query(` SELECT * FROM public.proveedores WHERE id!=`+req.body.id+` and fk_cliente=`+req.body.fk_cliente+` and "codigoTributario"='`+req.body.codigoTarifario+`' and length("codigoTributario")>0  `);

      let Existenombre = await client.query(` SELECT * FROM public.proveedores WHERE id!=`+req.body.id+` and fk_cliente=`+req.body.fk_cliente+` and nombre='`+req.body.nombre+`' `);

      let ExisteNombreChi = await client.query(` SELECT * FROM public.proveedores WHERE id!=`+req.body.id+` and fk_cliente=`+req.body.fk_cliente+` and "nombreChi"='`+req.body.nombreChi+`' and length("nombreChi")>0 `);

      if( ExisteCodigo.rows.length>0 ) {
        res.status(400).send({
            message: "EL CÓDIGO YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      } else if( ExisteCodigoTributario.rows.length>0 ) {
          res.status(400).send({
              message: "EL CÓDIGO TRIBUTARIO YA ESTÁ INGRESADO",
              success:false
          }); res.end(); res.connection.destroy();
      } else if( Existenombre.rows.length>0 ) {
        res.status(400).send({
            message: "EL NOMBRE ESPAÑOL YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      } else if( ExisteNombreChi.rows.length>0 ) {
        res.status(400).send({
            message: "EL NOMBRE CHINO YA ESTÁ INGRESADO",
            success:false
        }); res.end(); res.connection.destroy();
      }
      else
      {

        let qry_1 = '';

        qry_1 = ` codigo='`+codigo+`', `;

        qry_1 += ` "codigoTributario"='`+codigoTributario+`', `;

        qry_1 += ` nombre='`+nombre+`', `;

        qry_1 += ` "nombreChi"='`+nombreChi+`', `;

        qry_1 += ` fk_cliente=`+fk_cliente+` `;

        await client.query(`UPDATE public.proveedores SET `+qry_1+` WHERE id=`+req.body.id);

        let Listado = await client.query(`
        SELECT
        *
        FROM public.proveedores WHERE fk_cliente=`+req.body.fk_cliente+`
        ORDER BY id DESC
        `);

        res.status(200).send(Listado.rows);

      }

    }

} catch (error) {
  console.log('ERROR Update');
  console.log('ERROR Update');
  console.log(error);
  console.log('ERROR Update');
  console.log('ERROR Update');
  res.status(400).send({ message: "ERROR AL GUARDAR INFORMACIÓN "+error, success:false, }); res.end(); res.connection.destroy(); } }
/************************************************************/
/************************************************************/
exports.PostProvCliente = async (req, res) => { try {
    var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    if (!req.body.fk_cliente || req.body.fk_cliente==0) {
        res.status(400).send({
            message: "EL CLIENTE ES OBLIGATORIO",
            success:false
        }); res.end(); res.connection.destroy();
    }
    else if (!req.body.fk_direccion || req.body.fk_direccion==0) {
        res.status(400).send({
            message: "LA DIRECCIÓN ES OBLIGATORIA",
            success:false
        }); res.end(); res.connection.destroy();
    }
    else if (!req.body.fk_proveedor || req.body.fk_proveedor==0) {
        res.status(400).send({
            message: "EL PROVEEDOR ES OBLIGATORIO",
            success:false
        }); res.end(); res.connection.destroy();
    }
    else if (!req.body.fk_bodega || req.body.fk_bodega==0) {
        res.status(400).send({
            message: "LA BODEGA ES OBLIGATORIA",
            success:false
        }); res.end(); res.connection.destroy();
    }
    else if (!req.body.peso ) {
        res.status(400).send({
            message: "EL PESO ES OBLIGATORIO",
            success:false
        }); res.end(); res.connection.destroy();
        return;
    }
    else if (!req.body.bultos ) {
        res.status(400).send({
            message: "LOS BULTOS SON OBLIGATORIOS",
            success:false
        }); res.end(); res.connection.destroy();
    }
    else if (!req.body.volumen ) {
        res.status(400).send({
            message: "EL VOLUMEN ES OBLIGATORIO",
            success:false
        }); res.end(); res.connection.destroy();
    }
    else
    {
        function formatear_numero(Numero)
        {
            Numero = Numero.toString().replace(/\./g,'');
            Numero = Numero.toString().replace(/\,/g,'.');
            return Numero;
        }

        if(!req.body.volumen || req.body.volumen.length==0)
        { req.body.volumen = 0; } else {
            req.body.volumen = formatear_numero(req.body.volumen);
        }

        if(!req.body.peso || req.body.peso.length==0)
        { req.body.peso = 0; } else {
            req.body.peso = formatear_numero(req.body.peso);
        }

        if(!req.body.bultos || req.body.bultos.length==0)
        { req.body.bultos = 0; } else {
            req.body.bultos = formatear_numero(req.body.bultos);
        }

        let qry_1 = '';     let qry_2 = '';

        qry_1 = ` estado, `;
        qry_2 = ` 0, `;

        qry_1 += ` fk_responsable, `;
        qry_2 += ` `+req.usuario.id+`, `;

        qry_1 += ` "fechaCreacion", `;
        qry_2 += ` '`+fecha+`', `;

        qry_1 += ` "fechaActualizacion", `;
        qry_2 += ` '`+fecha+`', `;

        qry_1 += ` fk_cliente, `;
        qry_2 += ` `+req.body.fk_cliente+`, `;

        qry_1 += ` fk_proveedor, `;
        qry_2 += ` `+req.body.fk_proveedor+`, `;

        qry_1 += ` fk_direccion, `;
        qry_2 += ` `+req.body.fk_direccion+`, `;

        qry_1 += ` fk_bodega, `;
        qry_2 += ` `+req.body.fk_bodega+`, `;

        qry_1 += ` volumen, `;
        qry_2 += ` `+req.body.volumen+`, `;

        qry_1 += ` peso, `;
        qry_2 += ` `+req.body.peso+`, `;

        qry_1 += ` bultos, `;
        qry_2 += ` `+req.body.bultos+`, `;

        qry_1 += ` "devImpuesto" `;
        qry_2 += ` '`+req.body.devimpuesto+`' `;

        try {

              await client.query(`INSERT INTO public.gc_propuestas_proveedores (`+qry_1+`) values (`+qry_2+`)`);

              let UltimoId = await client.query(`SELECT id from public.gc_propuestas_proveedores where fk_responsable=`+req.usuario.id+` order by id desc limit 1`);

              qry_1 = ` fecha_creacion, `;
              qry_2 = ` '`+fecha+`', `;

              qry_1 += ` fecha_recepcion, `;
              qry_2 += ` null, `;

              qry_1 += ` fk_propuesta, `;
              qry_2 += ` null, `;

              qry_1 += ` cantidad_bultos, `;
              qry_2 += ` `+req.body.bultos+`, `;

              qry_1 += ` peso, `;
              qry_2 += ` `+req.body.peso+`, `;

              qry_1 += ` volumen, `;
              qry_2 += ` `+req.body.volumen+`, `;

              qry_1 += ` tipo_carga, `;
              qry_2 += ` 1, `;

              qry_1 += ` fk_proveedor, `;
              qry_2 += ` `+req.body.fk_proveedor+`, `;

              qry_1 += ` fk_cliente, `;
              qry_2 += ` `+req.body.fk_cliente+`, `;

              qry_1 += ` tipo, `;
              qry_2 += ` 2, `;

              qry_1 += ` estado, `;
              qry_2 += ` 0, `;

              qry_1 += ` foto1, `;
              qry_2 += ` null, `;

              qry_1 += ` foto2, `;
              qry_2 += ` null, `;

              qry_1 += ` foto3, `;
              qry_2 += ` null, `;

              qry_1 += ` fk_proveedor_cliente `;
              qry_2 += ` `+UltimoId.rows[0]['id']+` `;

              await client.query(` INSERT INTO tracking (`+qry_1+`) VALUES (`+qry_2+`) `);

              let Proveedores = await client.query(`
                SELECT
                prov.id
                , prov.estado
                , prov.fk_responsable
                , TO_CHAR(prov."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
                , prov.fk_cliente
                , prov.fk_proveedor
                , prove.nombre
                , prov.volumen
                , prov.bultos
                , peso
                FROM public.gc_propuestas_proveedores as prov
                INNER JOIN public.proveedores as prove on prov.fk_proveedor=prove.id
                WHERE
                prov.estado=0
                and prov.fk_cliente=`+req.body.fk_cliente+` order by prov.id desc`);

              res.status(200).send(Proveedores.rows);
              res.end(); res.connection.destroy();

        } catch (error) {
          console.log('ERROR PostProvCliente');
          console.log('ERROR PostProvCliente');
          console.log(error);
          console.log('ERROR PostProvCliente');
          console.log('ERROR PostProvCliente');
            res.status(400).send({
                message: "ERROR AL GUARDAR INFORMACIÓN "+error,
                success:false,
            }); res.end(); res.connection.destroy();

        }

    }
} catch (error) { res.status(400).send({ message: "ERROR GENERAR AL GUARDAR SERVICIO ADICIONAL "+error, success:false, }); res.end(); res.connection.destroy(); }}
/************************************************************/
/************************************************************/
exports.GetListProvCliente = async (req, res) => {
    try {

        let Lista = await client.query(`
        SELECT
        tabla_1.id
        , TO_CHAR(tabla_1."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
        , tabla_1.fk_cliente
        , tabla_1.fk_proveedor
        , tabla_1.fk_bodega
        , bod.nombre as bodeganombre
        , prov.nombre as proveedornombre
        , tabla_1.volumen
        , tabla_1.bultos
        , tabla_1.peso
        , coalesce(tabla_1."devImpuesto",'NO') as devImpuesto
        , coalesce(trk.fk_consolidado_tracking::text,'') as consolidado
        , dir.nombre as direccion
        FROM public.gc_propuestas_proveedores as tabla_1
        inner join public.proveedores as prov on tabla_1.fk_proveedor=prov.id
        inner join public.bodegas as bod on bod.id=tabla_1.fk_bodega
        inner join public.clientes_direcciones as dir on tabla_1.fk_direccion=dir.id
        left join public.tracking as trk on trk.fk_proveedor_cliente=tabla_1.id
        where tabla_1.estado!=999 and tabla_1.fk_cliente=`+parseInt(req.params.id)+` order by tabla_1.id desc`);
        res.status(200).send(Lista.rows);
        res.end(); res.connection.destroy();

    } catch (error) {
      console.log('ERROR GetListProvCliente');
      console.log('ERROR GetListProvCliente');
      console.log(error);
      console.log('ERROR GetListProvCliente');
      console.log('ERROR GetListProvCliente');
        res.status(400).send({
            message: "ERROR AL CARGAR PROVEEDOR CLIENTES "+error,
            success:false,
        });
        res.end(); res.connection.destroy();
    }

};
/************************************************************/
/************************************************************/
exports.DeleteProveedor = async (req, res) => {
    try {

        await client.query(`DELETE from proveedores where id=`+parseInt(req.params.id));
        res.status(200).send([]);
        res.end(); res.connection.destroy();

    } catch (error) {
        console.log('ERROR DeleteProveedor '+error); console.log(' '); console.log(' ');
        res.status(400).send({
            message: "EL REGISTRO NO SE PUEDE ELIMINAR, POR QUE TIENE INFORMACIÓN RELACIONADA",
            success:false,
        }); res.end(); res.connection.destroy();
    }
};
/************************************************************/
/************************************************************/
exports.DeleteProveedorPropuesta = async (req, res) => {
    try {
        let ExisteCabecera = await client.query(`
        SELECT
        id
        FROM public.tracking as cabe
        WHERE
        (
          cabe.estado>0 and cabe.fk_proveedor_cliente=`+req.body.id+`
        )
        or (cabe.fk_proveedor_cliente=`+req.body.id+` and (SELECT count(id) FROM public.tracking_detalle WHERE tracking_id=cabe.id) >0 )
        `);

        if(ExisteCabecera.rows.length>0) {
          res.status(400).send({
              message: "EL REGISTRO NO SE PUEDE ELIMINAR, POR QUE TIENE INFORMACIÓN DE TRACKING RELACIONADA",
              success:false
          }); res.end(); res.connection.destroy();
        } else {

          await client.query(`UPDATE public.tracking SET estado=-2 where fk_proveedor_cliente=`+req.body.id+` `);

          await client.query(`UPDATE public.gc_propuestas_proveedores SET estado=999 where id=`+parseInt(req.body.id));
          res.status(200).send([]);
          res.end(); res.connection.destroy();

        }

    } catch (error) {
      console.log('ERROR DeleteProveedorPropuesta');
      console.log('ERROR DeleteProveedorPropuesta');
      console.log(error);
      console.log('ERROR DeleteProveedorPropuesta');
      console.log('ERROR DeleteProveedorPropuesta');
        res.status(400).send({
            message: "EL REGISTRO NO SE PUEDE ELIMINAR, POR QUE TIENE INFORMACIÓN RELACIONADA ",
            success:false,
        });
        res.end(); res.connection.destroy();
    }

};
/************************************************************/
/************************************************************/
exports.GetProveedorPropuesta = async (req, res) => {
    try {

        let Lista = await client.query(`
        SELECT
        tabla_1.id
        , TO_CHAR(tabla_1."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
        , tabla_1.fk_cliente
        , tabla_1.fk_proveedor
        , tabla_1.fk_bodega
        , tabla_1.fk_direccion

        , CASE WHEN tabla_1.volumen::TEXT LIKE '%.%' THEN
        CONCAT(REPLACE(Split_part(TO_CHAR(tabla_1.volumen,'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(tabla_1.volumen,'FM999,999,999.99')::text,'.',2))
        ELSE tabla_1.volumen::TEXT END as volumen

        , CASE WHEN tabla_1.bultos::TEXT LIKE '%.%' THEN
        CONCAT(REPLACE(Split_part(TO_CHAR(tabla_1.bultos,'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(tabla_1.bultos,'FM999,999,999.99')::text,'.',2))
        ELSE tabla_1.bultos::TEXT END as bultos

        , CASE WHEN tabla_1.peso::TEXT LIKE '%.%' THEN
        CONCAT(REPLACE(Split_part(TO_CHAR(tabla_1.peso,'FM999,999,999,999.99')::text,'.',1),',','.'),',',Split_part(TO_CHAR(tabla_1.peso,'FM999,999,999.99')::text,'.',2))
        ELSE tabla_1.peso::TEXT END as peso

        , coalesce(tabla_1."devImpuesto",'NO') as devImpuesto
        FROM public.gc_propuestas_proveedores as tabla_1
        where tabla_1.id=`+parseInt(req.params.id));

        res.status(200).send(Lista.rows);
        res.end(); res.connection.destroy();

    } catch (error) {
      console.log('ERROR GetProveedorPropuesta');
      console.log('ERROR GetProveedorPropuesta');
      console.log(error);
      console.log('ERROR GetProveedorPropuesta');
      console.log('ERROR GetProveedorPropuesta');
        res.status(400).send({
            message: "ERROR AL CARGAR PROVEEDOR CLIENTES "+error,
            success:false,
        });
        res.end(); res.connection.destroy();
    }

};
/************************************************************/
/************************************************************/
exports.PutProvCliente = async (req, res) => { try {

    var moment = require('moment'); let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    let token= req.get('Authorization'); jwt.verify(token, process.env.SECRET, (err,decoded)=>{ if(err){ return res.status(401).json({ success:false, err }) } req.usuario = decoded.usuario; });

    if (!req.body.id || req.body.id==0) {
        res.status(400).send({
            message: "NO SE DETECTO UN ID A ACTUALIZAR",
            success:false
        }); res.end(); res.connection.destroy();
        return;
    }
    else if (!req.body.fk_cliente || req.body.fk_cliente==0) {
        res.status(400).send({
            message: "EL CLIENTE ES OBLIGATORIO",
            success:false
        }); res.end(); res.connection.destroy();
        return;
    }
    else if (!req.body.fk_direccion || req.body.fk_direccion==0) {
        res.status(400).send({
            message: "LA DIRECCIÓN ES OBLIGATORIA",
            success:false
        }); res.end(); res.connection.destroy();
        return;
    }
    else if (!req.body.fk_bodega || req.body.fk_bodega==0) {
        res.status(400).send({
            message: "LA BODEGA ES OBLIGATORIA",
            success:false
        }); res.end(); res.connection.destroy();
        return;
    }
    else if (!req.body.fk_proveedor || req.body.fk_proveedor==0) {
        res.status(400).send({
            message: "EL PROVEEDOR ES OBLIGATORIO",
            success:false
        }); res.end(); res.connection.destroy();
        return;
    }
    else if (!req.body.peso ) {
        res.status(400).send({
            message: "EL PESO ES OBLIGATORIO",
            success:false
        }); res.end(); res.connection.destroy();
        return;
    }
    else if (!req.body.bultos ) {
        res.status(400).send({
            message: "LOS BULTOS SON OBLIGATORIOS",
            success:false
        }); res.end(); res.connection.destroy();
        return;
    }
    else if (!req.body.volumen ) {
        res.status(400).send({
            message: "EL VOLUMEN ES OBLIGATORIO",
            success:false
        }); res.end(); res.connection.destroy();
        return;
    }
    else
    {
        let ExisteCabecera = await client.query(`
        SELECT
        cabe.estado
        , count(deta.id) as cantidad
        FROM public.tracking as cabe
        left join public.tracking_detalle as deta on deta.tracking_id=cabe.id
        WHERE
        cabe.fk_proveedor_cliente=`+req.body.id+`
        group by cabe.estado
        `);

        function formatear_numero(Numero)
        {
            Numero = Numero.toString().replace(/\./g,'');
            Numero = Numero.toString().replace(/\,/g,'.');
            return Numero;
        }

        if(!req.body.volumen || req.body.volumen.length==0)
        { req.body.volumen = 0; } else {
            req.body.volumen = formatear_numero(req.body.volumen);
        }

        if(!req.body.peso || req.body.peso.length==0)
        { req.body.peso = 0; } else {
            req.body.peso = formatear_numero(req.body.peso);
        }

        if(!req.body.bultos || req.body.bultos.length==0)
        { req.body.bultos = 0; } else {
            req.body.bultos = formatear_numero(req.body.bultos);
        }

        let qry_1 = '';

        qry_1 = ` estado=0, `;

        qry_1 += ` fk_responsable=`+req.usuario.id+`, `;

        qry_1 += ` "fechaActualizacion"='`+fecha+`', `;

        qry_1 += ` fk_bodega=`+req.body.fk_bodega+`, `;

        qry_1 += ` fk_direccion=`+req.body.fk_direccion+`, `;

        qry_1 += ` volumen=`+req.body.volumen+`, `;

        qry_1 += ` peso=`+req.body.peso+`, `;

        qry_1 += ` bultos=`+req.body.bultos+` `;

          try {

              await client.query(`UPDATE public.gc_propuestas_proveedores SET `+qry_1+` WHERE id=`+req.body.id );
              console.log('CONTADOR');
              console.log(ExisteCabecera.rows[0].cantidad);
              console.log('BULTOS');
              console.log(req.body.bultos);
              if(parseInt(req.body.bultos)>parseInt(ExisteCabecera.rows[0].cantidad) )
              {
                qry_1 = ` estado=0, `;
              }
              else {
                qry_1 = ` estado=1, `;
              }

              qry_1 += ` cantidad_bultos=`+req.body.bultos+`, `;

              qry_1 += ` peso=`+req.body.peso+`, `;

              qry_1 += ` volumen=`+req.body.volumen+` `;

              console.log('CAMBIANDO ESTATO TRACKING');

              console.log(` UPDATE tracking SET `+qry_1+` WHERE fk_proveedor_cliente=`+req.body.id);

              await client.query(` UPDATE tracking SET `+qry_1+` WHERE fk_proveedor_cliente=`+req.body.id );

              res.status(200).send([]);
              res.end(); res.connection.destroy();

          } catch (error) {
            console.log('ERROR PutProvCliente');
            console.log('ERROR PutProvCliente');
            console.log(error);
            console.log('ERROR PutProvCliente');
            console.log('ERROR PutProvCliente');
              res.status(400).send({
                  message: "ERROR AL ACTUALIZAR INFORMACIÓN "+error,
                  success:false,
              }); res.end(); res.connection.destroy();

          }

    }
} catch (error) {   console.log('ERROR PutProvCliente');
  console.log('ERROR PutProvCliente');
  console.log(error);
  console.log('ERROR PutProvCliente');
  console.log('ERROR PutProvCliente'); res.status(400).send({ message: "ERROR GENERAL AL ACTUALIZAR INFORMACION", success:false, }); res.end(); res.connection.destroy(); }}
/************************************************************/
/************************************************************/
exports.GetInfoQr = (req, res) => {

    client.query(`
      SELECT
      CLI.id
      , CLI."razonSocial"
      , CLI.rut
      , '' as direccion
      , CLI.telefono1
      , CLI.codigo
      , CONCAT(dir.nombre,', ',dir.direccion,' ',dir.numero,', ',comunas.nombre) as direccion
      , prove.fk_bodega
      FROM public.gc_propuestas_proveedores as prove
      inner join public.clientes as cli on prove.fk_cliente=cli.id
      inner join public.clientes_direcciones as dir on prove.fk_direccion=dir.id
      inner join direcciones_tipos as dir_tipo on dir_tipo.id=dir.fk_tipo
      inner join pais on pais.id=dir.fk_pais
      inner join region on region.id=dir.fk_region
      inner join comunas on comunas.id=dir.fk_comuna
      where
      prove.id=$1`, [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
};
/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/
  exports.findList = async (req, res) => { try {

    let Listado = await client.query(`
    SELECT
    *
    FROM public.proveedores WHERE fk_cliente=`+req.params.id+`
    ORDER BY id DESC
    `);

    res.status(200).send(Listado.rows);

  } catch (error) { res.status(400).send({ message: "ERROR AL CARGAR LISTADO DE PROVEEDORES "+error, success:false, }); res.end(); res.connection.destroy(); } }

  exports.list = (req, res) => {
    client.query('SELECT * FROM public.proveedores', "", function (err, result) {
        if (err) {
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
    client.query('SELECT * FROM public.proveedores where id = $1', [req.params.id], function (err, result) {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    };

    exports.delete = (req,res) =>{
        if (!req.params.id) {
            res.status(400).send({
                message: "EL ID ES OBLIGATORIO",
                success:false
              });
              return;
        }
        client.query('DELETE FROM public.proveedores where id = $1', [req.params.id], function (err, result) {
            if (err) {
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "EL PROVEEDOR FUE ELIMINADO CORRECTAMENTE",
                success:true
              });
        });
        };
/************************************************************/
/************************************************************/
exports.GetBodegas = async (req, res) => {
    try {

        let Lista = await client.query(` SELECT * FROM public.bodegas where fk_empresa=1 and estado=true order by nombre asc`);
        res.status(200).send(Lista.rows);
        res.end(); res.connection.destroy();

    } catch (error) {
        console.log(' ======= GETBODEGAA '+error+'\n\n');
        res.status(400).send({ message: "ERROR AL CARGAR BODEGAS "+error, success:false, });
        res.end(); res.connection.destroy();
    }

};
/************************************************************/
/************************************************************/
exports.GetDirecciones = async (req, res) => {
  try {
      let Lista = await client.query(`
      SELECT
      dir.id
      , CONCAT(dir.nombre,', ',dir.direccion,' ',dir.numero,', ',comunas.nombre) as direccion
      FROM public.clientes_direcciones as dir
      inner join direcciones_tipos as dir_tipo on dir_tipo.id=dir.fk_tipo
      inner join pais on pais.id=dir.fk_pais
      inner join region on region.id=dir.fk_region
      inner join comunas on comunas.id=dir.fk_comuna
      where dir.fk_cliente=`+parseInt(req.params.id)+` order by id desc`);
      res.status(200).send(Lista.rows);
      res.end(); res.connection.destroy();

  } catch (error) {
    console.log('ERROR GetDirecciones '+error); console.log(' '); console.log(' ');
      res.status(400).send({
          message: "ERROR AL CARGAR DIRECCIONES "+error,
          success:false,
      });
      res.end(); res.connection.destroy();
  }

};
/************************************************************/
/************************************************************/

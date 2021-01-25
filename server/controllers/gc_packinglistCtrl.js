const client = require('../config/db.client');

exports.findOneBy = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "EL ID ES OBLIGATORIO",
            success:false
          });
          return;
    }
    client.query('SELECT * FROM public.gc_packinglist where pack_id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
};

exports.create = (req, res) => {
    var moment = require('moment');

    /*
    let token= req.get('Authorization');
    jwt.verify(token, process.env.SECRET, (err,decoded)=>{
    if(err){
        return res.status(401).json({
            success:false,
            err
        })
    }
    req.usuario = decoded.usuario;
    });
    */
   
    if (!req.body.pack_fk_proveedor || req.body.pack_fk_proveedor==0) {
        res.status(400).send({
            message: "EL PROVEEDOR ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.pack_fk_contacto || req.body.pack_fk_contacto==0) {
        res.status(400).send({
            message: "EL CONTACTO BASE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.pack_hsCode || req.body.pack_hsCode==0) {
        res.status(400).send({
            message: "EL HS CODE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.pack_descripcion || req.body.pack_descripcion==0) {
        res.status(400).send({
            message: "LA DESCRIPCIÓN ES OBLIGATORIA",
            success:false
        });
        return;
    }else if (!req.body.pack_unidad || req.body.pack_unidad==0) {
        res.status(400).send({
            message: "LA UNIDAD ES OBLIGATORIA",
            success:false
        });
        return;
    }else if (!req.body.pack_bultos || req.body.pack_bultos==0) {
        res.status(400).send({
            message: "LOS BULTOS SON OBLIGATORIOS",
            success:false
        });
        return;
    }else if (!req.body.pack_unidadBulto || req.body.pack_unidadBulto==0) {
        res.status(400).send({
            message: "LAS UNIDADES/BULTOS SON OBLIGATORIAS",
            success:false
        });
        return;
    }else if (!req.body.pack_precioUnitario || req.body.pack_precioUnitario==0) {
        res.status(400).send({
            message: "EL PRECIO UNITARIO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.pack_cmbBulto || req.body.pack_cmbBulto==0) {
        res.status(400).send({
            message: "EL CMB/BULTO ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.pack_pesoBulto || req.body.pack_pesoBulto==0) {
        res.status(400).send({
            message: "EL PESO/BULTO ES OBLIGATORIO",
            success:false
        });
        return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const query = {
        text: `INSERT INTO public.gc_packinglist(
            pack_ano,
            pack_mes,
            pack_dia,
            pack_fk_proveedor,
            pack_fk_contacto,
            "pack_hsCode",
            pack_descripcion,
            pack_unidad,
            pack_bultos,
            "pack_unidadBulto",
            "pack_precioUnitario",
            "pack_cmbBulto",
            "pack_pesoBulto",
            pack_estado,
            "fechaCreacion",
            "fechaActualizacion"
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
        values: [
            req.body.pack_ano, 
            req.body.pack_mes,
            req.body.pack_dia,
            req.body.pack_fk_proveedor,
            req.body.pack_fk_contacto,
            req.body.pack_hsCode,
            req.body.pack_descripcion,
            req.body.pack_unidad,
            req.body.pack_bultos,
            req.body.pack_unidadBulto,
            req.body.pack_precioUnitario,
            req.body.pack_cmbBulto,
            req.body.pack_pesoBulto,
            0,
            fecha,
            fecha
        ],
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

exports.Aprobar = async (req, res) => {
    var moment = require('moment');

    console.log(" LLEGA "+JSON.stringify(req.body));
    if (!req.body.fk_proveedor || req.body.fk_proveedor==0) {
        res.status(400).send({
            message: "EL PROVEEDOR ES OBLIGATORIO",
            success:false
        });
        return;
    }
    else if (!req.body.fk_contacto || req.body.fk_contacto==0) {
        res.status(400).send({
            message: "EL CONTACTO BASE ES OBLIGATORIO",
            success:false
        });
        return;
    }

    let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    var cli_info = await client.query(`SELECT 
    *
    FROM public.gc_clientes as CLI
    WHERE 
    CLI.fk_contacto=`+req.body.fk_contacto+`
    `);

    var prov_info = await client.query(`SELECT 
    PROVE.*
    FROM public.proveedores as PROVE
    WHERE PROVE.id=`+req.body.fk_proveedor+`
    `);

    if(cli_info.rows.length<=0)
    {
        res.status(400).send({
            message: "NO SE DETECTO CLIENTE",
            success:false
        });
        return;
    }
    else if(prov_info.rows.length<=0)
    {
        res.status(400).send({
            message: "NO SE DETECTO PROVEEDOR",
            success:false
        });
        return;
    }    
    else
    {
        
        await client.query(` UPDATE public.gc_packinglist SET "fechaActualizacion"='`+fecha+`', pack_estado=2 WHERE pack_fk_proveedor=`+req.body.id+` and pack_fk_contacto=`+req.body.fk_contacto);

        await client.query(` UPDATE public.gc_proveedores SET "fechaActualizacion"='`+fecha+`', estado=2 WHERE id=`+req.body.id);

        var tot_qry = await client.query(`SELECT 
        *
        FROM public.gc_packinglist as PCKL
        WHERE 
        PCKL.pack_estado=2 
        AND PCKL.pack_fk_proveedor=`+req.body.id+` 
        AND PCKL.pack_fk_contacto=`+req.body.fk_contacto+` 
        ORDER BY PCKL.pack_id asc
        `);

        if(tot_qry.rows.length>0)
        {

            await client.query(` 
            INSERT INTO tracking 
            (fecha_creacion, fecha_recepcion, cantidad_bultos, peso, volumen, tipo_carga, fk_proveedor, fk_cliente, tipo, estado, foto1, foto2, foto3) VALUES
            ('`+fecha+`', null, 0, 0, 0, 1, `+prov_info.rows[0]['id']+`, `+cli_info.rows[0]['fk_cliente']+`, 2, 0, null, null, null)
            `);

            var id_tracking = await client.query(`SELECT id FROM public.tracking WHERE fk_proveedor=`+prov_info.rows[0]['id']+` AND fk_cliente=`+cli_info.rows[0]['fk_cliente']+` AND tipo=2 AND estado=0 order by id desc limit 1`);

            for(var i=0; i<tot_qry.rows.length; i++)
            {
                await client.query(` 
                INSERT INTO tracking_detalle 
                (fecha_recepcion, fecha_consolidado, codigo_interno, tipo_producto, producto, peso, volumen, observacion, tracking_id, estado, foto1, foto2, foto3) VALUES
                (null, null, null, null, '`+tot_qry.rows[i]['pack_descripcion']+`', `+tot_qry.rows[i]['pack_pesoBulto']+`, `+tot_qry.rows[i]['pack_cmbBulto']+`, null, `+id_tracking.rows[0]['id']+`, 0, null, null, null)
                `);
            }
        }
        else
        {
            res.status(400).send({
                message: "NO EXISTE DETALLE EN EL PACKING LIST",
                success:false
            });
            return;
        }
    }
    

    res.status(200).send(tot_qry.rows[0]);
}

exports.list = (req, res) => {

    client.query(`
        Select
        TO_CHAR(PLIST."fechaCreacion", 'DD-MM-YYYY HH24:MI') as creacion
        , TO_CHAR(PLIST."fechaActualizacion", 'DD-MM-YYYY HH24:MI') as actualizacion
        , PLIST.pack_id
        , PLIST.pack_ano
        , PLIST.pack_mes
        , PLIST.pack_dia
        , PROV.nombre as proveedor_nombre
        , PLIST.pack_fk_proveedor
        , PLIST.pack_fk_contacto
        , PLIST."pack_hsCode"
        , PLIST.pack_descripcion
        , PLIST.pack_unidad
        , PLIST.pack_bultos
        , PLIST."pack_unidadBulto"
        , PLIST."pack_precioUnitario"
        , PLIST."pack_cmbBulto"
        , PLIST."pack_pesoBulto"
        , PLIST.pack_estado
        , CLI.id as cli_id
        , CLI.codigo as cli_codigo
        , CLI.nombre as cli_nombre
        
        FROM public.gc_packinglist as PLIST
        inner join public.gc_proveedores as GCPRO on PLIST.pack_fk_proveedor=GCPRO.id
        inner join public.proveedores as PROV on GCPRO.fk_proveedor=PROV.id
        inner join public.gc_clientes as GCLI on PLIST.pack_fk_contacto=GCLI.fk_contacto
        inner join public.clientes as CLI on GCLI.fk_cliente=CLI.id
        
        where 
        PLIST.pack_estado=0 and PLIST.pack_fk_proveedor=$1 and PLIST.pack_fk_contacto=$2
        order by PLIST.pack_id asc
      `, [ req.body.pack_fk_proveedor, req.body.pack_fk_contacto ], function (err, result) {
      if (err) {
          console.log(err);
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
        client.query('DELETE FROM public.gc_packinglist where pack_id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "LINEA ELIMINADA CORRECTAMENTE",
                success:true
            });
        });
    };

    exports.update = (req, res) => {
        var moment = require('moment');
        // Validate request
        if (!req.body.pack_fk_proveedor || req.body.pack_fk_proveedor==0) {
            res.status(400).send({
                message: "EL PROVEEDOR ES OBLIGATORIO",
                success:false
            });
            return;
        }else if (!req.body.pack_fk_contacto || req.body.pack_fk_contacto==0) {
            res.status(400).send({
                message: "EL CONTACTO BASE ES OBLIGATORIO",
                success:false
            });
            return;
        }else if (!req.body.pack_hsCode || req.body.pack_hsCode==0) {
            res.status(400).send({
                message: "EL HS CODE ES OBLIGATORIO",
                success:false
            });
            return;
        }else if (!req.body.pack_descripcion || req.body.pack_descripcion==0) {
            res.status(400).send({
                message: "LA DESCRIPCIÓN ES OBLIGATORIA",
                success:false
            });
            return;
        }else if (!req.body.pack_unidad || req.body.pack_unidad==0) {
            res.status(400).send({
                message: "LA UNIDAD ES OBLIGATORIA",
                success:false
            });
            return;
        }else if (!req.body.pack_bultos || req.body.pack_bultos==0) {
            res.status(400).send({
                message: "LOS BULTOS SON OBLIGATORIOS",
                success:false
            });
            return;
        }else if (!req.body.pack_unidadBulto || req.body.pack_unidadBulto==0) {
            res.status(400).send({
                message: "LAS UNIDADES/BULTOS SON OBLIGATORIAS",
                success:false
            });
            return;
        }else if (!req.body.pack_precioUnitario || req.body.pack_precioUnitario==0) {
            res.status(400).send({
                message: "EL PRECIO UNITARIO ES OBLIGATORIO",
                success:false
            });
            return;
        }else if (!req.body.pack_cmbBulto || req.body.pack_cmbBulto==0) {
            res.status(400).send({
                message: "EL CMB/BULTO ES OBLIGATORIO",
                success:false
            });
            return;
        }else if (!req.body.pack_pesoBulto || req.body.pack_pesoBulto==0) {
            res.status(400).send({
                message: "EL PESO/BULTO ES OBLIGATORIO",
                success:false
            });
            return;
        }
    
        let fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

        const query = {
            text: `UPDATE public.gc_packinglist SET 
            "pack_hsCode"=$1,
            pack_descripcion=$2,
            pack_unidad=$3,
            pack_bultos=$4,
            "pack_unidadBulto"=$5,
            "pack_precioUnitario"=$6,
            "pack_cmbBulto"=$7,
            "pack_pesoBulto"=$8,
            "fechaActualizacion"=$9
            where pack_id=$10 RETURNING *`,
            values: [
            req.body.pack_hsCode,
            req.body.pack_descripcion,
            req.body.pack_unidad,
            req.body.pack_bultos,
            req.body.pack_unidadBulto,
            req.body.pack_precioUnitario,
            req.body.pack_cmbBulto,
            req.body.pack_pesoBulto,
            fecha,
            req.body.pack_id,
            ],
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

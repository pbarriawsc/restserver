const client = require('../config/db.client');

/************************************************************/
/************************************************************/
exports.Post = async (req,res) =>{ try {

    function LimpiarTexto (texto) { if(!texto) { return ''; } else { return texto.trim(); } }

    if (!req.params.id || req.params.id.trim().length==0) {
      res.status(400).send({
      message: "LA FECHA ES OBLIGATORIA",
      success:false
      }); res.end(); res.connection.destroy();
    }
    else
    {

        var Reporte = await client.query(` 
        SELECT 
        concat(cli.id,' ',cli.codigo) as id_dwi
        , cli.id as id_ws
        , coalesce(cli.codigo,'') as nombre_corto
        , coalesce(cli.rut,'') as rut
        , coalesce(cli."razonSocial",'') as cliente
        , coalesce((
        SELECT
        concat(temp1.direccion,' ',temp1.numero)
        from public.clientes_direcciones as temp1 
        where temp1.fk_cliente=cli.id and temp1.fk_tipo=1 order by temp1.id desc limit 1),'') as direccion
        , coalesce((
        SELECT
        temp2.nombre
        from public.clientes_direcciones as temp1 
        inner join public.comunas as temp2 on temp1.fk_comuna=temp2.id
        where temp1.fk_cliente=cli.id and temp1.fk_tipo=1 order by temp1.id desc limit 1),'') as comuna
        , coalesce((
        SELECT
        temp2.nombre
        from public.clientes_direcciones as temp1 
        inner join public.region as temp2 on temp1.fk_region=temp2.id
        where temp1.fk_cliente=cli.id and temp1.fk_tipo=1 order by temp1.id desc limit 1),'') as region
        , coalesce((
        SELECT
        coalesce(temp1.nombre,'')
        from public.clientes_contactos as temp1 
        where temp1.fk_cliente=cli.id and temp1.fk_tipo=4 and temp1.estado is true order by temp1.id desc limit 1),'') as rep_nombres
        , coalesce((
        SELECT
        coalesce(temp1.apellido,'')
        from public.clientes_contactos as temp1 
        where temp1.fk_cliente=cli.id and temp1.fk_tipo=4 and temp1.estado is true order by temp1.id desc limit 1),'') as rep_apellidos
        , coalesce((
        SELECT
        coalesce(temp1.rut,'')
        from public.clientes_contactos as temp1 
        where temp1.fk_cliente=cli.id and temp1.fk_tipo=4 and temp1.estado is true order by temp1.id desc limit 1),'') as rep_rut
        , coalesce((
        SELECT
        coalesce(temp1.email,'')
        from public.clientes_contactos as temp1 
        where temp1.fk_cliente=cli.id and temp1.fk_tipo=4 and temp1.estado is true order by temp1.id desc limit 1),'') as rep_email
        , coalesce(cli.giro,'') as giro
        , coalesce(comer.nombre,'') as comercial
        , TO_CHAR(cli."fechaCreacion", 'DD/MM/YYYY') as fecha_creacion
        , coalesce((
        SELECT
        CASE WHEN 
        temp2.cedula_1 is not null and LENGTH(temp2.cedula_1)>0
        and temp2.cedula_1_type is not null and LENGTH(temp2.cedula_1_type)>0
        and temp2.cedula_1_ext is not null and LENGTH(temp2.cedula_1_ext)>0
        then 'VERDADERO' else 'VERDADERO' end	
        from public.clientes_contactos as temp1 
        inner join public.clientes_contactos_archivos as temp2 on temp1.id=temp2.fk_contacto
        where temp1.fk_cliente=cli.id and temp1.fk_tipo=4 and temp1.estado is true order by temp1.id desc limit 1),'') as rep_ci
        , coalesce((
        SELECT
        CASE WHEN 
        temp2.podersimple_1 is not null and LENGTH(temp2.podersimple_1)>0
        and temp2.podersimple_1_type is not null and LENGTH(temp2.podersimple_1_type)>0
        and temp2.podersimple_1_ext is not null and LENGTH(temp2.podersimple_1_ext)>0
        then 'VERDADERO' else 'VERDADERO' end	
        from public.clientes_contactos as temp1 
        inner join public.clientes_contactos_archivos as temp2 on temp1.id=temp2.fk_contacto
        where temp1.fk_cliente=cli.id and temp1.fk_tipo=4 and temp1.estado is true order by temp1.id desc limit 1),'') as rep_poder
        FROM 
        public.clientes as cli
        left join public.usuario as comer on cli.fk_comercial=comer.id
        WHERE 
        TO_CHAR(cli."fechaCreacion", 'DDMMYYYY')='`+req.params.id+`' 
        `);

        var xl = require('excel4node');
        
        var wb = new xl.Workbook();
        
        var hoja_1 = wb.addWorksheet('Stock_Dwi');
        
        var ajustar_texto = wb.createStyle({
            alignment: { 
                shrinkToFit: true,
                wrapText: true
            },
        });
        
        hoja_1.column(1).setWidth(12);
        hoja_1.column(2).setWidth(30);
        hoja_1.column(3).setWidth(15);
        hoja_1.column(4).setWidth(15);
        hoja_1.column(5).setWidth(40);
        hoja_1.column(6).setWidth(20);
        hoja_1.column(7).setWidth(10);
        hoja_1.column(8).setWidth(15);
        hoja_1.column(9).setWidth(15);
        hoja_1.column(10).setWidth(15);
        hoja_1.column(11).setWidth(15);
        hoja_1.column(12).setWidth(15);
        hoja_1.column(13).setWidth(15);
        hoja_1.column(14).setWidth(15);
        hoja_1.column(15).setWidth(15);
        hoja_1.column(16).setWidth(15);
        hoja_1.column(17).setWidth(15);
        hoja_1.column(18).setWidth(15);
        hoja_1.column(19).setWidth(15);
        hoja_1.column(20).setWidth(15);
        hoja_1.column(21).setWidth(15);
        hoja_1.column(22).setWidth(15);
        hoja_1.column(23).setWidth(15);
        hoja_1.column(24).setWidth(15);
        hoja_1.column(25).setWidth(15);

        var celda_izquierda = wb.createStyle({
            border: {
                left: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
                outline: false,
            },
        });

        var celda_medio = wb.createStyle({
            border: {
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
                outline: false,
            },
            
        });            

        var celda_derecha = wb.createStyle({
            border: {
                right: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
                outline: false,
            },
        });

        var estilo_titulo = wb.createStyle({
        font: {
            color: '#000000',
            size: 20,
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var estilo_cabecera = wb.createStyle({
        font: {
            color: '#000000',
            size: 15,
        },
        fill: {
            type: "pattern",
            patternType: "solid",
            bgColor: "#F0F1F2",
            fgColor: "#F0F1F2"
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var estilo_contenido_texto = wb.createStyle({
        font: {
            color: '#000000',
            size: 12,
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
        });        
        
        try {

            hoja_1.cell(1, 1, 1, 10, true)
            .string('REPORTE CLIENTES')
            .style(estilo_titulo);

            hoja_1.cell(2, 1, 2, 10, true)
            .string('')
            .style(estilo_titulo);
            
            hoja_1.cell(3, 1).string('ID DWI').style(estilo_cabecera).style(celda_izquierda);
            hoja_1.cell(3, 2).string('ID WS').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 3).string('NOMBRE CORTO').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 4).string('RUT').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 5).string('CLIENTE').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 6).string('DIRECCION').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 7).string('COMUNA').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 8).string('CODCOMUNA').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 9).string('CIUDAD').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 10).string('REP NOMBRES').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 11).string('2do# NOM#REP#LEG# IMPO#').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 12).string('REP APELLIDO').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 13).string('APELLIDO MATERNO').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 14).string('REP RUT').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 15).string('REP EMAIL').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 16).string('GIRO').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 17).string('CONTACTO NOMBRE').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 18).string('CONTACTO MAIL').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 19).string('CONTACTO TELEFONO').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 20).string('CONTACTO DIRECCION').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 21).string('TIPO CLIENTE').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 22).string('COMERCIAL').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 23).string('FECHA CREACION').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 24).string('REP CI').style(estilo_cabecera).style(celda_medio);
            hoja_1.cell(3, 25).string('REP PODER').style(estilo_cabecera).style(celda_derecha);

            var row = 3;
            for(var i=0; i<Reporte.rows.length; i++)
            {
                row++;
                hoja_1.cell(row, 1).string(Reporte.rows[i]['id_dwi']).style(estilo_contenido_texto).style(celda_izquierda);
                hoja_1.cell(row, 2).string(''+Reporte.rows[i]['id_ws']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 3).string(Reporte.rows[i]['nombre_corto']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 4).string(Reporte.rows[i]['rut']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 5).string(Reporte.rows[i]['cliente']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 6).string(Reporte.rows[i]['direccion']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 7).string(Reporte.rows[i]['comuna']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 8).string(Reporte.rows[i]['region']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 9).string('').style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 10).string(Reporte.rows[i]['rep_nombres']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 11).string('').style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 12).string(Reporte.rows[i]['rep_apellidos']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 13).string('').style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 14).string(Reporte.rows[i]['rep_rut']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 15).string(Reporte.rows[i]['rep_email']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 16).string(Reporte.rows[i]['giro']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 17).string('').style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 18).string('').style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 19).string('').style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 20).string('').style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 21).string('WS Cargo').style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 22).string(Reporte.rows[i]['comercial']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 23).string(Reporte.rows[i]['fecha_creacion']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 24).string(Reporte.rows[i]['rep_ci']).style(estilo_contenido_texto).style(celda_medio);
                hoja_1.cell(row, 25).string(Reporte.rows[i]['rep_poder']).style(estilo_contenido_texto).style(celda_derecha);
            }
        
        } catch (error) {
            res.send(" 0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0- error hoja 1 "+error);
        }            

        wb.write('Reporte_Clientes.xlsx', res);
    }

} catch (error) {
    console.log("ERROR "+error);
    res.status(400).send({
    message: "ERROR AL CARGAR CLIENTE ",
    success:false, }); res.end(); res.connection.destroy();
} };
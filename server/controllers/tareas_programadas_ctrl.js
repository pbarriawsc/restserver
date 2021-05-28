const enviarEmail = require('../../handlers/email');
const client = require('../config/db.client');
const moment=require('moment');

exports.envio_notificacion_tarifas = async (req, res) => {
    var nodeSchedule=require('node-schedule');
    nodeSchedule.scheduleJob('*/1 * * * *', () => {
        funcion_enviar_correo_tarifa()
    });

    async function funcion_enviar_correo_tarifa(){
        console.log('tarea programada - job');

        clienteCorreo=await client.query("SELECT cc.id,CONCAT(cc.nombre,' ',cc.apellido) as nombre,cc.email FROM public.clientes_contactos cc WHERE cc.email IS NOT NULL and cc.email!='' and cc.email!='-' AND NOT EXISTS (SELECT *FROM public.email_nueva_tarifa ent WHERE ent.fk_cliente_contacto = cc.id) ORDER BY cc.id ASC LIMIT 1"); 
        
        if(clienteCorreo && clienteCorreo.rows && clienteCorreo.rows.length>0){
            let email=clienteCorreo.rows[0].email.toLowerCase();
            const query={
                text:'INSERT INTO public.email_nueva_tarifa(fk_cliente_contacto,email,fecha_envio) VALUES ($1,$2,$3) RETURNING *',
                values:[clienteCorreo.rows[0].id,email,moment().format('YYYYMMDD HHmmss')]
            };
            let result=await client.query(query);
            if(result && result.rows && result.rows.length>0){
                enviarEmail.mail_notificacion_tarifa({ 
                    asunto:"nueva tarifa",fecha:"28-05-2021",email:'pbarria.reyes@gmail.com',nombre:clienteCorreo.rows[0].nombre
                 });
            }   
        }
        
        /*
        enviarEmail.mail_notificacion_tarifa({ 
           asunto:"nueva tarifa",fecha:"28-05-2021",email:'pbarria.reyes@gmail.com'
        });*/
    }        
};
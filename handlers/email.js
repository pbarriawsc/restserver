const nodemailer = require('nodemailer');
const juice = require('juice');
const htmltoText = require('html-to-text');
const util = require('util');
const pug = require('pug');

let transport_WSC = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: '587',
    auth: { user: 'wsc-qiao@wscargo.cl', pass: 'Nuf39861'},
    secureConnection: false,
    tls: { ciphers: 'SSLv3' }
});


/**********************************************/
/**********************************************/
/**********************************************/

const view_mail_nuevo_usuario = (opciones) => {
    const html = pug.renderFile('./views/emails/view_mail_nuevo_usuario.pug', opciones);
    return juice(html);
}

exports.mail_nuevo_usuario = async(opciones) => {
    const html = view_mail_nuevo_usuario(opciones);
    const text = htmltoText.fromString(html);
    
    let opcionesEmail = {
        from: 'wsc-qiao@wscargo.cl',
        to: opciones.email,
        cc: 'eduardo.vidal@wscargo.cl',
        subject: opciones.asunto,
        text,
        html
    };

    var estado = await transport_WSC.sendMail(opcionesEmail).then(function(info){
        console.log(" ENVIO CORREO NUEVO USUARIO OK ");
        return true;
    }).catch(function(err){
        console.log(" ENVIO CORREO NUEVO USUARIO ERROR "+err);
        return false;
    });
    return estado;
}
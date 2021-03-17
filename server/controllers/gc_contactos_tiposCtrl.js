const client = require('../config/db.client');
exports.PostContactosTipos = (req, res) => {
    // Validate request
    if (!req.body.nombre) {
        res.status(400).send({
        message: "EL NOMBRE ES OBLIGATORIO",
        success:false
        });
        return;
    }

    const query = {
        text: 'INSERT INTO public.gc_contactos_tipos(nombre) VALUES($1) RETURNING *',
        values: [req.body.nombre],
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

exports.PutContactosTipos = (req, res) => {
    // Validate request
    if (!req.body.nombre){
        res.status(400).send({
            message: "EL NOMBRE ES OBLIGATORIO",
            success:false
        });
        return;
    }

    const query = {
        text: 'UPDATE public.gc_contactos_tipos SET nombre=$1 where id=$2 RETURNING *',
        values: [req.body.nombre, req.body.id],
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

    exports.GetContactosTipos = (req, res) => {
    client.query('SELECT * FROM public.gc_contactos_tipos', "", function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    };

    exports.GetContactoTipo = (req,res) =>{
    if (!req.params.id) {
        res.status(400).send({
            message: "EL ID ES OBLIGATORIO",
            success:false
        });
        return;
    }
    client.query('SELECT * FROM public.gc_contactos_tipos where id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    };

    exports.DeleteContactoTipo = (req,res) =>{
        if (!req.params.id) {
            res.status(400).send({
                message: "EL ID ES OBLIGATORIO",
                success:false
            });
            return;
        }
        client.query('DELETE FROM public.gc_contactos_tipos where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "EL TIPO DE CONTACTO FUE ELIMINADO CORRECTAMENTE",
                success:true
            });
        });
        };

const client = require('../config/db.client');
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nombre) {
      res.status(400).send({
        message: "EL NOMBRE ES OBLIGATORIO",
        success:false
      });
      return;
    }else if (!req.body.permiso){
        res.status(400).send({
            message: "EL PERMISO ES OBLIGATORIO",
            success:false
          });
          return;
    }else if (!req.body.menuPadre){
        res.status(400).send({
            message: "EL MENU PADRE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.url){
        res.status(400).send({
            message: "LA URL ES OBLIGATORIA",
            success:false
        });
        return;
    }    

    const query = {
        text: 'INSERT INTO public.menu(nombre, permiso, "menuPadre", url) VALUES($1, $2, $3, $4) RETURNING *',
        values: [req.body.nombre, req.body.permiso, req.body.menuPadre, req.body.url],
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

exports.update = (req, res) => {
    // Validate request
    if (!req.body.nombre) {
      res.status(400).send({
        message: "EL NOMBRE ES OBLIGATORIO",
        success:false
      });
      return;
    }else if (!req.body.permiso){
        res.status(400).send({
            message: "EL PERMISO ES OBLIGATORIO",
            success:false
          });
          return;
    }else if (!req.body.menuPadre){
        res.status(400).send({
            message: "EL MENU PADRE ES OBLIGATORIO",
            success:false
        });
        return;
    }else if (!req.body.url){
        res.status(400).send({
            message: "LA URL ES OBLIGATORIA",
            success:false
        });
        return;
    }    

    const query = {
        text: 'UPDATE public.menu SET nombre=$1, permiso=$2, "menuPadre"=$3, url=$4 where id=$5 RETURNING *',
        values: [req.body.nombre, req.body.permiso, req.body.menuPadre, req.body.url, req.body.id],
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
    client.query('SELECT * FROM public.menu', "", function (err, result) {
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
    client.query('SELECT * FROM public.menu where id = $1', [req.params.id], function (err, result) {
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
        client.query('DELETE FROM public.menu where id = $1', [req.params.id], function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send({
                message: "EL MENU FUE ELIMINADO CORRECTAMENTE",
                success:true
              });
        });
        };
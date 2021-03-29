const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const familiasArancelariasCtrl=require('../controllers/familiasArancelariasProductosCtrl');
const FAMARA_GetList='/api/familiasarancelarias_get_list';
const FAMARA_Post='/api/familiasarancelarias_post';
const FAMARA_Delete='/api/familiasarancelarias_delete';
const FAMARA_Get='/api/familiasarancelarias_get';
const FAMARA_Put='/api/familiasarancelarias_put';

app.get(`${FAMARA_GetList}`,verifyToken,familiasArancelariasCtrl.GetList);
app.get(`${FAMARA_Delete}/:id`,verifyToken,familiasArancelariasCtrl.Delete);
app.get(`${FAMARA_Get}/:id`,verifyToken,familiasArancelariasCtrl.Get);
app.post(`${FAMARA_Post}`,verifyToken,familiasArancelariasCtrl.Post);
app.post(`${FAMARA_Put}`,verifyToken,familiasArancelariasCtrl.Put);

module.exports=app;

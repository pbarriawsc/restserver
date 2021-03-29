const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const subFamiliasArancelariasProductosCtrl=require('../controllers/subFamiliasArancelariasProductosCtrl');
const SFAMARA_GetList='/api/subfamiliasarancelarias_get_list';
const SFAMARA_Post='/api/subfamiliasarancelarias_post';
const SFAMARA_Delete='/api/subfamiliasarancelarias_delete';
const SFAMARA_Get='/api/subfamiliasarancelarias_get';
const SFAMARA_Put='/api/subfamiliasarancelarias_put';

app.get(`${SFAMARA_GetList}`,verifyToken,subFamiliasArancelariasProductosCtrl.GetList);
app.get(`${SFAMARA_Delete}/:id`,verifyToken,subFamiliasArancelariasProductosCtrl.Delete);
app.get(`${SFAMARA_Get}/:id`,verifyToken,subFamiliasArancelariasProductosCtrl.Get);
app.post(`${SFAMARA_Post}`,verifyToken,subFamiliasArancelariasProductosCtrl.Post);
app.post(`${SFAMARA_Put}`,verifyToken,subFamiliasArancelariasProductosCtrl.Put);

module.exports=app;

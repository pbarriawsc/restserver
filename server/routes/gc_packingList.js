const express = require('express')
const app = express()
const {verifyToken} = require('../middlewares/authotization');
const prefix='/api/gc_packinglist';
const prefixPost='/api/gc_packinglist_post';
const prefixAprobar='/api/gc_packinglist_aprobar';

const gc_packingListCtrl=require('../controllers/gc_packingListCtrl');

app.post(`${prefix}`,verifyToken, gc_packingListCtrl.list);

app.get(`${prefix}/:id`,verifyToken, gc_packingListCtrl.findOneBy)

app.post(`${prefixPost}`,verifyToken, gc_packingListCtrl.create)

app.post(`${prefixAprobar}`,verifyToken, gc_packingListCtrl.Aprobar)

app.put(`${prefix}`,verifyToken, gc_packingListCtrl.update)

app.delete(`${prefix}/:id`,verifyToken, gc_packingListCtrl.delete)

module.exports=app;

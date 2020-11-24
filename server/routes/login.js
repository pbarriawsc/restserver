const express = require('express')
const app = express()
const bcrypt= require('bcrypt');

app.post('/token',(req,res)=>{
    let body=req.body;
    res.json({success:true})
})
module.exports=app;
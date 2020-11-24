let verifyToken = (req,res,next)=>{
    let token= req.get('Authorization');
    console.log(token);
    next();
}

module.exports={verifyToken};
import jwt from 'jsonwebtoken'
import env from '../config/env.js';

function authMiddleware(req,res,next){
    const token=req.headers.authorization?.split(' ')[1];

    if(!token)return res.status(401).json({message:'No token'});

    try {
        const decoded=jwt.verify(token,env.accessTokenSecret);
        req.userId=decoded.userId;
        next();
    } catch (error) {
        res.status(403).json({message:'Invalid token'})
    }
}
export default authMiddleware;
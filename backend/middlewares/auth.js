import jwt, { decode } from "jsonwebtoken";
import redisClient from "../services/redis.js";


export const authMiddleware=async(req ,res , next)=>{
try{
const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

//console.log(token);
if(!token){
    return res.status(401).send({error:'unauthoried user'});
}

const isBlackListed = await redisClient.get(token);
if (isBlackListed) {

    res.cookie('token', '');

    return res.status(401).send({ error: 'Unauthorized User' });
}

const decoded=jwt.verify(token,process.env.JWT_SECRET);
req.user=decoded;//by this we stored decoded in user in request
next();
}
catch(error){
  return res.status(401).send({error:'unauthorized user'});
}
}
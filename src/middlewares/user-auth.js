const jwt           = require("jsonwebtoken");
const HTTPError     = require("../helpers/custom-error");
const asyncHandler  = require("express-async-handler");

async function authUser (req,res,next){
    let token = req.headers["authorization"] ?? req.headers["Authorization"];

    if(!token || !token.startsWith("Bearer ")){
        throw new HTTPError(401,"Bearer token is required.");
    }

    token = token.split(" ")[1];

    const decodedData = jwt.verify(token, process.env.JWT_SECRET,
        (err,decoded) =>{
            if (err ) throw new HTTPError(403, "Invalid or expired token");
            else return decoded
        }
    );

    req.userid = decodedData.id;
    next();
}   

module.exports =  asyncHandler(authUser);
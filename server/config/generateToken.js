const jwt = require('jsonwebtoken');


//generate token and send
const generateToken = (id) =>{
    //sign a new token with unique id
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: "30d",
    });
}



module.exports = generateToken;
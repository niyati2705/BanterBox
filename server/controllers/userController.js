const  {createError}  = require ("../utils/error.js");
const User = require("../models/userModel");
const generateToken  = require('../config/generateToken');
const bcrypt = require('bcryptjs');


//register user
const registerUser = async (req,res,next) =>{

    const{name, email, password, pic} = req.body;
    //check if the user already exists
    if(!name || !email  || !password)
    return res.status(409).json({message:"Missing fields"}) 
    // return next(createError("Missing fields",400));

    // }
    // console.log(user);
    //create user
    const userExists = await User.findOne({email});
    
    //   if (userExists) {
    //     res.status(400);
    //     throw new Error("User already exists");
    //   }
        if (userExists){
            return res.status(409).json({message:"User already exists"})
        }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    // if(!user)
    // return next(createError(404, "User not found"));

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            //send token after successful registration
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("User not found");
      }

  
}

//login user

const authUser = async (req,res,next) =>{
    const{email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

    //check password
     const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordCorrect) 
    return next(createError(400, 'Invalid Password or username'));

    // if(user && (await User.matchPassword(password))){
    //   if(user && isPasswordCorrect){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            //send token after successful registration
            token: generateToken(user._id),
         })
    // }else{
    //     return next(createError(400, 'Invalid Password or username'));
    // }
}

// /api/users?search=niyati
const allUsers = async (req,res) =>{
    //to take query from api
    const keyword = req.query.search
     ? {
    //    $or : [ //searching inside name or email, case insensitive
    //     { name: { $regex: req.query.search, $options: "i"}},
    //    {email: { $regex: req.query.search, $options: "i"}},
    //    ],

    // the $or operator is removed from the keyword object, so the User.find method will query the database for all users, regardless of the search criteria.
    }:{};
    console.log(req);
    // console.log(keyword);
    //query the database,
    //find from serach except the user logged in, check user
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    console.log(users);
    res.send(users);
}

module.exports={registerUser, authUser, allUsers};
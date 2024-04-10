const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const userModel = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePic : { type: String, 
                    
                default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
             },
}, {
    timestamps: true,
})


//brcypt  middleware to hash the password before saving it in db
userModel.pre('save', async function (next) {
    // let user = this; //this is the document that we are going to save
    if (!this.isModified) next();
        // ('password')) return next(); //if there is no change in the password then just go on with other

    const salt = await bcrypt.genSalt(10); //generate a salt with a strength of 10
    this.password = await bcrypt.hash(this.password, salt); //use the salt to generate a new encrypted password
})

const User =  mongoose.model("User", userModel);
module.exports= User;
const mongoose = require("mongoose");

const AccessToken = new mongoose.Schema(
    {
        userid: { 
            type:String, 
            required:true,
            unique:true
        },
        token: { type:String},
    }
);

//print a friendly message when unique constraint rule is overpassed instead of default code E001 by mongodb

module.exports = mongoose.model("AccessToken",AccessToken);
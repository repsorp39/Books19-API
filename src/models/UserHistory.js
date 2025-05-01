const mongoose = require("mongoose");

//track user historics
const UserHistorySchema = new mongoose.Schema(
    {
       userid: { type:String, required:true },
       bookmarked: { type:[String], default:[]},
       starred: { type:[String], default:[]},
       downloaded: { type:[String], default:[]},
       history:[
        {
            bookid:String,
            pageRead:{type:Number,default:0}
        }
       ]
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("UserHistory",UserHistorySchema)
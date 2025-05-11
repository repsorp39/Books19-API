const mongoose = require("mongoose");

//track user historics
const UserHistorySchema = new mongoose.Schema(
    {
       userid: { type:String, required:true ,ref:"User"},
       bookmarked: { type:[String], default:[],ref:"Book"},
       starred: { type:[String], default:[], ref:"Book"},
       downloaded: { type:[String], default:[]},
       readBooks:[
        {
            bookid:{ type:String,ref:"Book"},
            currentPage:{type:Number,default:0}
        }
       ]
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("UserHistory",UserHistorySchema)
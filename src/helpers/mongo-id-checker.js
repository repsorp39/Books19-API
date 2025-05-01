const mongoose = require("mongoose");
const HTTPError = require("../helpers/custom-error");
/**
 * check if the id is really an instance of the mongodb ObjectId
 * @param {uuid} bookid 
 */
function assertItIsAMongoId (bookid){
    if(!mongoose.Types.ObjectId.isValid(bookid)){
        throw new HTTPError(400,"Please provide a valid book identifier");
    }
}

module.exports = assertItIsAMongoId;

const { format }   = require("date-fns");
const fsPromises = require("fs/promises");
const path = require("path");

module.exports = async function logEvents(err){
    const date =  format(new Date() , 'yyyy-MM-dd hh:mm:ss');
    const msg  = `${date} \t ${err.name} \t\ ${err.message}\n\n`

    await fsPromises.appendFile(
        path.join(__dirname,"..","logs","logs.txt"),
        msg
    );
}   
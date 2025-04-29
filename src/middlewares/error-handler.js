const HTTPError = require("../helpers/custom-error");
const { sendAPIErrorMessageByEmail } = require("../utils/email-sender");
const logEvents = require("../utils/log-event");

async function errorHandler(err,req,res,next){
    const isInProductionMode = process.env.NODE_ENV === 'production';
    const status = err.status ?? 500;
    const message = isInProductionMode ? "Something broke. Please try later." : err.message;

    if(isInProductionMode) {
        if(status === 500){
            logEvents(err);
            sendAPIErrorMessageByEmail(req.url,err.name,err.message)
            .then(()=>{});
        }
    }
    else console.error(err);
        
    res.status(status).json ({ message });
}

async function notFoundHandler(req,res,next){
    throw new HTTPError(404,"Route does not exist.");
}

module.exports = {
    errorHandler,
    notFoundHandler
};
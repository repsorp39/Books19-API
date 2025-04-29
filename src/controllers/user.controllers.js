const User                   = require("../models/User");
const bcrypt                 = require("bcrypt");
const asyncHandler           = require("express-async-handler");
const { userSchema }         = require("../helpers/schema-validator");
const HTTPError              = require("../helpers/custom-error");
const jwt                    = require("jsonwebtoken");
const checkGoogleToken       = require("../helpers/google-auth-info");

const { 
    sendWelcomeMessage, 
    sendResetPasswordEmail 
} = require("../utils/email-sender");

const Register = asyncHandler(async (req,res,next) => {
    const { error,value:userInfo } = userSchema.validate(req.body ?? {},{abortEarly:false});//abort early to show all validations errors at the same time

    //invalid data
    if(error) throw new HTTPError(400, error.message);

    userInfo.password = await bcrypt.hash(userInfo.password, 10);//hashing password
    
    try {
        await User.create(userInfo);
        res.status(201).json( {
            message:'User has been successfully registered'
        });
        sendWelcomeMessage(userInfo.email, userInfo.fullname)
        .then(()=>{});
    } catch (error) {
        if(error.name === "ValidationError")
            throw new HTTPError(409, `Email '${userInfo.email}' already exists.`)
    }
});


const Login = asyncHandler(async (req,res,next)=>{
    const { email, password } = req.body;

    if(!email || !password) {
        throw new HTTPError(400,"Email and password are required.");
    }

    const foundUser = await User.findOne({ email });
    if(!foundUser) {
        throw new HTTPError(400,"Email or password incorrect");
    }

    const passwordMatch = await bcrypt.compare(password,foundUser.password);
    if(!passwordMatch){
        throw new HTTPError(400,"Email or password incorrect");
    }

    //creating token
    const token = jwt.sign(
        {id:foundUser._id},
        process.env.JWT_SECRET,
        { expiresIn:"72h"}
    );
    
    res.status(200).json({ token });
});


const AuthWithGoogle = asyncHandler(async (req,res,next)=>{
    const { isValid, user } = await checkGoogleToken(req.body?.token ?? "");

    if(!isValid){
        throw new HTTPError(400,"Invalid google token");
    }

    let foundUser = await User.findOne({ email:user.email });

    if(!foundUser){
        foundUser = await User.create(user);
        sendWelcomeMessage(user.email, user.fullname)
        .then(()=>{});
    }

    //creating token
    const token = jwt.sign(
        {id:foundUser._id},
        process.env.JWT_SECRET,
        { expiresIn:"72h"}
    );
    
    res.status(200).json({ token });
});


const EditPassword = asyncHandler(async (req,res,next)=>{
    const userid = req.userid;
    const { currentPassword,newPassword } = req.body;

    if(!currentPassword || !newPassword){
        throw new HTTPError(400, "Current password and new password are required!");
    }

   if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/.test(newPassword)){
        throw new HTTPError(400, "Password too weak. 8 chars min, with upper,lower and number");
   }

   const user = await User.findById(userid);
   
   const passwordMatch = await bcrypt.compare(currentPassword,user.password);
   if(!passwordMatch){
        throw new HTTPError(403, "Password incorrect");
   }

   const password = await bcrypt.hash(newPassword,10);
   await User.findByIdAndUpdate(userid,{ password });
   res.status(200).json({ message:"Successfully updated!"});
});


const GetUserInfo = asyncHandler(async (req,res,next)=>{
    const userInfo = await User.findById(req.userid);
    res.status(200).json(userInfo);
});

const HandleResetEmailPassword = asyncHandler(async(req,res,next)=>{
    const { email } = req.body;

    if(!email){
        throw new HTTPError(400, "Email is required!");
    }

    const user = await User.findOne({ email });
    if(!user){
        throw new HTTPError(404, "No user found!");
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, { expiresIn:"10m"});
    const resetLink = `${
        req.headers.origin ?? "http://localhost:3500"
    }/reset-password?token=${token}&email=${email}`;

    sendResetPasswordEmail(email,resetLink)
    .then(()=>{})
    
    res.status(200).json({ message:"Reset email sent!"});

});

const ResetPassword = asyncHandler(async (req,res,next)=>{
    const { newPassword,email,token } = req.body;

    if(!email || !token || !newPassword){
        throw new HTTPError(400, "Email,token and new password are required!");
    }

    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/.test(newPassword)){
        throw new HTTPError(400, "Password too weak. 8 chars min, with upper,lower and number");
    }

    //retrieving data in token
    const userid = jwt.verify(token,process.env.JWT_SECRET,
        (err,decoded)=>{
           if(err) throw new HTTPError(400,"Invalid or expired token") ;
           else return decoded.id;
    });

    //get the user matching with the id receive in the token
    const user = await User.findById(userid);

    //check if the email sent by the frontend match with the email provided by the token
    if(user.email != email){
        throw new HTTPError(403, "Token email and sent email do not match!");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.save();

    res.status(200).json({ message:"Password reset successfully!"});
});

module.exports = { 
    Register,
    Login,
    GetUserInfo,
    AuthWithGoogle,
    EditPassword,
    HandleResetEmailPassword,
    ResetPassword
};
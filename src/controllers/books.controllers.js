const Book               = require("../models/Book");
const asyncHandler       = require("express-async-handler");
const HTTPError          = require("../helpers/custom-error");
const Category           = require("../models/Category");
const Language           = require("../models/Language");
const UserHistory        = require("../models/UserHistory");
const assertItIsAMongoId = require("../helpers/mongo-id-checker");


const GetBooks = asyncHandler(async (req,res,next)=>{
    const MAX_BOOKS_BY_REQUEST = 6;
    const page = Number(req.query.page) || 1;
    const books = await Book.find()
        .skip((page - 1) * MAX_BOOKS_BY_REQUEST) //skip function don't return the first n number give in params
        .limit(MAX_BOOKS_BY_REQUEST);

    res.status(200).json({
        page,
        books
    });
});


const GetSingleBook = asyncHandler( async (req,res,next) =>{
    const { bookid } = req.params;
    assertItIsAMongoId(bookid);
    const foundBook = await Book.findById(bookid);
    if(!foundBook){
        throw new HTTPError(404,`A book with the id '${bookid}' do not exist.`);
    }
    res.status(200).json(foundBook);
});


const GetCategories = asyncHandler(async (req,res,next) =>{
    const categories = await Category.find();
    res.status(200).json({ categories }); 
});


const GetLanguages = asyncHandler(async (req,res,next) =>{
    const languages = await Language.find();
    res.status(200).json({ languages }); 
});


const GetBookByLanguage = asyncHandler(async (req,res,next) =>{
    const { lang } = req.params;
    const books = await Book.find({ languages: { $regex: new RegExp(`^${lang}$`,'i')}});//using regex to avoid upper/lower case issues
    return res.status(200).json({ books });
});


const GetBookByCategory = asyncHandler(async (req,res,next) =>{
    const { category } = req.params;
    const books = await Book.find({ categories: { $regex: new RegExp(`^${category}$`,'i')}});//using regex to avoid upper/lower case issues
    return res.status(200).json({ books });
});


//This controller allow user to set a book as starred, downloaded or bookmarked
const ManageUserBookPreference = asyncHandler(async (req,res,next) =>{
    const { bookid,action } = req.params;
    assertItIsAMongoId(bookid);
    const previousHistory = await UserHistory.findOne({ userid: req.userid });

    //when user do not have history we must create it.
    if(!previousHistory){
        const history = {
            userid:req.userid,
            [action]: [bookid], //action is downloaded,starred or bookmarked which in an array of bookid matching with the action
        };
        await UserHistory.create(history);
    }
    //when they do, we have to make an update
    else{
        //we are updating the field downloaded,starred or bookmarked
        //as it is an array,we have just to push the value of th bookid to set the book as bookmarked,...
        previousHistory[action].push(bookid);
        previousHistory[action] = Array.from(new Set(previousHistory[action]));//to avoid duplicate value
        previousHistory.save();
    }

    res.status(200).json({message: `Book '${bookid}' has been ${action}`})
});


//track user while reading the book in pdf and updating the state
const UpdateReadingProgress = asyncHandler(async(req,res,next) =>{
    const { bookid } = req.body;
    const pageRead = Number(req.body.pageRead) || 1;
    assertItIsAMongoId(bookid);

    const previousHistory = await UserHistory.findOne({ userid: req.userid });
    if(!previousHistory){
        await UserHistory.create(
            {
                userid:req.userid,
                history:[ { bookid, pageRead } ]
            }  );  
    }else{
        let isBookInReading = false;
        previousHistory.history = previousHistory.history.map((e) =>{
            if(e.bookid === bookid) {
                isBookInReading = true;
                e.pageRead = pageRead;
            }
            return e;
        });

         if(!isBookInReading){
              previousHistory.history.push({bookid,pageRead});
         }

         previousHistory.save();
    }
    res.status(200).json({ message: "Reading progress tracked!"});
});

module.exports = {
    GetBooks,
    GetSingleBook,
    GetCategories,
    GetLanguages,
    GetBookByLanguage,
    GetBookByCategory,
    ManageUserBookPreference,
    UpdateReadingProgress
};

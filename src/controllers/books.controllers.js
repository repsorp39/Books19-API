const Book               = require("../models/Book");
const asyncHandler       = require("express-async-handler");
const HTTPError          = require("../helpers/custom-error");
const Category           = require("../models/Category");
const Language           = require("../models/Language");
const UserHistory        = require("../models/UserHistory");
const assertItIsAMongoId = require("../helpers/mongo-id-checker");


const GetBooks = asyncHandler(
    async (req,res,next)=>{
        const MAX_BOOKS_BY_REQUEST = 6;
        const page = Number(req.query.page) || 1;
        const totalPage = Math.ceil((await Book.countDocuments({})) / MAX_BOOKS_BY_REQUEST)  ;
        
        const books = await Book.find()
            .skip((page - 1) * MAX_BOOKS_BY_REQUEST) //skip function don't return the first n number occurence give in params
            .limit(MAX_BOOKS_BY_REQUEST);

        res.status(200).json({
            totalPage,
            page,
            books
        });
    }
);


const GetSingleBook = asyncHandler(
    async (req,res,next) =>{
        const { bookid } = req.params;
        assertItIsAMongoId(bookid);
        const foundBook = await Book.findById(bookid);
        if(!foundBook){
            throw new HTTPError(404,`A book with the id '${bookid}' do not exist.`);
        }
        res.status(200).json(foundBook);
    }
);


const GetCategories = asyncHandler(
    async (req,res,next) =>{
        const categories = await Category.find();
        res.status(200).json({ categories }); 
    }
);


const GetLanguages = asyncHandler(
    async (req,res,next) =>{
        const languages = await Language.find();
        res.status(200).json({ languages }); 
    }
);


const GetBookByLanguage = asyncHandler(
    async (req,res,next) =>{
        const { lang } = req.params;
        const books = await Book.find({ languages: { $regex: new RegExp(`^${lang}$`,'i')}});//using regex to avoid upper/lower case issues
        return res.status(200).json({ books });
    }
);


const GetBookByCategory = asyncHandler( 
    async(req,res,next) =>{
        const { category } = req.params;
        const books = await Book.find({ categories: { $regex: new RegExp(`^${category}$`,'i')}});//using regex to avoid upper/lower case issues
        return res.status(200).json({ books });
    }
);

const FilterBook = asyncHandler( 
    async (req,res,next) =>{
        const { category ,lang } = req.query;

        const rules = {};
        if(category) rules.categories = { $regex: new RegExp(`^${category}$`,'i')};
        if(lang) rules.languages = { $regex: new RegExp(`^${lang}$`,'i')};
        const books = await Book.find(rules);
        return res.status(200).json({ books });
});

//This controller allow user to set a book as starred, downloaded or bookmarked
const SetUserBookState = asyncHandler(
    async (req,res,next) =>{
        const { bookid,action } = req.params;
        const availableActions = ["starred","downloaded","bookmarked"];
        if(!availableActions.includes(action)){
            throw new HTTPError(400,`'${action}' is not a valid action`);
        }
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
            previousHistory[action] = Array.from(new Set(previousHistory[action]));//to avoid duplicate value in case the book was already bookmarked
            previousHistory.save();
        }

        res.status(200).json({message: `Book '${bookid}' has been ${action}`})
    }
);


const RemoveBookmarkOrStar = asyncHandler(
    async (req,res,next) =>{
        const { bookid,action } = req.params;
        const availableActions = ["starred","bookmarked"];
        if(!availableActions.includes(action)){
            throw new HTTPError(400,`'${action}' is not a valid action for this route`);
        }
        assertItIsAMongoId(bookid);
        const previousHistory = await UserHistory.findOne({ userid: req.userid });
        if(!previousHistory){
            return res.sendStatus(204);//no content
        };
        previousHistory[action] = previousHistory[action].filter((id) => id !== bookid);
        previousHistory.save();
        res.status(200).json({message: `Book '${bookid}' has been un${action}`})
    })
;


//track user while reading the book in pdf and updating the state
const UpdateReadingProgress = asyncHandler( 
    async(req,res,next) =>{
        const { bookid } = req.body;
        const currentPage = Number(req.body.currentPage) || 1;
        assertItIsAMongoId(bookid);

        const previousHistory = await UserHistory.findOne({ userid: req.userid });
        if(!previousHistory){
            await UserHistory.create(
                {
                    userid:req.userid,
                    readBooks:[ { bookid, currentPage } ]
                }  );  
        }else{
            let isBookInReading = false; 
            //we try to find the book to check if it was already in read
            //if yes we're gonna just update the current page
            previousHistory.readBooks = previousHistory.readBooks.map((e) =>{
                if(e.bookid === bookid) {
                    isBookInReading = true;
                    e.currentPage = currentPage;
                }
                return e;
            });
            //if not, we're gonna set it now
            if(!isBookInReading){
                previousHistory.readBooks.push({bookid,currentPage});
            }

            previousHistory.save();
        }
        res.status(200).json({ message: "Reading progress tracked!"});
    }
);

const GetDownloadedBook = asyncHandler(
    async (req,res,next) =>{
        const { downloaded } = await UserHistory.findOne({ userid:req.userid })
        .populate({
            path:'downloaded' //get info about all books in the downloaded path
            //model:'Book' it is no longer required because the downloaded field had already a ref property for Book
        }).select("downloaded -_id")
        res.status(200).json({downloaded});
    }
);

const GetBookmarkedBook = asyncHandler(
    async (req,res,next) =>{
        const { bookmarked } = await UserHistory.findOne({ userid:req.userid })
        .populate({
            path:'bookmarked'
        }).select("bookmarked -_id")
        res.status(200).json({bookmarked});
    }
);


const GetStarredBook = asyncHandler(
    async (req,res,next) =>{
        const { starred } = await UserHistory.findOne({ userid:req.userid })
        .populate({
            path:'starred'
        }).select("starred -_id")
        res.status(200).json({starred});
    }
);

//get all book user is actually reading or has started reading
const GetBookInReadingState = asyncHandler(
    async (req,res,next)=>{
        const {readBooks }= await UserHistory.findOne({ userid:req.userid})
            .populate({
                path:'readBooks.bookid'
            })
            .lean() //to transform it to a normal object removing all keys related to mongoose

        const transformBooks = readBooks.map((e) => ({ ...e.bookid, currentPage:e.currentPage}) );
        res.status(200).json(transformBooks);
    }
);


const GetIdsOfUsersBooks = asyncHandler(
    async (req,res,next) =>{
        const { 
            bookmarked, downloaded, starred
        } = await UserHistory.findOne({ userid:req.userid });
        res.status(200).json(
            {
                bookmarked,
                starred,
                downloaded
            }
        );
        }
);

module.exports = {
    GetBooks,
    GetSingleBook,
    GetCategories,
    GetLanguages,
    GetBookByLanguage,
    GetBookByCategory,
    RemoveBookmarkOrStar,
    SetUserBookState,
    UpdateReadingProgress,
    GetBookmarkedBook,
    GetStarredBook,
    GetDownloadedBook,
    GetIdsOfUsersBooks,
    GetBookInReadingState,
    FilterBook
};

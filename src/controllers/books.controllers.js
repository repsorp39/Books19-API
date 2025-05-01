const mongoose       = require("mongoose");
const Book           = require("../models/Book");
const asyncHandler   = require("express-async-handler");
const HTTPError      = require("../helpers/custom-error");
const Category       = require("../models/Category");
const Language       = require("../models/Language");

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
    
    if(!mongoose.Types.ObjectId.isValid(bookid)){
        throw new HTTPError(400,"Please provide a valid book identifier");
    }

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

module.exports = {
    GetBooks,
    GetSingleBook,
    GetCategories,
    GetLanguages
};

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    nbPages: {
      type: Number,
      required: true,
    },
    previewImg: {
      type: String,
      required: true,
    },
    languages: [String],
    categories: [String],
    yearOfRelease: {
      type: Number,
      required: true,
    },
    urlDownload: {
      type: String,
      required: true,
    },
    urlStream: {
      type: String,
      required: true,
    },
    synopsis: {
      type: String,
      required: true,
    },
    avgRating: Number,
    downladed: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    toJSON: {
      transform: (document, book) => {
        book.id = book._id;
        delete book._id;
      },
    },
  }
);

module.exports = mongoose.model('Book', BookSchema);

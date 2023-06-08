const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //returns the entire books object
  res.status(200).json({ books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //extract the ISBN from the route paramert
  const isbn = req.params.isbn;

  //find teh book with the matching ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (!book){
      return res.status(404).json({ message: 'Book not found.'});
  }
  //if book was found return it with status code
  return res.status(200).json({book: book});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  //get all keys from the books object
  const keys = Object.keys(books);

  //array to hold books by specified author
  let booksByAuthor = [];

  //Iterate through the 'books' object
  for (let i = 0 ; i < keys.length; i++){
      if (books[keys[i]].author === author){
          booksByAuthor.push(books[keys[i]]);
      }
  }

  //if no books were found
  if(booksByAuthor.length === 0){
      return res.status(404).json({message: 'No books found by this author.'});
  }

  return res.status(200).json({books: booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

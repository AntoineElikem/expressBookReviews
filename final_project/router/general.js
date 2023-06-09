const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    // Get the username and password from the request body
    const {username, password} = req.body;
    
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required."});
    }
    
    // Check if the user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(409).json({message: "Username already exists."});
    }
  
    // Create a new user and add them to the list of users
    const newUser = {username, password};  // in real-world scenario, password should be hashed
    users.push(newUser);
    
    return res.status(200).json({message: "User registered successfully."});
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
public_users.get('/title/:title', function (req, res) {
    // Extract the title from the route parameter
    const title = req.params.title;
  
    // Get all the keys for the 'books' object
    const keys = Object.keys(books);
  
    // Initialize an array to hold books with the specified title
    let booksByTitle = [];
  
    // Iterate through the 'books' object
    for (let i = 0; i < keys.length; i++) {
      // If the title of the current book matches the specified title, add the book to 'booksByTitle'
      if (books[keys[i]].title === title) {
        booksByTitle.push(books[keys[i]]);
      }
    }
  
    // If no books were found with the specified title, return a 404 status code and an error message
    if (booksByTitle.length === 0) {
      return res.status(404).json({ message: 'No books found with this title.' });
    }
  
    // If books were found with the specified title, return them with a 200 status code
    return res.status(200).json({ books: booksByTitle });
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

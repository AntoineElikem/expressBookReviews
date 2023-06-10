const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //Assuming that a valid username is not null, not undefined, and not an empty string.
  return username && typeof username === 'string' && username.trim() !== '';
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //Check if the username and password match with any of the registered users.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  //Check if the username and password are provided and are valid.
  if(isValid(username) && isValid(password)){
    if(authenticatedUser(username,password)){
      const token = jwt.sign({ username: username }, 'your-secret-key', { expiresIn: '1h' });
      return res.status(200).json({token: token});
    }
    else{
      return res.status(401).json({message: "Invalid username or password"});
    }
  }
  else{
    return res.status(400).json({message: "Username and password are required"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

// Extract the ISBN from the parameter
const isbn = req.params.isbn;

//Extract the review from the request query
const review = req.query.review;

//if no review was provided, return a 400 status code and error message
if(!review){
    return res.status(400).json({message: 'No review provided.'});
}

//get the username from the JWT payload
const username = req.user.username;

//Find the book with the specified ISBN
let book;
for (let key in books){
    if(books[key].isbn === isbn){
        book = books[key];
        break;
    }
}

// If no book was found with the specified ISBN, return a 404 status code and an error message
if(!book){
    return res.status(404).json({message:"No book with ISBN."})
}

//if the book was found, add or modify the review
book.reviews[username] = review;

// Return a 200 status code and a success message
return res.status(200).json({message: 'Review successfully added or modified.'});

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract the ISBN from the route parameter
    const isbn = req.params.isbn;

    // Get the username from the JWT payload
    const username = req.user.username;

    // Find the book with the specified ISBN
    let book;
    for(let key in books){
        if(books[key].isbn === isbn){
            book = books[key];
            break;
        }
    }

    // If no book was found with the specified ISBN, return a 404 status code and an error message
    if (!book) {
        return res.status(404).json({ message: 'No book found with this ISBN.' });
    }

    // If the user didn't post any review on this book, return an error message
    if (!book.reviews[username]) {
        return res.status(400).json({ message: 'You have not posted a review on this book.' });
    }

    // Delete the review
    delete book.reviews[username];

    // Return a 200 status code and a success message
    return res.status(200).json({ message: 'Review successfully deleted.' });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

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
  
    // Simulate delay using promise and setTimeout
    let myPromise = new Promise ((resolve,reject) => {
        setTimeout(()=>{
            resolve(books);
        },2000);
    });

    myPromise.then(booksData => {
        res.status(200).json({books: booksData});
    })
    .catch(error => {
        res.status(500).json({message: error.message});
    });

  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
  //extract the ISBN from the route paramert
  const isbn = req.params.isbn;

  //define a promise that find the book with the matching ISBN
  let myPromise = new Promise((resolve,reject) => {
      setTimeout(() => {
        const book = Object.values(books).find(book => book.isbn === isbn);

        if (!book){
            return res.status(404).json({ message: 'Book not found.'});
        }else {
            resolve(book);
        }
      }, 2000);
  });
  
myPromise.then(bookData => {
    res.status(200).json({book: bookData});
})
.catch(error => {
    res.status(500).json({message: error.message});
})
 
 
 });
  
 public_users.get('/author/:author',function (req, res) {
    // Extract the author from the route parameter
    const author = req.params.author;
  
    // Define a Promise that finds books by the specified author
    let myPromise = new Promise ((resolve, reject) => {
      setTimeout(() => {
        // Get all keys from the books object
        const keys = Object.keys(books);  
  
        // Array to hold books by specified author
        let booksByAuthor = [];
  
        // Iterate through the 'books' object
        for (let i = 0; i < keys.length; i++){
            if (books[keys[i]].author === author){
                booksByAuthor.push(books[keys[i]]);
            }
        }
  
        // If no books were found, reject the Promise
        if(booksByAuthor.length === 0){
            reject(new Error('No books found by this author.'));
        }
        // Otherwise, resolve the Promise with the found books
        else {
          resolve(booksByAuthor);
        }
      }, 2000);
    });
  
    // Use the Promise to send a response
    myPromise.then(booksData => {
      res.status(200).json({books: booksData});
    })
    .catch(error => {
      res.status(500).json({message: error.message});
    });
  });
  

  public_users.get('/title/:title', function (req, res) {
    // Extract the title from the route parameter
    const title = req.params.title;
  
    // Define a Promise that finds books by the specified title
    let myPromise = new Promise ((resolve, reject) => {
      setTimeout(() => {
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
    
        // If no books were found with the specified title, reject the Promise
        if (booksByTitle.length === 0) {
          reject(new Error('No books found with this title.'));
        }
    
        // If books were found with the specified title, resolve the Promise with the found books
        else {
          resolve(booksByTitle);
        }
      }, 2000);
    });
  
    // Use the Promise to send a response
    myPromise.then(booksData => {
      res.status(200).json({books: booksData});
    })
    .catch(error => {
      res.status(500).json({message: error.message});
    });
});

  

public_users.get('/review/:isbn', function (req, res) {
    // Extract the isbn from the route parameter
    const isbn = req.params.isbn;
  
    // Define a Promise that finds the book by the specified isbn and returns its reviews
    let myPromise = new Promise ((resolve, reject) => {
      setTimeout(() => {
        // Get all the keys for the 'books' object
        const keys = Object.keys(books);
    
        // Initialize a variable to hold the book with the specified isbn
        let bookByIsbn = null;
    
        // Iterate through the 'books' object
        for (let i = 0; i < keys.length; i++) {
          // If the isbn of the current book matches the specified isbn, set 'bookByIsbn' to the current book
          if (books[keys[i]].isbn === isbn) {
            bookByIsbn = books[keys[i]];
            break;
          }
        }
    
        // If no book was found with the specified isbn, reject the Promise
        if (!bookByIsbn) {
          reject(new Error('Book not found.'));
        }
    
        // If a book was found with the specified isbn, resolve the Promise with the book's reviews
        else {
          resolve(bookByIsbn.reviews);
        }
      }, 2000);
    });
  
    // Use the Promise to send a response
    myPromise.then(reviews => {
      res.status(200).json({reviews: reviews});
    })
    .catch(error => {
      res.status(500).json({message: error.message});
    });
});


module.exports.general = public_users;

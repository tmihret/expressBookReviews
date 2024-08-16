const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      // Simulate fetching books with a delay
      const getBooks = () => new Promise((resolve) => {
        setTimeout(() => resolve(books), 1000); // Simulate 1 second delay
      });
  
      const bookList = await getBooks();
  
      res.json(bookList);
    } catch (error) {
      res.status(500).json({ message: "Error fetching the book list" });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
  
      // Simulate an asynchronous operation, such as fetching from a database
      const getBookByIsbn = () => new Promise((resolve, reject) => {
        setTimeout(() => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject(new Error("Book not found"));
          }
        }, 1000); // Simulate 1 second delay
      });
  
      const book = await getBookByIsbn();
  
      res.status(200).json(book); // Send the book details as JSON
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
  
      // Simulate an asynchronous operation, such as fetching from a database
      const getBooksByAuthor = () => new Promise((resolve) => {
        setTimeout(() => {
          const matchingBooks = [];
          const bookKeys = Object.keys(books);
  
          bookKeys.forEach(key => {
            if (books[key].author === author) {
              matchingBooks.push(books[key]);
            }
          });
  
          resolve(matchingBooks);
        }, 1000); // Simulate 1 second delay
      });
  
      const booksByAuthor = await getBooksByAuthor();
  
      if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor); // Send the list of books as JSON
      } else {
        res.status(404).json({ message: "No books found for the given author." });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching the books." });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
  
      // Simulate an asynchronous operation, such as fetching from a database
      const getBooksByTitle = () => new Promise((resolve) => {
        setTimeout(() => {
          const matchingBooks = [];
          const bookKeys = Object.keys(books);
  
          bookKeys.forEach(key => {
            if (books[key].title === title) {
              matchingBooks.push(books[key]);
            }
          });
  
          resolve(matchingBooks);
        }, 1000); // Simulate 1 second delay
      });
  
      // Await the result of the simulated asynchronous operation
      const booksByTitle = await getBooksByTitle();
  
      if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle); // Send the matching books as JSON
      } else {
        res.status(404).json({ message: "No books found with the given title." });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching the books." });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn] && books[isbn].reviews)
  {
    res.send(books[isbn].reviews);
  }
  
});

module.exports.general = public_users;

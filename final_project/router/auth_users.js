const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
// Define the criteria for a valid username
    const minLength = 3;
    const maxLength = 16;

    // Check if the username length is within the required range
    if (username.length < minLength || username.length > maxLength) {
        return false;
    }

    // Check if the username contains only alphanumeric characters and underscores
    const validPattern = /^[a-zA-Z0-9_]+$/;

    // Test the username against the pattern
    if (!validPattern.test(username)) {
        return false;
    }

    // If all checks pass, return true
    return true;
}

const authenticatedUser = (username,password)=>{ 
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60  });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    const review = req.body.review; // Expecting a single review object or string

    if (review) {
      // If reviews property does not exist, initialize it
      if (!book.reviews) {
        book.reviews = []; // Initialize as an array if you want to store multiple reviews
      }

      // Check if reviews is an array; if not, convert it into an array
      if (Array.isArray(book.reviews)) {
        book.reviews.push(review); // Add the new review
      } else {
        book.reviews = [review]; // Create a new array with the review
      }

      books[isbn] = book;
      return res.status(200).json({ message: `Book review for ISBN ${isbn} updated.` });
    } else {
      return res.status(400).json({ message: "Review content is missing." });
    }
  } else {
    return res.status(404).json({ message: "Unable to find book with the given ISBN." });
  }
});

//Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    let book = books[isbn];
  
    if (book && book.reviews && book.reviews.length > 0) {
      // Assuming we delete the last review added (for simplicity)
      book.reviews.pop(); // Remove the last review from the array
  
      return res.status(200).json({ message: `Last review for book with ISBN ${isbn} deleted.` });
    } else {
      return res.status(404).json({ message: "Book not found or no reviews to delete." });
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

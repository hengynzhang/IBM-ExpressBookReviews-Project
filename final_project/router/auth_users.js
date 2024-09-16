const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    if (!username) {
        return false;
    }
    const duplicatedName = users.find(user => user.username === username);
    return !duplicatedName;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find( user => user.username === username && user.password === password);
    return Boolean(user);
}

//only registered users can login
regd_users.post('/login', (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username || ! password) {
    return res.status(400).json({message: 'Username and password required.'})
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
        {data: username},
        'access',
        {expiresIn: '1h'}
    )
    req.session.authorization = {accessToken, username};
    return res.status(200).json({message: 'User logged in successfully!'});
  } else {
    return res.status(401).json({message: 'Invalid username or password.'});
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const {isbn} = req.params;
  const {review} = req.query;
  const username = req.session.authorization.username;

    if (!isbn || !review) {
        return res.status(400).json({message: 'ISBN and review required.'})
    }

    if (!books[isbn]) {
        return res.status(404).json({message: 'Book not found.'})
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({message: 'Review added successfully!'});
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const {isbn} = req.params;
  const username = req.session.authorization.username;
    if (!isbn) {
        return res.status(400).json({message: 'ISBN required.'})
    }

    if (!books[isbn]) {
        return res.status(404).json({message: 'Book not found.'})
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: 'Review not found or not owned by user.' });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({message: 'Review deleted successfully!'});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

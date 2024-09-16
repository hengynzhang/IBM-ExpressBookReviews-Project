const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: 'Username and password required.'});
  }

  if (isValid(username)) {
    users.push({'username': username, 'password': password});
    return res.status(200).json({message: 'User registered successfully!'});
  } else {
    return res.status(400).json({message: 'Username already exists, please try another one.'});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const fetchedBooks = await new Promise((resolve, reject) => {
        setTimeout( () => {
            resolve(books)
        }, 6000)
       res.status(200).json(fetchedBooks);
    })
  } catch (err) {
        res.status(404).json({message: err.message})
  }
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  if (!isbn) {
    return res.status(400).json({message: 'ISBN required.'});
  }
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
        setTimeout( () => {
            resolve(book);
        }, 6000)
    } else {
        reject(new Error("Book not found."))
    }})
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({message: err.message}));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const {author} = req.params;
  if (!author) {
    return res.status(400).json({message: 'Author required.'});
  }
  new Promise((resolve, reject) => {
    const book = Object.values(books).filter(book => book.author === author);
    if (book.length > 0) {
      setTimeout( () => {
        resolve(book);
      }, 6000)
    } else {
      reject(new Error('Book not found.'));
    }
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({message: err.message}));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const {title} = req.params;
  if (!title) {
    return res.status(400).json({message: 'Title required.'});
  }
  new Promise((resolve, reject) => {
    const book = Object.values(books).filter(book => book.title === title);
    if (book.length > 0) {
        setTimeout( () => {
            resolve(book);
        }, 6000)
    } else {
      reject(new Error('Book not found.'));
    }
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({message: err.message}));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  if (!isbn) {
    return res.status(400).json({message: 'ISBN required.'});
  }

  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: 'Book not found.'});
  }
});

module.exports.general = public_users;

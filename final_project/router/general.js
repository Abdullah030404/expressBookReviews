const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Username and password are required."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });
  
  getBooks.then(
    (bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)),
    (err) => res.status(500).json({ message: "Error retrieving books" })
  );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBook.then(
    (book) => res.status(200).send(JSON.stringify(book, null, 4)),
    (err) => res.status(err.status).json({ message: err.message })
  );
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase().replace(/-/g, ' ');
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const bookList = [];
    for (let isbn in books) {
      if (books[isbn].author.toLowerCase() === author) {
        bookList.push({
          isbn: isbn,
          title: books[isbn].title,
          reviews: books[isbn].reviews
        });
      }
    }
    resolve(bookList);
  });

  getBooksByAuthor.then(
    (bookList) => res.status(200).send(JSON.stringify({ booksbyauthor: bookList }, null, 4)),
    (err) => res.status(500).json({ message: "Error retrieving books" })
  );
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase().replace(/-/g, ' ');
  const getBooksByTitle = new Promise((resolve, reject) => {
    const bookList = [];
    for (let isbn in books) {
      if (books[isbn].title.toLowerCase() === title) {
        bookList.push({
          isbn: isbn,
          author: books[isbn].author,
          reviews: books[isbn].reviews
        });
      }
    }
    resolve(bookList);
  });

  getBooksByTitle.then(
    (bookList) => res.status(200).send(JSON.stringify({ booksbytitle: bookList }, null, 4)),
    (err) => res.status(500).json({ message: "Error retrieving books" })
  );
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;

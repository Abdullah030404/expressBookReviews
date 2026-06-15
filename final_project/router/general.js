const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get('http://localhost:5000/');
    const booksList = response.data;
    if (booksList[isbn]) {
      return res.status(200).send(JSON.stringify(booksList[isbn], null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase().replace(/-/g, ' ');
  try {
    const response = await axios.get('http://localhost:5000/');
    const booksList = response.data;
    const bookList = [];
    for (let isbn in booksList) {
      if (booksList[isbn].author.toLowerCase() === author) {
        bookList.push({
          isbn: isbn,
          title: booksList[isbn].title,
          reviews: booksList[isbn].reviews
        });
      }
    }
    return res.status(200).send(JSON.stringify({ booksbyauthor: bookList }, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase().replace(/-/g, ' ');
  try {
    const response = await axios.get('http://localhost:5000/');
    const booksList = response.data;
    const bookList = [];
    for (let isbn in booksList) {
      if (booksList[isbn].title.toLowerCase() === title) {
        bookList.push({
          isbn: isbn,
          author: booksList[isbn].author,
          reviews: booksList[isbn].reviews
        });
      }
    }
    return res.status(200).send(JSON.stringify({ booksbytitle: bookList }, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;

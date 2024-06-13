const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.json(books);
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const bookId = req.params.isbn;  // Extract the book ID from the request parameters
  const book = books[bookId];
  
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();  // Extract the author from the request parameters and convert to lowercase
  const booksByAuthor = [];

  // Iterate over the books and find those by the specified author
  for (const bookId in books) {
    if (books[bookId].author.toLowerCase() === author) {
      booksByAuthor.push(books[bookId]);
    }
  }

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: 'No books found by this author' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();  // Extract the author from the request parameters and convert to lowercase
  const booksByTitle = [];

  // Iterate over the books and find those by the specified author
  for (const bookId in books) {
    if (books[bookId].title.toLowerCase() === title) {
      booksByTitle.push(books[bookId]);
    }
  }

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: 'No books found by this author' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Task 10

function getBookList(){
  return new Promise((resolve,reject)=>{
    resolve(books);
  })
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBookList().then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send("denied")
  );  
});

// Task 11

function getFromISBN(isbn){
  let book_ = books[isbn];  
  return new Promise((resolve,reject)=>{
    if (book_) {
      resolve(book_);
    }else{
      reject("Unable to find book!");
    }    
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  )
});

// Task 12

function getFromAuthor(author){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author){
        output.push(book_);
      }
    }
    resolve(output);  
  })
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getFromAuthor(author)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});


module.exports.general = public_users;

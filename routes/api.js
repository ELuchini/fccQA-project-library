/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models/Book');

module.exports = function (app) {
  

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      
      /* Book.find({}, (err, books) => {
        if (err) return res.status(500).send(err);
        res.json(books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        })));
      }); */

      Book.find({})
        .then(books => {
          res.json(books.map(book => ({
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          })));
        })
        .catch(err => {
          console.error(`Error finding books: ${err}`);
          res.status(500).send('error finding books');
        });

    })
    
    .post(function (req, res){
      let title = req.body.title;

      if(!title){
        return res.send('missing required field title');
      }

      //response will contain new book object including atleast _id and title
      //console.log(`New book created: ${JSON.stringify(req.body)}`);
      const newBook = new Book({ title, comments: [] });
      newBook.save()
        .then(savedBook => {
          res.json({ _id: savedBook._id, title: savedBook.title });
        })
        .catch(err => {
          console.error(`Error saving book: ${err}`);
          res.status(500).send('error saving book');
        });

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      /* Book.deleteMany({}, (err) => {
        if (err) return res.status(500).send('error deleting books');
        res.send('complete delete successful');
      }); */

      Book.deleteMany({})
        .then(() => {
          res.send('complete delete successful');
        })
        .catch(err => {
          console.error(`Error deleting books: ${err}`);
          res.status(500).send('error deleting books');
        });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      /* Book.findById(bookid, (err, book) => {
        if (err) return res.status(500).send('error finding book');
        if (!book) return res.send('no book exists');
        res.json({ _id: book._id, title: book.title, comments: book.comments });
      }); */
      Book.findById(bookid)
        .then(book => {
          if (!book) return res.send('no book exists');
          res.json({ _id: book._id, title: book.title, comments: book.comments });
        })
        .catch(err => {
          console.error(`Error finding book: ${err}`);
          res.status(500).send('error finding book');
        });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) return res.send('missing required field comment');

      /* Book.findById(bookid, (err, book) => {
        if (err) return res.status(500).send('error finding book');
        if (!book) return res.send('no book exists');
        book.comments.push(comment);
        book.save((err, updatedBook) => {
          if (err) return res.status(500).send('error saving comment');
          res.json({ _id: updatedBook._id, title: updatedBook.title, comments: updatedBook.comments });
        });
      }); */
      Book.findById(bookid)
        .then(book => {
          if (!book) return res.send('no book exists');
          book.comments.push(comment);
          return book.save();
        })
        .then(updatedBook => {
          res.json({ _id: updatedBook._id, title: updatedBook.title, comments: updatedBook.comments });
        })
        .catch(err => {
          console.error(`Error saving comment: ${err}`);
          res.status(500).send('error saving comment');
        });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      /* Book.findByIdAndDelete(bookid, (err, book) => {
        if (err) return res.status(500).send('error deleting book');
        if (!book) return res.send('no book exists');
        res.send('delete successful');
      }); */
      Book.findByIdAndDelete(bookid)
        .then(book => {
          if (!book) return res.send('no book exists');
          res.send('delete successful');
        })
        .catch(err => {
          console.error(`Error deleting book: ${err}`);
          res.status(500).send('error deleting book');
        });
    });
  
};

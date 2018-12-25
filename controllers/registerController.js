var User = require('../models/user');
var Todo = require('../models/todo');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');

exports.index = function(req, res) {
    res.render('index', { title: 'Todo Home',title:"Home"});
};

// Display list of all Users.
exports.user_list = function(req, res, next) {
    User.find({})
    .populate('')
    .exec(function (err, list_users) {
      if (err) {return next(err); }
      //Successful, so render
      res.render('userList', { title: 'User List', user_list: list_users });
    });
};

// Display detail page for a specific User.
exports.user_detail = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id)
              .exec(callback)
        },
        user_todos: function(callback) {
          Todo.find({ '_userId': req.params.id },'todoName todoDesc')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.user==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('userDetail', { title: 'User Detail', user: results.user, user_todos: results.user_todos } );
    });
};

// Display User create form on GET.
exports.user_create_get = function(req, res) {
    res.render('register', { title: 'Create User' });
};

// Handle User create on POST.
exports.user_create_post =  [
    // Validate that the name field is not empty.
    body('username', 'user name required').isLength({ min: 1 }).trim(),
    body('password', 'user password required').isLength({ min: 1 }).trim(),
    // Sanitize (trim and escape) the name field.
    sanitizeBody('username').trim().escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      var user = new User(
        { 
          userName: req.body.username,
          userPassword: req.body.password 
        }
      );
  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('register', { title: 'Create User', user: user, errors: errors.array()});
      return;
      }
      else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        User.findOne({ 'username': req.body.username })
          .exec( function(err, found_user) {
             if (err) { return next(err); }
             if (found_user) {
                res.render('register', { title: 'Create User', user: user, errors: errors.array()});
             }
             else {
               user.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(user.url);
               });
             }
           });
      }
    }
  ];

// Display User delete form on GET.
exports.user_delete_get = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback)
        },
        user_todos: function(callback) {
          Todo.find({ '_userId': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.user==null) { // No results.
            res.redirect('/default/users');
        }
        // Successful, so render.
        res.render('userDelete', { title: 'Delete User', user: results.user, user_todos: results.user_todos } );
    });
};

// Handle User delete on POST.
exports.user_delete_post = function(req, res, next) {
    
    async.parallel({
        user: function(callback) {
          User.findById(req.body.userrid).exec(callback)
        },
        user_todos: function(callback) {
          Todo.find({ '_userId': req.body.userrid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.user_todos.length > 0) {
            // user has todos. Render in same way as for GET route.
            res.render('userDelete', { title: 'Delete Author', user: results.user, user_todos: results.user_todos } );
            return;
        }
        else {
            //User has no todos. Delete object and redirect to the list of users.
            User.findByIdAndRemove(req.body.userrid, function deleteUser(err) {
                if (err) { return next(err); }
                // Success - go to user list
                res.redirect('/default/users')
            })
        }
    });
};

// Display User update form on GET.
exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST.
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};
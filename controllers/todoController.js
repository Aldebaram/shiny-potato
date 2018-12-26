var User = require('../models/user');
var Todo = require('../models/todo');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');

exports.index = function(req, res) {
    res.render('index', { title: 'Todo Home',title:"Home"});
};

// Display list of all Todos.
exports.todo_list = function(req, res, next) {
    Todo.find({})
    .populate('')
    .exec(function (err, list_todos) {
      if (err) {return next(err); }
      //Successful, so render
      res.render('todoList', { title: 'Todo List', todo_list: list_todos });
    });
};

// Display detail page for a specific Todo.
exports.todo_detail = function(req, res, next) {
    async.parallel({
        todo: function(callback) {
            Todo.findById(req.params.id)
              .exec(callback)
        },
        todo_todos: function(callback) {
          Todo.find({ '_todoId': req.params.id },'todoName todoDesc')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.todo==null) { // No results.
            var err = new Error('Todo not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('todoDetail', { title: 'Todo Detail', todo: results.todo, todo_todos: results.todo_todos } );
    });
};

// Display Todo create form on GET.
exports.todo_create_get = function(req, res) {
    res.render('register', { title: 'Create Todo' });
};

// Handle Todo create on POST.
exports.todo_create_post =  [
    // Validate that the name field is not empty.
    body('todoName', 'todo name required').isLength({ min: 1 }).trim(),
    body('todoDesc', 'todo description required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('todoName').trim().escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      var todo = new Todo(
        { 
          todoName: req.body.todoname,
          todoPassword: req.body.password 
        }
      );
  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('register', { title: 'Create Todo', todo: todo, errors: errors.array()});
      return;
      }
      else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        Todo.findOne({ 'todoname': req.body.todoname })
          .exec( function(err, found_todo) {
             if (err) { return next(err); }
             if (found_todo) {
                res.render('register', { title: 'Create Todo', todo: todo, errors: errors.array()});
             }
             else {
               todo.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(todo.url);
               });
             }
           });
      }
    }
  ];

// Display Todo delete form on GET.
exports.todo_delete_get = function(req, res, next) {
    async.parallel({
        todo: function(callback) {
            Todo.findById(req.params.id).exec(callback)
        },
        todo_todos: function(callback) {
          Todo.find({ '_todoId': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.todo==null) { // No results.
            res.redirect('/default/todos');
        }
        // Successful, so render.
        res.render('todoDelete', { title: 'Delete Todo', todo: results.todo, todo_todos: results.todo_todos } );
    });
};

// Handle Todo delete on POST.
exports.todo_delete_post = function(req, res, next) {
    
    async.parallel({
        todo: function(callback) {
          Todo.findById(req.body.todorid).exec(callback)
        },
        todo_todos: function(callback) {
          Todo.find({ '_todoId': req.body.todorid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.todo_todos.length > 0) {
            // todo has todos. Render in same way as for GET route.
            res.render('todoDelete', { title: 'Delete Author', todo: results.todo, todo_todos: results.todo_todos } );
            return;
        }
        else {
            //Todo has no todos. Delete object and redirect to the list of todos.
            Todo.findByIdAndRemove(req.body.todorid, function deleteTodo(err) {
                if (err) { return next(err); }
                // Success - go to todo list
                res.redirect('/default/todos')
            })
        }
    });
};

// Display Todo update form on GET.
exports.todo_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Todo update GET');
};

// Handle Todo update on POST.
exports.todo_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Todo update POST');
};
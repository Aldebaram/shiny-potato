var User = require("../models/user");
var Todo = require("../models/todo");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
var async = require("async");

// Display user login form on GET.
exports.login_get = function(req, res) {
  res.render("login", { title: "User Login" });
};

// handle login form on POST.
exports.login_post = [
  // Validate that the name field is not empty.
  body("username", "user name required")
    .isLength({ min: 1 })
    .trim(),
  body("password", "user password required")
    .isLength({ min: 1 })
    .trim(),
  // Sanitize (trim and escape) the name field.
  sanitizeBody("username")
    .trim()
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a user object with escaped and trimmed data.
    var user = new User({
      userName: req.body.username,
      userPassword: req.body.password
    });


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("login", {
        title: "User Login",
        user: user,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid.
      // Check if login is valid
      //authenticate input against database
      User.authenticate(req.body.username, req.body.password, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong user name or password.');
          err.status = 401;
          next(err);
        } else {
          console.log(user);
          req.session.userName = user.userName;
          req.session.userId = user._id;
          console.log(req.session.userName);
          console.log(req.session.userId);
          res.redirect(user.url);
        }
      });}
  }
];

// Display user login form on GET.
exports.logout_get = function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
};

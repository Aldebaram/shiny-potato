var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/registerController');

// GET catalog home page.
router.get('/',isLogged , user_controller.index);

/// USER ROUTES ///

// GET request for creating User. NOTE This must come before route for id (i.e. display user).
router.get('/user/create', isLogged ,user_controller.user_create_get);

// POST request for creating User.
router.post('/user/create', isLogged ,user_controller.user_create_post);

// GET request to delete User.
router.get('/user/:id/delete', requiresLogin ,isLogged ,user_controller.user_delete_get);

// POST request to delete User.
router.post('/user/:id/delete', requiresLogin ,isLogged ,user_controller.user_delete_post);

// GET request to update User.
router.get('/user/:id/update', requiresLogin ,isLogged ,user_controller.user_update_get);

// POST request to update User.
router.post('/user/:id/update', requiresLogin ,isLogged ,user_controller.user_update_post);

// GET request for one User.
router.get('/user/:id', requiresLogin ,isLogged ,user_controller.user_detail);

// GET request for list of all Users.
router.get('/users', requiresLogin ,isLogged ,user_controller.user_list);

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    } else {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      return next(err);
    }
  }

  function isLogged(req, res, next) {
    if (req.session.userId) {
        res.locals.logged = true;  
        next();
      }else{
      //idk
      next();
      }
  }

module.exports = router;
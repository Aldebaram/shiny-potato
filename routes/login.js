var express = require('express');
var router = express.Router();

// Require controller modules.
var login_controller = require('../controllers/loginController');


// GET request for user login.
router.get('/', isLogged ,login_controller.login_get);

// POST request for user login.
router.post('/', isLogged ,login_controller.login_post);

//GET request for user logout
router.get('/logout', isLogged ,login_controller.logout_get);

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

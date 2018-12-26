var express = require('express');
var router = express.Router();

// Require controller modules.
var login_controller = require('../controllers/loginController');


// GET request for user login.
router.get('/', login_controller.login_get);

// POST request for user login.
router.post('/', login_controller.login_post);

//GET request for user logout
router.get('/logout', login_controller.logout_get);

module.exports = router;

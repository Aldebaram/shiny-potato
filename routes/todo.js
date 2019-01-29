var express = require("express");
var router = express.Router();

// Require controller modules.
var todo_controller = require("../controllers/todoController");

/// TODO ROUTES ///

// GET request for creating Todo. NOTE This must come before route for id (i.e. display todo).
router.get("/create", todo_controller.todo_create_get);

// POST request for creating Todo.
router.post("/create", todo_controller.todo_create_post);

// GET request to delete Todo.
router.get("/:id/delete", todo_controller.todo_delete_get);

// POST request to delete Todo.
router.post("/:id/delete", todo_controller.todo_delete_post);

// GET request to update Todo.
router.get("/:id/update", todo_controller.todo_update_get);

// POST request to update Todo.
router.post("/:id/update", todo_controller.todo_update_post);

// GET request for one Todo.
router.get("/:id", todo_controller.todo_detail);

// GET request for list of all Todos.
router.get("/todos", todo_controller.todo_list);

module.exports = router;

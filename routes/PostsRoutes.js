const express = require("express");
const userController = require("../controllers/");
const router = express.Router();

//POST /admin/posts - insert post Record
router.post("/admin/posts", userController.createUser);

//PUT /admin/posts - update post Record
router.put("/admin/posts", userController.updateUser);

//GET /admin/posts - get posts Record
router.get("/admin/posts", userController.getUser);

//DELETE /admin/posts - get posts Record
router.delete("/admin/posts", userController.getUser);

module.exports = router;
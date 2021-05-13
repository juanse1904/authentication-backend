const express = require("express");
const postController = require("../controllers/postsController");
const router = express.Router();

//POST /admin/posts - insert post Record
router.post("/admin/posts", postController.createPost);

//GET /admin/posts - get posts Record
router.get("/admin/posts", postController.getPosts);

//DELETE /admin/posts - get posts Record
router.delete("/admin/posts", postController.deletePost);

module.exports = router;
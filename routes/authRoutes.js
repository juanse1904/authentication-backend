const express = require("express");
const AuthController = require("../controllers/postsController");
const router = express.Router();



//POST api/auth/sign-in - makes the authentication
router.post("api/auth/sign-in", AuthController.authenticate);


module.exports = router;
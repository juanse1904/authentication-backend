const express = require("express");
const AuthController = require("../controllers/authController");
const router = express.Router();



//POST api/auth/sign-in - makes the authentication
router.post("/api/auth/sign-in", AuthController.postApiKey);


module.exports = router;
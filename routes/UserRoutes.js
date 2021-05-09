const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

//POST /admin/user - insert user Record
router.post("/admin/user", userController.createUser);

//PUT /admin/user - update user Record
router.put("/admin/user", userController.updateUser);

//GET /admin/user - get user Record
router.get("/admin/user", userController.getUser);

module.exports = router;
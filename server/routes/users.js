const express  = require("express");
const passport = require("passport");

const router = express.Router();

const ctrlUsers = require("../controllers/users");


router.post("/signup", ctrlUsers.user_signup);
router.post("/login", ctrlUsers.user_login);
router.delete("/users/:userId", ctrlUsers.user_delete);
router.get("/users/:userId", ctrlUsers.getUserById);


module.exports = router;



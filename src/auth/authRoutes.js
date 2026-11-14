const express = require("express");
const { register } = require("./auth.controller");

const router = express.Router();

// REGISTER API
router.post("/register", register);

module.exports = router;
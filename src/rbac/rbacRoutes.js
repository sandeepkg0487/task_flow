const express = require("express");
const {  createRole } = require("./rbac.controller");

const router = express.Router();

// CREATE ROLE API
router.post("/create-role", createRole);

module.exports = router;
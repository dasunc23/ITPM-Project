const express = require("express");
const { getModules } = require("../controllers/moduleController");

const router = express.Router();

router.get("/", getModules);

module.exports = router;

const express = require("express");
const { getSemesters } = require("../controllers/semesterController");

const router = express.Router();

router.get("/", getSemesters);

module.exports = router;

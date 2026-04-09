const Module = require("../models/Module");
const Semester = require("../models/Semester");

const getModules = async (req, res, next) => {
  try {
    const { year, semester } = req.query;
    const query = {};

    if (year && semester) {
      const semesterDocument = await Semester.findOne({
        year: Number(year),
        semester: Number(semester),
      });

      if (!semesterDocument) {
        return res.json([]);
      }

      query.semesterId = semesterDocument._id;
    }

    const modules = await Module.find(query)
      .populate("semesterId", "year semester")
      .sort({ name: 1 });

    res.json(modules);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getModules,
};

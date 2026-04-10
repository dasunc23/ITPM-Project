import Semester from "../models/Semester.js";

export const getSemesters = async (req, res, next) => {
  try {
    const semesters = await Semester.find().sort({ year: 1, semester: 1 });
    res.json(semesters);
  } catch (error) {
    next(error);
  }
};

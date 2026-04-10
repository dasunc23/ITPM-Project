import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      min: 1,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

semesterSchema.index({ year: 1, semester: 1 }, { unique: true });

export default mongoose.model("Semester", semesterSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "user"
  },
  campus: {
    type: String,
    default: ""
  },
  year: {
    type: String,
    default: ""
  }
});

export default mongoose.model("User", userSchema);
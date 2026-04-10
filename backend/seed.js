import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Semester from "./models/Semester.js";
import Module from "./models/Module.js";
import Game from "./models/Game.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Game.deleteMany({});
    await Module.deleteMany({});
    await Semester.deleteMany({});

    const semester = await Semester.create({
      year: 3,
      semester: 2,
    });

    const moduleData = await Module.create({
      name: "Data Systems",
      code: "DS301",
      semesterId: semester._id,
    });

    await Game.insertMany([
      {
        name: "SQL Quiz Battle",
        type: "quiz",
        moduleId: moduleData._id,
        description: "Compete in fast SQL theory rounds and beat your classmates on speed and accuracy.",
        difficulty: "Intermediate",
        thumbnail:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "SQL Coding Challenge",
        type: "coding",
        moduleId: moduleData._id,
        description: "Write live SQL queries to solve practical database problems under time pressure.",
        difficulty: "Advanced",
        thumbnail:
          "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Schema Memory Match",
        type: "memory",
        moduleId: moduleData._id,
        description: "Match tables, keys, and schema relationships in a visual multiplayer memory game.",
        difficulty: "Beginner",
        thumbnail:
          "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "SQL Typing Race",
        type: "typing",
        moduleId: moduleData._id,
        description: "Race to type SQL commands correctly and finish complex query patterns before others.",
        difficulty: "Intermediate",
        thumbnail:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
      },
    ]);

    console.log("Seed data inserted successfully.");
    process.exit(0);
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedData();

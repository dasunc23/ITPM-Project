import express from 'express';
import { getSemesters } from '../controllers/semesterController.js';

const router = express.Router();

router.get("/", getSemesters);

export default router;

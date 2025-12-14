import express from "express";
import multer from "multer";
import path from "path";
import {
  submitReport,
  uploadBulkReports,
  getJobStatus,
} from "../controllers/reportController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== ".csv") {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
});

import fs from "fs";
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

router.post("/report", submitReport);
router.post("/reports/upload", upload.single("file"), uploadBulkReports);
router.get("/job-status/:jobId", getJobStatus);

export default router;

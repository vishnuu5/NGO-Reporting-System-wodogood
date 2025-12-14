import Report from "../models/Report.js";
import Job from "../models/Job.js";
import { v4 as uuidv4 } from "uuid";
import { parse } from "csv-parse";
import fs from "fs";

export const submitReport = async (req, res) => {
  try {
    const { ngoId, month, peopleHelped, eventsConducted, fundsUtilized } =
      req.body;
    if (
      !ngoId ||
      !month ||
      peopleHelped === undefined ||
      eventsConducted === undefined ||
      fundsUtilized === undefined
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "Month must be in YYYY-MM format" });
    }
    if (peopleHelped < 0 || eventsConducted < 0 || fundsUtilized < 0) {
      return res
        .status(400)
        .json({ error: "Numeric values must be non-negative" });
    }
    const existingReport = await Report.findOne({ ngoId, month });

    if (existingReport) {
      existingReport.peopleHelped = peopleHelped;
      existingReport.eventsConducted = eventsConducted;
      existingReport.fundsUtilized = fundsUtilized;
      await existingReport.save();

      return res.status(200).json({
        message: "Report updated successfully",
        report: existingReport,
      });
    }
    const report = new Report({
      ngoId,
      month,
      peopleHelped,
      eventsConducted,
      fundsUtilized,
    });

    await report.save();

    res.status(201).json({
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
};
export const uploadBulkReports = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const jobId = uuidv4();
    const filePath = req.file.path;
    const job = new Job({
      jobId,
      status: "pending",
    });
    await job.save();
    res.status(202).json({
      message: "File uploaded successfully. Processing started.",
      jobId,
    });
    processCSVFile(filePath, jobId);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

export const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({ jobId });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job status:", error);
    res.status(500).json({ error: "Failed to fetch job status" });
  }
};
async function processCSVFile(filePath, jobId) {
  try {
    const job = await Job.findOne({ jobId });
    if (!job) return;

    job.status = "processing";
    await job.save();

    const records = [];
    const parser = fs.createReadStream(filePath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
    );

    for await (const record of parser) {
      records.push(record);
    }

    job.totalRows = records.length;
    await job.save();

    let processedCount = 0;
    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNumber = i + 2;

      try {
        // Validate required fields
        if (
          !record.ngoId ||
          !record.month ||
          !record.peopleHelped ||
          !record.eventsConducted ||
          !record.fundsUtilized
        ) {
          throw new Error("Missing required fields");
        }
        if (!/^\d{4}-\d{2}$/.test(record.month)) {
          throw new Error("Invalid month format. Use YYYY-MM");
        }

        const peopleHelped = Number.parseInt(record.peopleHelped);
        const eventsConducted = Number.parseInt(record.eventsConducted);
        const fundsUtilized = Number.parseFloat(record.fundsUtilized);

        // Validate numeric values
        if (
          isNaN(peopleHelped) ||
          isNaN(eventsConducted) ||
          isNaN(fundsUtilized)
        ) {
          throw new Error("Invalid numeric values");
        }

        if (peopleHelped < 0 || eventsConducted < 0 || fundsUtilized < 0) {
          throw new Error("Numeric values must be non-negative");
        }
        const existingReport = await Report.findOne({
          ngoId: record.ngoId,
          month: record.month,
        });

        if (existingReport) {
          existingReport.peopleHelped = peopleHelped;
          existingReport.eventsConducted = eventsConducted;
          existingReport.fundsUtilized = fundsUtilized;
          await existingReport.save();
        } else {
          await Report.create({
            ngoId: record.ngoId,
            month: record.month,
            peopleHelped,
            eventsConducted,
            fundsUtilized,
          });
        }

        successCount++;
      } catch (error) {
        failedCount++;
        errors.push({
          row: rowNumber,
          message: error.message,
        });
      }

      processedCount++;

      // Update job progress every 10 rows or at the end
      if (processedCount % 10 === 0 || processedCount === records.length) {
        job.processedRows = processedCount;
        job.successCount = successCount;
        job.failedCount = failedCount;
        job.errors = errors;
        await job.save();
      }
    }
    job.status = failedCount === records.length ? "failed" : "completed";
    job.processedRows = processedCount;
    job.successCount = successCount;
    job.failedCount = failedCount;
    job.errors = errors;
    await job.save();

    // Clean up uploaded file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Error processing CSV:", error);
    const job = await Job.findOne({ jobId });
    if (job) {
      job.status = "failed";
      job.errors.push({ row: 0, message: error.message });
      await job.save();
    }

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

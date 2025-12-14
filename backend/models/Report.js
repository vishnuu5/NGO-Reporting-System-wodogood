import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    ngoId: {
      type: String,
      required: true,
      trim: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
    },
    peopleHelped: {
      type: Number,
      required: true,
      min: 0,
    },
    eventsConducted: {
      type: Number,
      required: true,
      min: 0,
    },
    fundsUtilized: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of NGO ID + Month combination
reportSchema.index({ ngoId: 1, month: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);

export default Report;

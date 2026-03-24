import mongoose from "mongoose";
import Result from "../models/result.model";

export const getResultById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid result id",
      });
    }

    const result = await Result.findById(id);

    if (!result) {
      return res.status(404).json({
        error: "Result not found",
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Get result error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

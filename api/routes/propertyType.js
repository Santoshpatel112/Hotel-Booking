import express from "express";
const router = express.Router();

// Example route for property types
router.get("/", (req, res) => {
  res.status(200).json({ message: "Property types endpoint" });
});

export default router;
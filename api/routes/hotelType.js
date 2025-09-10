import express from "express";
const router = express.Router();


// Example route for hotel types
router.get("/", (req, res) => {
  res.status(200).json({ message: "Hotel types endpoint" });
});

export default router;
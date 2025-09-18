// routes/cityRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const {
  getCities,
  getCity,
  createCity,
  updateCity,
  deleteCity,
} = require("../controllers/cityController");
// const { protect } = require("../middleware/authMiddleware"); // optional

const router = express.Router();

function validateObjectId(req, res, next) {
  const { id } = req.params;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  next();
}

router.get("/", getCities);
router.get("/:id", validateObjectId, getCity);

// If you have auth, add protect before write routes
router.post("/", /* protect, */ createCity);
router.put("/:id", /* protect, */ validateObjectId, updateCity);
router.delete("/:id", /* protect, */ validateObjectId, deleteCity);

module.exports = router;

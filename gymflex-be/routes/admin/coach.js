const express = require("express");
const { protect, onlyAdmin } = require("../../middleware/auth");
const {
  getCoaches,
  createCoache,
  getCoach,
  updateCoach,
  deleteCoach,
} = require("../../controllers/admin/coach");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    const fieldName = file.fieldname;
    cb(null, fieldName + '-' + uniqueSuffix + extname);
  }
});

const upload = multer({ storage: storage });

router.route("/").get(protect, getCoaches);
router.route("/").post(protect, upload.array('images'), createCoache);
router.route("/:id").get(protect, getCoach);
router.route("/:id").post(protect, upload.array('images'), updateCoach);
router.route("/:id").delete(protect, deleteCoach);

module.exports = router;

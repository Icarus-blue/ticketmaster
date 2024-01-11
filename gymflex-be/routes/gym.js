const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const {
  getGyms,
  createGym,
  getGym,
  updateGym,
  deleteGym,
  getAllGyms,
  registerLocalgym
} = require("../controllers/gym");
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
// local gym admin gym fetch
router.route("/").get(protect, getGyms);
//
//super admin and general user gym fetch 
router.route("/getallgym").get(protect, getAllGyms);
//
router.route("/").post(protect, upload.array('images'), createGym);
router.route("/:id").get(protect, getGym);
router.route("/:id").post(protect, updateGym);
router.route("/:id").delete(protect, deleteGym);
router.route("/registerlocalgym/:id").post(protect, registerLocalgym);

module.exports = router;

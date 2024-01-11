const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const {
    getActivity,
} = require("../controllers/activity");
const router = express.Router();



router.route("/").get(protect, getActivity);

module.exports = router;

const express = require("express");
const { protect, onlyAdmin } = require("../middleware/auth");
const {
    depositController,
    payToLocalGym
} = require("../controllers/payment");
const router = express.Router();



router.route("/").post(protect, depositController);
router.route("/payforservice").post(protect, payToLocalGym);
module.exports = router;

const express = require("express");
const { protect, onlyAdmin } = require("../../middleware/auth");
const {
    adminCreateWallet,
    getadminWallet
} = require("../../controllers/payment");
const router = express.Router();



router.route("/").post(protect, adminCreateWallet);
router.route("/").get(protect, getadminWallet);
module.exports = router;

const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getUser,
  getUsers,
  sendfriendrequest,
  getfriendrequest,
  getfriendrequests,
  acceptfriendrequest,
  rejectfriendrequest,
  unfriend,
  updateUser,
} = require("../controllers/user");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/").get(protect, getUser);
router.route("/all").get(protect, getUsers);
router.route("/update").post(protect, upload.single('avatar'), updateUser);
router.route("/sendfriendrequest/:id").post(protect, sendfriendrequest);
router.route("/getfriendrequests").get(protect, getfriendrequests);
router.route("/getfriendrequest/:id").get(protect, getfriendrequest);
router.route("/acceptfriendrequest/:id").get(protect, acceptfriendrequest);
router.route("/rejectfriendrequest/:id").get(protect, rejectfriendrequest);
router.route("/unfriend/:id").get(protect, unfriend);

module.exports = router;

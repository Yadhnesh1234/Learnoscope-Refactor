const express = require("express");
const router = express.Router();
const {
  register,
  login,
  protect,
  deleteUserAccount,
} = require("../Controllers/Auth/authController");
const {
  addToBookMark,
  addToHistory,
  removeFromBookMark,
  removeFromHistory,
  removeFromYourVideo,
  getBookmarkVideoList,
  getHistoryVideoList,
  getYourVideoVideoList
} = require("../Controllers/userUtility")
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profilePictures");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const profilePicture = multer({ storage: storage });

// user registration
router.post(
  "/register",
  profilePicture.single("profilePicture"),
  (req, res, next) => {
    // Replace backward slashes with forward slashes in req.file.path
    req.file.path = req.file.path.replace(/\\/g, "/");

    // Call the user registration handler (assuming 'register' handles saving to the database)
    register(req, res, next);
  }
);
// user login
router.post("/login", login);
// Delete user account
router.delete("/user/delete", protect, deleteUserAccount);
router.post("/add-to-bookmark/:id", addToBookMark)
router.post("/add-to-history/:id", addToHistory)
router.post("/remove-from-bookmark/:id",removeFromBookMark)
router.post("/remove-from-history/:id",removeFromHistory)
router.post("/remove-from-YourVideo/:id",removeFromYourVideo)
router.get("/get-bookmark-list/:id",getBookmarkVideoList)
router.get("/get-history-list/:id",getHistoryVideoList)
router.get("/get-yourvideo-list/:id",getYourVideoVideoList)
module.exports = router;

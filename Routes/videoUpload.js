const express = require('express')
const multer = require('multer');

const { UploadVideoData, 
        moderationCallBack, 
        getVideoData, 
        getVideoList, 
        deleteVideo
      } = require('../Controllers/videoUpload')

const upload = multer({ dest: 'uploads' }).fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);
const router = express.Router();

router.post("/upload-video/:id", upload, UploadVideoData)
router.post("/moderate-result", moderationCallBack)
router.get("/get-video-data/:id", getVideoData)
router.get("/get-video-list", getVideoList)
router.delete("/delete-video/:id", deleteVideo)
module.exports = router
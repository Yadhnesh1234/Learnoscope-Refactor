const express = require('express')
const multer = require('multer');

const { UploadVideoData, 
        moderationCallBack, 
        getVideoData, 
        getVideoList, 
        deleteVideo,
        incVideoLike,
        decVideoLike,
        incVideoReport,
        decVideoReport
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
router.get("/inc-video-like/:id",incVideoLike)
router.get("/dec-video-like/:id",decVideoLike)
router.get("/inc-video-report/:id",incVideoReport)
router.get("/dec-video-report/:id",decVideoReport)
module.exports = router
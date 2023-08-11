const VideoUpload = require("../Models/videoUpload")
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const User = require("../Models/Auth/user")
const sightengineApiUser = '166011782';
const sightengineApiSecret = 'DFwwGX3jLxuTnyv5jfcm';


const UploadVideoData = async (req, res, next) => {
  const videoFile = req.files['video'][0];
  const imageFile = req.files['image'][0];
  const baseUrl = 'http://localhost:3000/'
  const user_Id= req.params.id
  var save_data;
  const { title, description, filePath, thumbnailPath, uploaderEmail, tags } = req.body
  if (!videoFile || !imageFile) {
    return res.status(400).json({ error: 'Video and image files are required.' });
  }
  // Generate a unique name for both the video and image
  const videoName = `video_${Date.now()}_${videoFile.originalname}`;
  const imageName = `image_${Date.now()}_${imageFile.originalname}`;

  // Create paths to store the files with their new names
  const videoPath = path.join('uploads', videoName);
  const imagePath = path.join('uploads', imageName);
  const vid = videoFile.path;
  const img = imageFile.path;
  // Perform both file renaming operations
  fs.rename(vid, videoPath, (videoErr) => {
    if (videoErr) {
      return res.status(400).send({ msg: 'Error renaming video file.' });
    }

    fs.rename(img, imagePath, async (imageErr) => {
      if (imageErr) {
        // If there's an error with the image file, you may want to delete the video file to keep them in sync.
        fs.unlink(videoPath, () => {
          return res.status(400).send({ msg: 'Error renaming image file.' });
        });
      }
      try{
      const uploadDate = new Date();
      save_data = new VideoUpload({
        title,
        description,
        filePath: baseUrl + videoPath,
        thumbnailPath: baseUrl + imagePath,
        uploaderEmail,
        uploadDate,
        tags
      })
      save_data.save()
      await User.findOneAndUpdate({
        _id:user_Id
      },{
        $addToSet:{
          userUplodedVideo:save_data._id
        }
      })
      res.status(200).send({ save_data, msg: 'Files uploaded and renamed successfully!' });
    }catch(err){
      res.status(500).send({ msg: "Internal Server Error" });
    }
    });
  });
}

async function getModerationResults(videoPath) {
  const data = new FormData();
  data.append('media', fs.createReadStream(videoPath));
  data.append('models', 'nudity,offensive,wad,gore,gambling');
  data.append('callback_url', 'https://4524-103-120-251-148.ngrok-free.app/api/v1/moderate-result');
  data.append('api_user', sightengineApiUser);
  data.append('api_secret', sightengineApiSecret);

  try {
    const response = await axios.post('https://api.sightengine.com/1.0/video/check.json', data, {
      headers: data.getHeaders()
    });

    // Handle the response data (moderation results) synchronously
    const moderationResults = response.data;
    console.log(moderationResults);
    // Access specific moderation attributes if needed
  } catch (error) {
    // Handle errors
    if (error.response) console.log(error.response.data);
    else console.log(error.message);
  }
}

const moderationCallBack = async (req, res, next) => {
  const moderationResults = req.body;
  // const moderate_result_list = moderationResults.data.frames;
  // console.log(moderate_result_list)
}

/*Get Video*/
const getVideoData = async (req, res, next) => {
  const id = req.params.id
  let data
  try {
    data = await VideoUpload.findById(id)
    data.tags = JSON.parse(data.tags[0]);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" })
  }
  if (!data)
    return res.status(500).json({ message: "Internal server error" })

  return res.status(200).json({ status: 200, data, msg: "data fetch successfully" })
}

/*Get All Vedios*/
const getVideoList = async (req, res, next) => {
  let data
  try {
    data = await VideoUpload.find()
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" })
  }
  if (!data)
    return res.status(500).json({ message: "Internal server error" })

  return res.status(200).json({ status: 200, data, msg: "data fetch successfully" })
}

/*Delete Video*/
const deleteVideo = async (req, res, next) => {
  const id = req.params.id;
  const baseUrl = 'http://localhost:3000/'
  try {
    // Find the video by its ID and delete it
    const deletedVideo = await VideoUpload.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ message: 'Video not found.' });
    }

    //delete the actual video file and thumbnail here
    deletedVideo.filePath = deletedVideo.filePath.replace(baseUrl, '')
    fs.unlink(deletedVideo.filePath, (err) => {
      console.log(err)
    });
    deletedVideo.thumbnailPath = deletedVideo.thumbnailPath.replace(baseUrl, '')
    fs.unlink(deletedVideo.thumbnailPath, (err) => {
      console.log(err)
    });

    return res.status(200).json({ message: 'Video deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

//increment video like
const incVideoLike=async(req,res,next)=>{
     const video_id=req.params.id
     try{
      await VideoUpload.findOneAndUpdate({_id:video_id},{$inc : {like:1}});
      return res.status(200).json({status:200,msg:"Video Liked"});
     }catch(err){
      console.log(err)
      return res.status(500).json({ message: 'Internal server error.' });
     }
}

//decrement video like
const decVideoLike=async(req,res,next)=>{
  const video_id=req.params.id
  try{
   await VideoUpload.findOneAndUpdate({_id:video_id},{$inc : {like:-1}});
   return res.status(200).json({status:200,msg:"Video unLiked"});
  }catch(err){
   return res.status(500).json({ message: 'Internal server error.' });
  }
}

//increment report count

const incVideoReport= async(req,res,next)=>{
  const video_id=req.params.id
  try{
   await VideoUpload.findOneAndUpdate({_id:video_id},{$inc : {report:1}});
   return res.status(200).json({status:200,msg:"Video reported"});
  }catch(err){
   return res.status(500).json({ message: 'Internal server error.' });
  }
}

//decrement report count
const decVideoReport= async(req,res,next)=>{
  const video_id=req.params.id
  try{
   await VideoUpload.findOneAndUpdate({_id:video_id},{$inc : {report:-1}},{returnNewDocument : true} );
   return res.status(200).json({status:200,msg:"Video reporting cancel"});
  }catch(err){
   return res.status(500).json({ message: 'Internal server error.' });
  }
}


module.exports = {
  UploadVideoData,
  moderationCallBack,
  getVideoData,
  getVideoList,
  deleteVideo,
  incVideoLike,
  decVideoLike,
  incVideoReport,
  decVideoReport
}
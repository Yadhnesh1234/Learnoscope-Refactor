const mongoose =require('mongoose')
const videoUploadSchema= new mongoose.Schema({
    title:String,          // Title of the video
    description: String,    // Description of the video
    filePath: String,       // Path to the stored video file on your server
    thumbnailPath:String,
    uploaderEmail: String, 
    uploadDate: Date,       // Date and time when the video was uploaded 
    tags: Array,        // An array of tags associated with the video
    like:Number,
    report:Number
})

const VideoUpload = mongoose.model("VideoUpload",videoUploadSchema);

module.exports=VideoUpload;

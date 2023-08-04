const User = require("../Models/Auth/user")

const addToBookMark=async(req,res,next)=>{
     const user_Id= req.params.id
     const {video_Id}=req.body
     try{
        await  User.findOneAndUpdate({
            _id:user_Id
        },{
            $addToSet:{
                bookmark:video_Id
            }
        })
        const data = await User.findById(user_Id)
        return res.status(200).send({data:data})
     }catch(err){
        return res.status(500).send({msg:"Internal Server Error"})
     }
    
}

const addToHistory=async(req,res,next)=>{
    const user_Id= req.params.id
    const {video_Id}=req.body
    try{
       await  User.findOneAndUpdate({
           _id:user_Id
       },{
           $addToSet:{
            historyVideo:video_Id
           }
       })
       const data = await User.findById(user_Id)
       return res.status(200).send({data:data})
    }catch(err){
       return res.status(500).send({msg:"Internal Server Error"})
    }
}

const removeFromBookMark=async(req,res,next)=>{
    const user_Id= req.params.id
    const {video_Id}=req.body
    try{
       await  User.findOneAndUpdate({
           _id:user_Id
       },{
           $pull:{
               bookmark:video_Id
           }
       })
       const data = await User.findById(user_Id)
       return res.status(200).send({data:data})
    }catch(err){
       return res.status(500).send({msg:"Internal Server Error"})
    }
   
}

const removeFromHistory=async(req,res,next)=>{
   const user_Id= req.params.id
   const {video_Id}=req.body
   try{
      await  User.findOneAndUpdate({
          _id:user_Id
      },{
          $pull:{
           historyVideo:video_Id
          }
      })
      const data = await User.findById(user_Id)
      return res.status(200).send({data:data})
   }catch(err){
    return res.status(500).send({msg:"Internal Server Error"})
   }
}
const removeFromYourVideo=async(req,res,next)=>{
    const user_Id= req.params.id
    const {video_Id}=req.body
    try{
       await  User.findOneAndUpdate({
           _id:user_Id
       },{
           $pull:{
            userUplodedVideo:video_Id
           }
       })
       const data = await User.findById(user_Id)
       return res.status(200).send({data:data})
    }catch(err){
        return res.status(500).send({msg:"Internal Server Error"})
    }
 }
 
 const getBookmarkVideoList= async(req,res)=>{
      const user_Id=req.params.id
      var user_bookmark_list;
      try{
        const projection={username:1}
        user_bookmark_list=await User.find({_id:user_Id},{bookmark:1})
        //only specific attribute of the schema
        return res.status(200).send({data:user_bookmark_list})
      }catch(err){
        return res.status(500).send({msg:"Internal Server Error"})
      }
 } 
 const getHistoryVideoList= async(req,res)=>{
    const user_Id=req.params.id
    var user_history_list;
    try{
      user_history_list=await User.find({_id:user_Id},{historyVideo:1})
      //only specific attribute of the schema
      return res.status(200).send({data:user_history_list})
    }catch(err){
      return res.status(500).send({msg:"Internal Server Error"})
    }
} 
const getYourVideoVideoList= async(req,res)=>{
    const user_Id=req.params.id
    var user_video_list;
    try{
        user_video_list=await User.find({_id:user_Id},{userUplodedVideo:1})
      //only specific attribute of the schema
      return res.status(200).send({data:user_video_list})
    }catch(err){
      return res.status(500).send({msg:"Internal Server Error"})
    }
}

module.exports={
    addToBookMark,
    addToHistory,
    removeFromBookMark,
    removeFromHistory,
    removeFromYourVideo,
    getBookmarkVideoList,
    getHistoryVideoList,
    getYourVideoVideoList
}
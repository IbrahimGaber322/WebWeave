import mongoose from "mongoose";

const replySchema = mongoose.Schema({
   name:String,
   message:String,
   createdAt: {
      type: Date,
      default: ()=> new Date()
     },
   avatar:String,
   creator:String,
   likes: {
    type: [String],
    default : [],
   }
})

const commentSchema = mongoose.Schema({
   name:String,
   message:String,
   createdAt: {
      type: Date,
      default: ()=> new Date()
     },
   avatar:String ,
   creator:String,
   likes: {
    type: [String],
    default : [],
   },
   replies:[replySchema] 
})

const postSchecma = mongoose.Schema({
   title: String,
   message: String,
   creator: String,
   name: String,
   avatar:String,
   tags: [String],
   selectedFile: String,
   likes: {
    type: [String],
    default : [],
   },
   createdAt: {
    type: Date,
    default: ()=> new Date()
   },
   comments:[commentSchema]
});

const Post = mongoose.model('Post', postSchecma);

export default Post ;
import mongoose from "mongoose";
import Post from "../models/posts.js";
import User from "../models/user.js";

export const getPosts = async(req, res) => {
    const {userEmail} =req;
    const { page } = req.query;
    try {
        const user = await User.findOne({email:userEmail});
        const LIMIT = 10;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await Post.countDocuments({$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]});
        const posts = await Post.find({$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]},{
            title:1,
            message:1,
            creator:1,
            name:1,
            avatar:1,
            tags:1,
            selectedFile:1,
            likes:1,
            createdAt:1}).sort({_id: -1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({posts:posts, currentPage:Number(page), numberOfPages: Math.ceil(total/LIMIT)});
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

export const getPost = async(req, res) => {
    const {userEmail} =req;
    const { id } = req.params;
    try {
        const user = await User.findOne({email:userEmail});
        const post = await Post.findOne({$and:[{_id:id},{$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]}]});
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

export const getPostsBySearch = async(req, res) => {
    const {userEmail} =req;
    const LIMIT = 10;
    const {searchQuery, searchTags, page} = req.query;
    
    const startIndex = (Number(page) - 1) * LIMIT;
    const tagsSet = searchTags !== "null"? searchTags?.includes(',') ? searchTags.split(',') : [searchTags]: null;
    const tags = tagsSet?.map((tag)=>new RegExp(tag, "i"));
    const currentPage = page? Number(page): null;
    const title= searchQuery !=="null"? new RegExp(searchQuery, "i"): null;  
    try {
        let total;
        let posts;
        const user = await User.findOne({email:userEmail});
       if(currentPage){
        if(tags && title){
            total = await Post.find({$and:[{title:title},{tags:{$all:tags}},{$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]}]}).countDocuments();
            posts = await Post.find({$and:[{title:title},{tags:{$all:tags}},{$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]}]},{
                title:1,
                message:1,
                creator:1,
                name:1,
                avatar:1,
                tags:1,
                selectedFile:1,
                likes:1,
                createdAt:1}).sort({_id: -1}).limit(LIMIT).skip(startIndex);
        }else if(title && !tags){
            total = await Post.countDocuments({$and:[{title:title},{$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]}]});
            posts = await Post.find({$and:[{title:title},{$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]}]}).sort({_id: -1}).limit(LIMIT).skip(startIndex);
        }else if(tags && !title){
            total = await Post.countDocuments({$and:[{tags:{$all:tags}},{$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]}]});
            posts = await Post.find({$and:[{tags:{$all:tags}},{$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]}]},{
                title:1,
                message:1,
                creator:1,
                name:1,
                avatar:1,
                tags:1,
                selectedFile:1,
                likes:1,
                createdAt:1}).sort({_id: -1}).limit(LIMIT).skip(startIndex);
        }
    }else if(!currentPage&&tags){
        posts = await Post.find({$and:[{tags:{$in:tags}},{$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]}]},{
            title:1,
            tags:1});
    }else{
        posts = await Post.find({$and:[{tags:{$all:tags}},{$or:[{creator:userEmail},{creator:"ibrahimseda322@gmail.com"},{creator:user.friends.map(friend=>friend.email)}]}]},{
            tags:1,
            title:1});
    }
        const numberOfPages = page !== "null"? Math.ceil(total/LIMIT) : null;
        res.status(200).json({posts:posts, currentPage:currentPage, numberOfPages: numberOfPages});
    } catch (error) {
        res.status(404).json({message:"no posts found"});
    }
}

export const createPosts = async(req, res) => {
    const {userEmail} =req;
    const post = req.body ;
    const newPost = new Post({...post, creator: userEmail, createdAt: new Date().toISOString()});
    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message:error.message});
    }
}

export const updatePost = async(req, res) => {
    const {userEmail} =req;
    const {id} = req.params;
    
    const post = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
    const updatedPost = await Post.findByIdAndUpdate(id, post, {new:true});

    res.json(updatedPost);
}

export const deletePost = async(req, res) => {
    const {userEmail} =req;
    const {id} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
    const updatedPost = await Post.findByIdAndRemove(id);

    res.json({message:"Post deleted successfully"});
}


export const likePost = async(req,res) => {
    const {userEmail} =req;
    const {id} = req.params;
   
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
    try {
        const post = await Post.findById(id, {likes:1});
        
        const index = post.likes.indexOf(userEmail);
        
        if(index ===-1){
            post.likes.push(userEmail);
           
        }else{
            post.likes.splice(index,1);
            
            
        }
       
        res.json(post);
        await post.save();
            
        
   
    } catch (error) {
        console.log(error);
    }
   
}

export const likeComment = async(req,res) => {
    const {userEmail} =req;
    
    const {postId,commentId} = req.params;
   
    if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send("No post with that id");
  
    try {
        const post = await Post.findById(
            postId,
            { comments: {$elemMatch: { _id: commentId}}}
          );
    
        const comments = post.comments;
        const comment = comments[0];
       
        const index = comment?.likes?.indexOf(userEmail)
      
         if(index ===-1){
            comment?.likes?.push(userEmail);
            comments.map(c=>c._id ==commentId? comment:c);
        }else{
            comment?.likes?.splice(index,1);
        }
       
        
        
        res.json({commentLikes:comment.likes, commentId});
        await post.save();
     
    
    } catch (error) {
        console.log(error);
    }
   
}

export const likeReply = async(req,res) => {
    const {userEmail} =req;
    
    const {postId,commentId,replyId} = req.params;
    if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send("No post with that id");
    try {
        const post = await Post.findById(
            postId,
            { comments: {$elemMatch: { _id: commentId}}}
          );
          const comments = post.comments;
        const comment = comments[0];
        const reply = comment.replies.find(r=>r._id == replyId);
        const index = reply?.likes?.indexOf(userEmail);
        if(index ===-1){
            reply.likes.push(userEmail);
       }else{
           reply.likes.splice(index, 1);
       }
   
       
       res.json({replyLikes:reply.likes,commentId,replyId});
       await post.save();
    
    } catch (error) {
        console.log(error);
    } 

}

export const commentPost = async(req,res) => {
    
    const {id} = req.params;
    const comment = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
    const post = await Post.findById(id);
    post.comments.push({...comment, createdAt: new Date().toISOString()});
    const updatedPost = await Post.findByIdAndUpdate(id, post, {new:true});
   res.json(updatedPost);

}

export const deleteComment = async(req, res) => {
    
    const {postId, commentId} = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send("No post with that id");
    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { comments: {_id :commentId} },
        },
        { new: true }
      );

    res.json(updatedPost);
}

export const addReply = async(req,res) => {
    
    const {postId,commentId} = req.params;
    const reply = req.body;
    if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send("No post with that id");
    const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, 'comments._id': commentId },
        { $push: { 'comments.$.replies': { ...reply, createdAt: new Date().toISOString() } } },
        { new: true });
   res.json(updatedPost);

}

export const deleteReply = async(req,res) => {
    
    const {postId,commentId,replyId} = req.params;
    const reply = req.body;
    if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send("No post with that id");
    const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, 'comments._id': commentId },
        { $pull: { 'comments.$.replies': { _id: replyId } } },
        { new: true });
   res.json(updatedPost);

}
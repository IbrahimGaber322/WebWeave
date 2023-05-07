import express from "express";
import { getPosts, createPosts, updatePost, deletePost, likePost, getPostsBySearch, getPost, commentPost, deleteComment, addReply, deleteReply, likeComment, likeReply } from "../controllers/posts.js";

import user from "../middleware/user.js";

const router = express.Router();

router.get('/getPosts',user, getPosts);
router.get('/post/:id',user, getPost);
router.get('/search',user,getPostsBySearch);
router.post('/', user, createPosts);
router.patch('/:id/commentPost', user, commentPost);
router.patch('/:id',user, updatePost);
router.delete('/post/:id',user, deletePost);
router.patch('/reply/:postId/:commentId', user, addReply);
router.delete('/deleteReply/:postId/:commentId/:replyId', user, deleteReply);
router.delete('/comment/:postId/:commentId',user, deleteComment);
router.patch('/likePost/:id',user, likePost);
router.patch('/likeComment/:postId/:commentId',user, likeComment);
router.patch('/likeReply/:postId/:commentId/:replyId',user, likeReply);

export default router;


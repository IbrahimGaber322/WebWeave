import express from "express";
import { getPosts, createPosts, updatePost, deletePost, likePost, getPostsBySearch, getPost, commentPost, deleteComment, addReply, deleteReply, likeComment, likeReply } from "../controllers/posts.js";
import user from "../middleware/user.js";
import {
    createPostValidation,
    updatePostValidation,
    getPostValidation,
    deletePostValidation,
    searchPostsValidation,
    commentValidation,
    deleteCommentValidation,
    replyValidation,
    deleteReplyValidation,
    likePostValidation,
    likeCommentValidation,
    likeReplyValidation,
    getPostsValidation
} from "../middleware/validators/postValidators.js";

const router = express.Router();

router.get('/getPosts', user, getPostsValidation, getPosts);
router.get('/post/:id', user, getPostValidation, getPost);
router.get('/search', user, searchPostsValidation, getPostsBySearch);
router.post('/', user, createPostValidation, createPosts);
router.patch('/:id/commentPost', user, commentValidation, commentPost);
router.patch('/:id', user, updatePostValidation, updatePost);
router.delete('/post/:id', user, deletePostValidation, deletePost);
router.patch('/reply/:postId/:commentId', user, replyValidation, addReply);
router.delete('/deleteReply/:postId/:commentId/:replyId', user, deleteReplyValidation, deleteReply);
router.delete('/comment/:postId/:commentId', user, deleteCommentValidation, deleteComment);
router.patch('/likePost/:id', user, likePostValidation, likePost);
router.patch('/likeComment/:postId/:commentId', user, likeCommentValidation, likeComment);
router.patch('/likeReply/:postId/:commentId/:replyId', user, likeReplyValidation, likeReply);

export default router;


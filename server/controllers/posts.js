import mongoose from "mongoose";
import Post from "../models/posts.js";
import User from "../models/user.js";
import logger from '../utils/logger.js';

export const getPosts = async (req, res) => {
    const { userEmail } = req;
    const { page } = req.query;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const LIMIT = 10;
        const startIndex = (Number(page) - 1) * LIMIT;
        const friendEmails = user.friends.map(friend => friend.email);

        const query = {
            $or: [
                { creator: userEmail },
                { creator: { $in: friendEmails } }
            ]
        };

        const total = await Post.countDocuments(query);
        const posts = await Post.find(query, {
            title: 1,
            message: 1,
            creator: 1,
            name: 1,
            avatar: 1,
            tags: 1,
            selectedFile: 1,
            likes: 1,
            createdAt: 1
        }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        return res.status(200).json({
            success: true,
            posts: posts,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / LIMIT)
        });

    } catch (error) {
        logger.error('Get posts error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching posts."
        });
    }
};

export const getPost = async (req, res) => {
    const { userEmail } = req;
    const { id } = req.params;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const friendEmails = user.friends.map(friend => friend.email);
        const post = await Post.findOne({
            _id: id,
            $or: [
                { creator: userEmail },
                { creator: { $in: friendEmails } }
            ]
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found or you don't have permission to view it."
            });
        }

        return res.status(200).json({
            success: true,
            ...post.toObject()
        });

    } catch (error) {
        logger.error('Get post error', { error: error.message, stack: error.stack, postId: id });
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the post."
        });
    }
};

export const getPostsBySearch = async (req, res) => {
    const { userEmail } = req;
    const LIMIT = 10;
    const { searchQuery, searchTags, page } = req.query;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const startIndex = (Number(page) - 1) * LIMIT;
        const tagsSet = searchTags !== "null" ? searchTags?.includes(',') ? searchTags.split(',') : [searchTags] : null;
        const tags = tagsSet?.map((tag) => new RegExp(tag, "i"));
        const currentPage = page ? Number(page) : null;
        const title = searchQuery !== "null" ? new RegExp(searchQuery, "i") : null;

        const friendEmails = user.friends.map(friend => friend.email);
        const creatorQuery = {
            $or: [
                { creator: userEmail },
                { creator: { $in: friendEmails } }
            ]
        };

        let total;
        let posts;

        if (currentPage) {
            if (tags && title) {
                total = await Post.find({ $and: [{ title: title }, { tags: { $all: tags } }, creatorQuery] }).countDocuments();
                posts = await Post.find({ $and: [{ title: title }, { tags: { $all: tags } }, creatorQuery] }, {
                    title: 1,
                    message: 1,
                    creator: 1,
                    name: 1,
                    avatar: 1,
                    tags: 1,
                    selectedFile: 1,
                    likes: 1,
                    createdAt: 1
                }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
            } else if (title && !tags) {
                total = await Post.countDocuments({ $and: [{ title: title }, creatorQuery] });
                posts = await Post.find({ $and: [{ title: title }, creatorQuery] }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
            } else if (tags && !title) {
                total = await Post.countDocuments({ $and: [{ tags: { $all: tags } }, creatorQuery] });
                posts = await Post.find({ $and: [{ tags: { $all: tags } }, creatorQuery] }, {
                    title: 1,
                    message: 1,
                    creator: 1,
                    name: 1,
                    avatar: 1,
                    tags: 1,
                    selectedFile: 1,
                    likes: 1,
                    createdAt: 1
                }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
            }
        } else if (!currentPage && tags) {
            posts = await Post.find({ $and: [{ tags: { $in: tags } }, creatorQuery] }, {
                title: 1,
                tags: 1
            });
        } else {
            posts = await Post.find({ $and: [{ tags: { $all: tags } }, creatorQuery] }, {
                tags: 1,
                title: 1
            });
        }

        const numberOfPages = page !== "null" ? Math.ceil(total / LIMIT) : null;

        return res.status(200).json({
            success: true,
            posts: posts,
            currentPage: currentPage,
            numberOfPages: numberOfPages
        });

    } catch (error) {
        logger.error('Search posts error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred while searching posts."
        });
    }
};

export const createPosts = async (req, res) => {
    const { userEmail } = req;
    const post = req.body;

    try {
        const newPost = new Post({
            ...post,
            creator: userEmail,
            createdAt: new Date().toISOString()
        });

        await newPost.save();

        logger.info('Post created', { postId: newPost._id, creator: userEmail });
        return res.status(201).json({
            success: true,
            ...newPost.toObject()
        });

    } catch (error) {
        logger.error('Create post error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the post."
        });
    }
};

export const updatePost = async (req, res) => {
    const { userEmail } = req;
    const { id } = req.params;
    const post = req.body;

    try {
        const existingPost = await Post.findById(id);

        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        if (existingPost.creator !== userEmail) {
            logger.warn('Unauthorized post update attempt', { postId: id, userEmail });
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this post."
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

        logger.info('Post updated', { postId: id, userEmail });
        return res.status(200).json({
            success: true,
            ...updatedPost.toObject()
        });

    } catch (error) {
        logger.error('Update post error', { error: error.message, stack: error.stack, postId: id });
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the post."
        });
    }
};

export const deletePost = async (req, res) => {
    const { userEmail } = req;
    const { id } = req.params;

    try {
        const existingPost = await Post.findById(id);

        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        if (existingPost.creator !== userEmail) {
            logger.warn('Unauthorized post delete attempt', { postId: id, userEmail });
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post."
            });
        }

        await Post.findByIdAndDelete(id);

        logger.info('Post deleted', { postId: id, userEmail });
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully."
        });

    } catch (error) {
        logger.error('Delete post error', { error: error.message, stack: error.stack, postId: id });
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the post."
        });
    }
};

export const likePost = async (req, res) => {
    const { userEmail } = req;
    const { id } = req.params;

    try {
        const post = await Post.findById(id, { likes: 1 });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        const index = post.likes.indexOf(userEmail);

        if (index === -1) {
            post.likes.push(userEmail);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            _id: post._id,
            likes: post.likes
        });

    } catch (error) {
        logger.error('Like post error', { error: error.message, stack: error.stack, postId: id });
        return res.status(500).json({
            success: false,
            message: "An error occurred while liking the post."
        });
    }
};

export const likeComment = async (req, res) => {
    const { userEmail } = req;
    const { postId, commentId } = req.params;

    try {
        const post = await Post.findById(
            postId,
            { comments: { $elemMatch: { _id: commentId } } }
        );

        if (!post || !post.comments || post.comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        const comment = post.comments[0];
        const index = comment?.likes?.indexOf(userEmail);

        if (index === -1) {
            comment?.likes?.push(userEmail);
        } else {
            comment?.likes?.splice(index, 1);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            commentLikes: comment.likes,
            commentId
        });

    } catch (error) {
        logger.error('Like comment error', { error: error.message, stack: error.stack, postId, commentId });
        return res.status(500).json({
            success: false,
            message: "An error occurred while liking the comment."
        });
    }
};

export const likeReply = async (req, res) => {
    const { userEmail } = req;
    const { postId, commentId, replyId } = req.params;

    try {
        const post = await Post.findById(
            postId,
            { comments: { $elemMatch: { _id: commentId } } }
        );

        if (!post || !post.comments || post.comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        const comment = post.comments[0];
        const reply = comment.replies.find(r => r._id.toString() === replyId);

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found."
            });
        }

        const index = reply?.likes?.indexOf(userEmail);

        if (index === -1) {
            reply.likes.push(userEmail);
        } else {
            reply.likes.splice(index, 1);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            replyLikes: reply.likes,
            commentId,
            replyId
        });

    } catch (error) {
        logger.error('Like reply error', { error: error.message, stack: error.stack, postId, commentId, replyId });
        return res.status(500).json({
            success: false,
            message: "An error occurred while liking the reply."
        });
    }
};

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const comment = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        post.comments.push({ ...comment, createdAt: new Date().toISOString() });
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

        logger.info('Comment added', { postId: id });
        return res.status(200).json({
            success: true,
            ...updatedPost.toObject()
        });

    } catch (error) {
        logger.error('Comment post error', { error: error.message, stack: error.stack, postId: id });
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the comment."
        });
    }
};

export const deleteComment = async (req, res) => {
    const { userEmail } = req;
    const { postId, commentId } = req.params;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        if (comment.creator !== userEmail && post.creator !== userEmail) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment."
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        logger.info('Comment deleted', { postId, commentId });
        return res.status(200).json({
            success: true,
            ...updatedPost.toObject()
        });

    } catch (error) {
        logger.error('Delete comment error', { error: error.message, stack: error.stack, postId, commentId });
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the comment."
        });
    }
};

export const addReply = async (req, res) => {
    const { postId, commentId } = req.params;
    const reply = req.body;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId, 'comments._id': commentId },
            { $push: { 'comments.$.replies': { ...reply, createdAt: new Date().toISOString() } } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        logger.info('Reply added', { postId, commentId });
        return res.status(200).json({
            success: true,
            ...updatedPost.toObject()
        });

    } catch (error) {
        logger.error('Add reply error', { error: error.message, stack: error.stack, postId, commentId });
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the reply."
        });
    }
};

export const deleteReply = async (req, res) => {
    const { userEmail } = req;
    const { postId, commentId, replyId } = req.params;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId, 'comments._id': commentId },
            { $pull: { 'comments.$.replies': { _id: replyId } } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        logger.info('Reply deleted', { postId, commentId, replyId });
        return res.status(200).json({
            success: true,
            ...updatedPost.toObject()
        });

    } catch (error) {
        logger.error('Delete reply error', { error: error.message, stack: error.stack, postId, commentId, replyId });
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the reply."
        });
    }
};

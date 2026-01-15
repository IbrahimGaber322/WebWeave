import {
    FETCH_ALL,
    FETCH_BY_SEARCH,
    CREATE,
    UPDATE,
    DELETE,
    START_LOADING,
    FETCH_POST,
    SIGNOUT,
    LIKE_POST,
    LIKE_COMMENT,
    LIKE_REPLY,
} from "../constants/actionTypes";

import * as api from "../api";
import { showSuccess, showError } from "../utils/notificationService";
import logger from "../utils/logger";

export const getPosts = (page) => async (dispatch) => {
    dispatch({ type: START_LOADING });
    try {
        const { data } = await api.fetchPosts(page);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
            }
            return;
        }

        dispatch({ type: FETCH_ALL, payload: data });
    } catch (error) {
        logger.error("Get posts error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to load posts");
        }
    }
};

export const getPost = (id) => async (dispatch) => {
    dispatch({ type: START_LOADING });
    try {
        const { data } = await api.fetchPost(id);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
            }
            return;
        }

        dispatch({ type: FETCH_POST, payload: data });
    } catch (error) {
        logger.error("Get post error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to load post");
        }
    }
};

export const getPostsBySearch = (search, page) => async (dispatch) => {
    dispatch({ type: START_LOADING });
    try {
        const { data } = await api.getPostsBySearch(search, page);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
            }
            return;
        }

        dispatch({ type: FETCH_BY_SEARCH, payload: data });
    } catch (error) {
        logger.error("Search posts error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Search failed");
        }
    }
};

export const createPost = (post, navigate) => async (dispatch) => {
    try {
        const { data } = await api.createPost(post);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
            } else {
                showError(data.message || "Failed to create post");
            }
            return;
        }

        dispatch({ type: CREATE, payload: data });
        showSuccess("Post created successfully!");
        if (navigate) navigate("/posts?page=1");
    } catch (error) {
        logger.error("Create post error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to create post");
        }
    }
};

export const updatePost = (id, post) => async (dispatch) => {
    try {
        const { data } = await api.updatePost(id, post);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
            } else {
                showError(data.message || "Failed to update post");
            }
            return;
        }

        dispatch({ type: UPDATE, payload: data });
        showSuccess("Post updated successfully!");
    } catch (error) {
        logger.error("Update post error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to update post");
        }
    }
};

export const deletePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.deletePost(id);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
            } else {
                showError(data.message || "Failed to delete post");
            }
            return;
        }

        dispatch({ type: DELETE, payload: id });
        showSuccess("Post deleted successfully!");
    } catch (error) {
        logger.error("Delete post error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to delete post");
        }
    }
};

export const deleteComment = (postId, commentId) => async (dispatch) => {
    try {
        const { data } = await api.deleteComment(postId, commentId);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
            } else {
                showError(data.message || "Failed to delete comment");
            }
            return;
        }

        dispatch({ type: UPDATE, payload: data });
        showSuccess("Comment deleted");
    } catch (error) {
        logger.error("Delete comment error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to delete comment");
        }
    }
};

export const likePost = (id, navigate) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
                if (navigate) navigate("/signin");
            }
            return;
        }

        dispatch({ type: LIKE_POST, payload: data });
    } catch (error) {
        logger.error("Like post error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
            if (navigate) navigate("/signin");
        }
    }
};

export const likeComment = (postId, commentId, navigate) => async (dispatch) => {
    try {
        const { data } = await api.likeComment(postId, commentId);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
                if (navigate) navigate("/signin");
            }
            return;
        }

        dispatch({ type: LIKE_COMMENT, payload: data });
    } catch (error) {
        logger.error("Like comment error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
            if (navigate) navigate("/signin");
        }
    }
};

export const likeReply = (postId, commentId, replyId, navigate) => async (dispatch) => {
    try {
        const { data } = await api.likeReply(postId, commentId, replyId);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
                if (navigate) navigate("/signin");
            }
            return;
        }

        dispatch({ type: LIKE_REPLY, payload: data });
    } catch (error) {
        logger.error("Like reply error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
            if (navigate) navigate("/signin");
        }
    }
};

export const commentPost = (comment, id) => async (dispatch) => {
    dispatch({ type: START_LOADING });
    try {
        const { data } = await api.commentPost(comment, id);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
            } else {
                showError(data.message || "Failed to add comment");
            }
            return;
        }

        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        logger.error("Comment post error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to add comment");
        }
    }
};

export const addReply = (postId, commentId, reply) => async (dispatch) => {
    dispatch({ type: START_LOADING });
    try {
        const { data } = await api.addReply(postId, commentId, reply);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
            } else {
                showError(data.message || "Failed to add reply");
            }
            return;
        }

        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        logger.error("Add reply error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to add reply");
        }
    }
};

export const deleteReply = (postId, commentId, replyId) => async (dispatch) => {
    dispatch({ type: START_LOADING });
    try {
        const { data } = await api.deleteReply(postId, commentId, replyId);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
            } else {
                showError(data.message || "Failed to delete reply");
            }
            return;
        }

        dispatch({ type: UPDATE, payload: data });
        showSuccess("Reply deleted");
    } catch (error) {
        logger.error("Delete reply error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to delete reply");
        }
    }
};

import { SIGNUP, SIGNIN, SIGNOUT, EDITPROFILE, REFRESH_USER, GET_OTHER_USER } from "../constants/actionTypes";
import { socket } from "../socket";
import * as api from "../api";
import { showSuccess, showError, showInfo } from "../utils/notificationService";
import logger from "../utils/logger";

export const signOut = (navigate) => async (dispatch) => {
    try {
        dispatch({ type: SIGNOUT });
        showInfo("You have been signed out");
        navigate("/signin");
    } catch (error) {
        logger.error("Sign out error:", error);
    }
};

export const refreshUser = (data) => async (dispatch) => {
    try {
        dispatch({ type: REFRESH_USER, payload: data });
    } catch (error) {
        logger.error("Refresh user error:", error);
    }
};

export const signUp = (user, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(user);

        if (data?.success === false) {
            showError(data.message || "Sign up failed");
            return;
        }

        if (data.token) {
            dispatch({ type: SIGNUP, payload: data });
            socket.emit("signUser", data?.email);
            showSuccess("Welcome! Account created successfully");
            navigate("/posts?page=1");
        } else {
            showInfo("Please check your email to confirm your account");
            navigate("/confirmEmail");
        }
    } catch (error) {
        logger.error("Sign up error:", error);
        const message = error.response?.data?.message || "Sign up failed. Please try again.";
        showError(message);
    }
};

export const confirmEmail = (token, navigate) => async (dispatch) => {
    try {
        const { data } = await api.confirmEmail(token);

        if (data?.success === false) {
            showError(data.message || "Email confirmation failed");
            return;
        }

        dispatch({ type: SIGNUP, payload: data });
        socket.emit("signUser", data?.email);
        showSuccess("Email confirmed! Welcome to WebWeave");
        navigate("/posts?page=1");
    } catch (error) {
        logger.error("Confirm email error:", error);
        const message = error.response?.data?.message || "Email confirmation failed";
        showError(message);
    }
};

export const signIn = (user, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(user);

        if (data?.success === false) {
            showError(data.message || "Sign in failed");
            return;
        }

        if (data?.confirmed) {
            dispatch({ type: SIGNIN, payload: data });
            socket.emit("signUser", data?.email);
            showSuccess("Welcome back!");
            navigate("/posts?page=1");
        } else {
            showInfo("Please check your email to confirm your account");
            navigate("/confirmEmail");
        }
    } catch (error) {
        logger.error("Sign in error:", error);
        const message = error.response?.data?.message || "Sign in failed. Please check your credentials.";
        showError(message);
    }
};

export const editProfile = (editInfo, navigate) => async (dispatch) => {
    try {
        const { data } = await api.editProfile(editInfo);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated") || data.message?.includes("unauthorized")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
                navigate("/signin");
                return;
            }
            showError(data.message || "Failed to update profile");
            return;
        }

        dispatch({ type: EDITPROFILE, payload: data });
        showSuccess("Profile updated successfully");
        navigate("/posts?page=1");
    } catch (error) {
        logger.error("Edit profile error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
            navigate("/signin");
        } else {
            showError(error.response?.data?.message || "Failed to update profile");
        }
    }
};

export const addFriend = (friendEmail) => async (dispatch) => {
    try {
        const { data } = await api.addFriend(friendEmail);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
                return;
            }
            showError(data.message || "Failed to add friend");
            return;
        }

        if (data.message === "Friend request sent.") {
            showSuccess("Friend request sent!");
        } else if (data.message === "Already friends.") {
            showInfo("You are already friends");
        } else if (data.token) {
            dispatch({ type: EDITPROFILE, payload: data });
            showSuccess("Friend added!");
        }
    } catch (error) {
        logger.error("Add friend error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to add friend");
        }
    }
};

export const removeFriend = (friendEmail) => async (dispatch) => {
    try {
        const { data } = await api.removeFriend(friendEmail);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
                return;
            }
            showError(data.message || "Failed to remove friend");
            return;
        }

        dispatch({ type: EDITPROFILE, payload: data });
        showSuccess("Friend removed");
    } catch (error) {
        logger.error("Remove friend error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to remove friend");
        }
    }
};

export const getOtherUser = (otherUserEmail) => async (dispatch) => {
    try {
        const { data } = await api.getOtherUser(otherUserEmail);

        if (data?.success === false) {
            showError(data.message || "User not found");
            return;
        }

        dispatch({ type: GET_OTHER_USER, payload: data });
    } catch (error) {
        logger.error("Get other user error:", error);
        showError(error.response?.data?.message || "Failed to load user profile");
    }
};

export const forgotPassword = (userEmail, navigate) => async (dispatch) => {
    try {
        const { data } = await api.forgotPassword(userEmail);

        if (data?.success === false) {
            showError(data.message || "Failed to send reset email");
            return;
        }

        showSuccess("Password reset link sent to your email");
        navigate("/resetpassword");
    } catch (error) {
        logger.error("Forgot password error:", error);
        showError(error.response?.data?.message || "Failed to send reset email");
    }
};

export const resetPassword = (userData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.resetPassword(userData);

        if (data?.success === false) {
            showError(data.message || "Password reset failed");
            return;
        }

        showSuccess("Password reset successfully. Please sign in.");
        navigate("/signin");
    } catch (error) {
        logger.error("Reset password error:", error);
        showError(error.response?.data?.message || "Password reset failed");
    }
};

export const feedback = (feedbackData) => async (dispatch) => {
    try {
        const { data } = await api.feedback(feedbackData);

        if (data?.success === false) {
            showError(data.message || "Failed to send feedback");
            return;
        }

        showSuccess("Thank you for your feedback!");
    } catch (error) {
        logger.error("Feedback error:", error);
        showError(error.response?.data?.message || "Failed to send feedback");
    }
};

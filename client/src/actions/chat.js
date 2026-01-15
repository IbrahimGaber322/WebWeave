import * as api from "../api";
import {
    FETCH_CONVERSATIONS,
    SET_ACTIVE_CONVERSATION,
    FETCH_MESSAGES,
    FETCH_MORE_MESSAGES,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    MARK_AS_READ,
    SET_UNREAD_COUNT,
    SET_TYPING,
    CLEAR_TYPING,
    SET_ONLINE_STATUS,
    CHAT_LOADING,
    CHAT_ERROR,
    CLEAR_CHAT,
    SIGNOUT
} from "../constants/actionTypes";
import { showError } from "../utils/notificationService";
import logger from "../utils/logger";

export const fetchConversations = () => async (dispatch) => {
    try {
        dispatch({ type: CHAT_LOADING, payload: true });
        const { data } = await api.getConversations();

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
                return;
            }
            showError(data.message || "Failed to load conversations");
            dispatch({ type: CHAT_ERROR, payload: data.message });
            return;
        }

        dispatch({ type: FETCH_CONVERSATIONS, payload: data.conversations });
    } catch (error) {
        logger.error("Fetch conversations error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            dispatch({ type: CHAT_ERROR, payload: error.message });
        }
    }
};

export const openConversation = (friendEmail) => async (dispatch) => {
    try {
        dispatch({ type: CHAT_LOADING, payload: true });
        const { data } = await api.getOrCreateConversation(friendEmail);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
                return;
            }
            showError(data.message || "Failed to open conversation");
            dispatch({ type: CHAT_ERROR, payload: data.message });
            return;
        }

        dispatch({ type: SET_ACTIVE_CONVERSATION, payload: data.conversation });
        dispatch(fetchMessages(data.conversation._id));
        dispatch(markMessagesAsRead(data.conversation._id));
    } catch (error) {
        logger.error("Open conversation error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError(error.response?.data?.message || "Failed to open conversation");
            dispatch({ type: CHAT_ERROR, payload: error.message });
        }
    }
};

export const fetchMessages = (conversationId, page = 1) => async (dispatch) => {
    try {
        dispatch({ type: CHAT_LOADING, payload: true });
        const { data } = await api.getMessages(conversationId, page);

        if (data?.success === false) {
            showError(data.message || "Failed to load messages");
            dispatch({ type: CHAT_ERROR, payload: data.message });
            return;
        }

        const actionType = page === 1 ? FETCH_MESSAGES : FETCH_MORE_MESSAGES;
        dispatch({
            type: actionType,
            payload: {
                messages: data.messages,
                hasMore: data.hasMore,
                currentPage: data.currentPage
            }
        });
    } catch (error) {
        logger.error("Fetch messages error:", error);
        dispatch({ type: CHAT_ERROR, payload: error.message });
    }
};

export const sendChatMessage = (conversationId, content) => async (dispatch) => {
    try {
        const { data } = await api.sendMessage(conversationId, content);

        if (data?.success === false) {
            if (data.message?.includes("Unauthenticated")) {
                dispatch({ type: SIGNOUT });
                showError("Session expired. Please sign in again.");
                return;
            }
            showError(data.message || "Failed to send message");
            return;
        }

        dispatch({ type: SEND_MESSAGE, payload: data.message });
    } catch (error) {
        logger.error("Send message error:", error);
        if (error.response?.status === 401) {
            dispatch({ type: SIGNOUT });
            showError("Session expired. Please sign in again.");
        } else {
            showError("Failed to send message");
        }
    }
};

export const receiveMessage = (message) => (dispatch) => {
    dispatch({ type: RECEIVE_MESSAGE, payload: message });
};

export const markMessagesAsRead = (conversationId) => async (dispatch) => {
    try {
        await api.markAsRead(conversationId);
        dispatch({ type: MARK_AS_READ, payload: { conversationId } });
        dispatch(fetchUnreadCount());
    } catch (error) {
        logger.error("Mark as read error:", error);
    }
};

export const fetchUnreadCount = () => async (dispatch) => {
    try {
        const { data } = await api.getUnreadCount();
        if (data?.success) {
            dispatch({ type: SET_UNREAD_COUNT, payload: data.unreadCount });
        }
    } catch (error) {
        logger.error("Fetch unread count error:", error);
    }
};

export const setTyping = (conversationId) => (dispatch) => {
    dispatch({ type: SET_TYPING, payload: conversationId });
};

export const clearTyping = (conversationId) => (dispatch) => {
    dispatch({ type: CLEAR_TYPING, payload: conversationId });
};

export const setOnlineStatus = (email, isOnline) => (dispatch) => {
    dispatch({ type: SET_ONLINE_STATUS, payload: { email, isOnline } });
};

export const closeConversation = () => (dispatch) => {
    dispatch({ type: SET_ACTIVE_CONVERSATION, payload: null });
};

export const clearChat = () => (dispatch) => {
    dispatch({ type: CLEAR_CHAT });
};

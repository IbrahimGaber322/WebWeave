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
    CLEAR_CHAT
} from "../constants/actionTypes";

const initialState = {
    conversations: [],
    activeConversation: null,
    messages: [],
    hasMoreMessages: true,
    currentPage: 1,
    totalUnreadCount: 0,
    typingUsers: {}, // { conversationId: true }
    onlineUsers: {}, // { email: true/false }
    isLoading: false,
    error: null
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHAT_LOADING:
            return { ...state, isLoading: action.payload };

        case CHAT_ERROR:
            return { ...state, error: action.payload, isLoading: false };

        case FETCH_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload,
                isLoading: false
            };

        case SET_ACTIVE_CONVERSATION:
            return {
                ...state,
                activeConversation: action.payload,
                messages: [],
                hasMoreMessages: true,
                currentPage: 1
            };

        case FETCH_MESSAGES:
            return {
                ...state,
                messages: action.payload.messages,
                hasMoreMessages: action.payload.hasMore,
                currentPage: action.payload.currentPage,
                isLoading: false
            };

        case FETCH_MORE_MESSAGES:
            return {
                ...state,
                messages: [...action.payload.messages, ...state.messages],
                hasMoreMessages: action.payload.hasMore,
                currentPage: action.payload.currentPage,
                isLoading: false
            };

        case SEND_MESSAGE:
        case RECEIVE_MESSAGE:
            // Avoid duplicates
            if (state.messages.some(m => m._id === action.payload._id)) {
                return state;
            }
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };

        case MARK_AS_READ:
            return {
                ...state,
                conversations: state.conversations.map(conv =>
                    conv._id === action.payload.conversationId
                        ? { ...conv, unreadCount: 0 }
                        : conv
                )
            };

        case SET_UNREAD_COUNT:
            return {
                ...state,
                totalUnreadCount: action.payload
            };

        case SET_TYPING:
            return {
                ...state,
                typingUsers: {
                    ...state.typingUsers,
                    [action.payload]: true
                }
            };

        case CLEAR_TYPING: {
            const { [action.payload]: _, ...remainingTyping } = state.typingUsers;
            return {
                ...state,
                typingUsers: remainingTyping
            };
        }

        case SET_ONLINE_STATUS:
            return {
                ...state,
                onlineUsers: {
                    ...state.onlineUsers,
                    [action.payload.email]: action.payload.isOnline
                }
            };

        case CLEAR_CHAT:
            return {
                ...initialState,
                onlineUsers: state.onlineUsers // Keep online status
            };

        default:
            return state;
    }
};

export default chatReducer;

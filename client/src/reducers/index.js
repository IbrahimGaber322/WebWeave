import {combineReducers} from "redux";
import postsReducer from "./posts";
import userReducer from "./user";
import otherUserReducer from "./otherUser";
import chatReducer from "./chat";

export default combineReducers({
    posts: postsReducer,
    user: userReducer,
    otherUser: otherUserReducer,
    chat: chatReducer
});
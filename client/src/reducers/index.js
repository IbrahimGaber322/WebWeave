import {combineReducers} from "redux";
import postsReducer from "./posts";
import userReducer from "./user";
import otherUserReducer from "./otherUser";

export default combineReducers( {posts:postsReducer, user:userReducer,otherUser:otherUserReducer});
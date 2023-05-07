import axios from "axios";
import store from "../store/store";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const API = axios.create({baseURL:SERVER_URL});
const GetUser = ()=>{
     const user = store.getState().user;
    return user;
}
API.interceptors.request.use((req)=>{
    const user = GetUser();
    if(user?.token){
        req.headers.Authorization = `Bearer ${user?.token}`
    }
  
    return req ;
});

export const fetchPosts = (page) => API.get(`/posts/getPosts?page=${page}`); 
export const fetchPost = (id) => API.get(`/posts/post/${id}`); 
export const getPostsBySearch = (search,page) => API.get(`/posts/search?searchQuery=${search.searchQuery}&searchTags=${search.searchTags}&page=${page}`); 
export const createPost = (newPost) => API.post("/posts", newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/post/${id}`);
export const deleteComment = (postId,commentId) => API.delete(`/posts/comment/${postId}/${commentId}`);
export const likePost = (id) => API.patch(`/posts/likePost/${id}`);
export const likeComment = (postId,commentId) => API.patch(`/posts/likeComment/${postId}/${commentId}`);
export const likeReply = (postId,commentId,replyId) => API.patch(`/posts/likeReply/${postId}/${commentId}/${replyId}`);
export const commentPost = (comment,id) => API.patch(`/posts/${id}/commentPost`, comment);

export const addReply = (postId,commentId,reply) => API.patch(`/posts/reply/${postId}/${commentId}`, reply);
export const deleteReply = (postId,commentId,replyId) => API.delete(`/posts/deleteReply/${postId}/${commentId}/${replyId}`);

export const signUp = (newUser) => API.post(`/user/signUp`, newUser);
export const signIn = (user) => API.post(`/user/signIn`, user);
export const getOtherUser = (otherUserEmail) => API.get(`/user/getOtherUser/${otherUserEmail}`);
export const editProfile = (user) => API.post(`/user/editProfile`, user);
export const confirmEmail = (token) => API.get(`/user/confirmEmail/${token}`);
export const addFriend = (friendEmail) => API.post('/user/addFriend', friendEmail);
export const removeFriend = (friendEmail) => API.post('/user/removeFriend', friendEmail);
export const forgotPassword = (userEmail) => API.post('user/forgotPassword', userEmail);
export const resetPassword = (userData) => API.post('user/resetPassword', userData);
export const feedback = (feedback) => API.post('user/feedback', feedback);

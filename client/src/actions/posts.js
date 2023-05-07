import { FETCH_ALL, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, START_LOADING, FETCH_POST, SIGNOUT, LIKE_POST, LIKE_COMMENT, LIKE_REPLY} from "../constants/actionTypes";

import * as api from "../api";


export const getPosts = (page) => async (dispatch) => {
  dispatch({type: START_LOADING});
  try {
    
    const { data } = await api.fetchPosts(page);
    dispatch({ type: FETCH_ALL, payload: data });
   
  } catch (error) {
    console.log(error);
  }
};

export const getPost = (id) => async (dispatch) => {
  dispatch({type: START_LOADING});
  try {
    
    const { data } = await api.fetchPost(id);
    dispatch({ type: FETCH_POST, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getPostsBySearch = (search,page) => async (dispatch) => {
  dispatch({type: START_LOADING});
  try {
    
    
    const  {data}  = await api.getPostsBySearch(search,page);
    dispatch({ type: FETCH_BY_SEARCH, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    
    const { data } = await api.createPost(post);

    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
    }else{
      dispatch({ type: CREATE, payload: data });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id,post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id,post);
    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
    }else{
    dispatch({ type: UPDATE, payload: data });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
 try {
  const {data} = await api.deletePost(id);
  if(data === "Unauthinticated"){
    dispatch({type: SIGNOUT});
  }else{
  dispatch({type: DELETE, payload: id});
  }
 } catch (error) {
  console.log(error);
 }
}

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
   const {data} = await api.deleteComment(postId, commentId);
   if(data === "Unauthinticated"){
     dispatch({type: SIGNOUT});
   }else{
   dispatch({type: UPDATE, payload: data});
   }
  } catch (error) {
   console.log(error);
  }
 }

export const likePost = (id, navigate) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
      navigate("/signin");
    }else{
      dispatch({ type: LIKE_POST, payload: data });
      
    
    }
  } catch (error) {
    console.log(error);
  }
}

export const likeComment = (postId,commentId, navigate) => async (dispatch) => {
  try {
    const { data } = await api.likeComment(postId,commentId);
    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
      navigate("/signin");
    }else{
      
      dispatch({ type: LIKE_COMMENT, payload: data });
    
    }
  } catch (error) {
    console.log(error);
  }
}

export const likeReply = (postId,commentId,replyId, navigate) => async (dispatch) => {

  try {
    const { data } = await api.likeReply(postId,commentId,replyId);
    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
      navigate("/signin");
    }else{
      
      dispatch({ type: LIKE_REPLY, payload: data });
      
    
    }
  } catch (error) {
    console.log(error);
  }
}

export const commentPost = (comment,id) => async (dispatch) => {
  dispatch({type: START_LOADING});
  try {
    const  {data}  = await api.commentPost(comment,id);
    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
     
    }else{
      
    dispatch({ type: UPDATE, payload: data });
    }
  } catch (error) {
    console.log(error);
  }
}


export const addReply = (postId,commentId,reply) => async (dispatch) =>{
  dispatch({type:START_LOADING});
  try {
    const {data} = await api.addReply(postId,commentId,reply);
    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
     
    }else{
      
    dispatch({ type: UPDATE, payload: data });
    }
  } catch (error) {
    console.log(error);
  }
}

export const deleteReply = (postId,commentId,replyId) => async (dispatch) =>{
  dispatch({type:START_LOADING});
  try {
    const {data} = await api.deleteReply(postId,commentId,replyId);
    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
     
    }else{
      
    dispatch({ type: UPDATE, payload: data });
    }
  } catch (error) {
    console.log(error);
  }
}
import { SIGNUP,SIGNIN, SIGNOUT, EDITPROFILE, REFRESH_USER, GET_OTHER_USER } from "../constants/actionTypes";
import { socket } from "../socket";
import * as api from "../api";


export const signOut = (navigate) => async (dispatch) => {

  try {

    dispatch({type:SIGNOUT});
    navigate("/posts?page=1");
  } catch (error) {
    console.log(error);
  }
}

export const refreshUser = (data) => async (dispatch) => {
  try {

    dispatch({type:REFRESH_USER, payload:data});
  
  } catch (error) {
    console.log(error);
  }
}  

export const signUp = (user,navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(user);
    if(data.token){
      dispatch({ type: SIGNUP, payload: data });
      socket.emit("signUser", data?.email);
    navigate("/posts?page=1");
    }else{
      navigate("/confirmEmail");
    }
  } catch (error) {
    console.log(error);
  }
}  

export const confirmEmail = (token,navigate) => async (dispatch) => {
  try {
    const { data } = await api.confirmEmail(token);
    dispatch({ type: SIGNUP, payload: data });
    socket.emit("signUser", data?.email);
    navigate("/posts?page=1");
  } catch (error) {
    console.log(error);
  }
}  

export const signIn = (user, navigate) => async (dispatch) => {
  
  try {
    const { data } = await api.signIn(user);
    if(data?.confirmed){
      dispatch({ type: SIGNIN, payload: data });
      socket.emit("signUser", data?.email);
      navigate("/posts?page=1");
    }else{
      navigate("/confirmEmail");
    }
    
  } catch (error) {
    console.log(error);
  }
}  

export const editProfile = (editInfo,navigate) => async (dispatch) => {
  try {
    const { data } = await api.editProfile(editInfo);
    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
    }else{
      dispatch({ type: EDITPROFILE, payload: data });
      navigate("/posts?page=1");
    }
  } catch (error) {
    console.log(error);
  }
}  

export const addFriend = (friendEmail) => async (dispatch) => {
  try {
    const { data } = await api.addFriend(friendEmail);
    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
    }else{
      dispatch({ type: EDITPROFILE, payload: data });
    }
    
  } catch (error) {
    console.log(error);
  }
}  

export const removeFriend = (friendEmail) => async (dispatch) => {
  try {
    const { data } = await api.removeFriend(friendEmail);
    if(data === "Unauthinticated"){
      dispatch({type: SIGNOUT});
    }else{
      dispatch({ type: EDITPROFILE, payload: data });
    }
  } catch (error) {
    console.log(error);
  }
} 

export const getOtherUser = (otherUserEmail) => async (dispatch) => {
  try {
    const { data } = await api.getOtherUser(otherUserEmail);
    dispatch({ type: GET_OTHER_USER, payload: data });
  } catch (error) {
    console.log(error);
  }
}  


export const forgotPassword = (userEmail,navigate) => async (dispatch) => {
  try {
    const { data } = await api.forgotPassword(userEmail);
    if(data.message === "success"){
      navigate("/resetpassword");
    }
  } catch (error) {
    console.log(error);
  }
}  

export const resetPassword = (userData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.resetPassword(userData);
   
    if(data){
      navigate("/signin");
    }
  } catch (error) {
    console.log(error);
  }
}

export const feedback = (feedback) => async (dispatch) => {
  try {
    const { data } = await api.feedback(feedback);
   
    if(data === "success"){
      
    }
  } catch (error) {
    console.log(error);
  }
}  
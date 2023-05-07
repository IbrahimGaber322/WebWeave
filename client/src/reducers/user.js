import {SIGNIN,SIGNUP,SIGNOUT, EDITPROFILE, REFRESH_USER} from "../constants/actionTypes";


const userReducer = (user=JSON.parse(localStorage.getItem("user")) ,action) =>{
    
    switch(action.type){
        case EDITPROFILE:
        case SIGNUP:
        case SIGNIN:
            localStorage.setItem("user",JSON.stringify(action?.payload));
        return user=JSON.parse(localStorage.getItem("user"));
        case REFRESH_USER:
            const newUser = {...user, friends:action?.payload?.friends, requests:action?.payload?.requests}
            localStorage.setItem("user",JSON.stringify(newUser));
        return user=JSON.parse(localStorage.getItem("user"));
        case SIGNOUT:
            localStorage.removeItem("user");
        return user=JSON.parse(localStorage.getItem("user"));
        default: 
        return user;
    } 
    

}

export default userReducer;
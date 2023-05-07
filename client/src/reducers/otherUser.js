import {GET_OTHER_USER} from "../constants/actionTypes";


const otherUserReducer = (otherUser=null ,action) =>{
    
    switch(action.type){
        case GET_OTHER_USER:
           
        return otherUser=action?.payload;
        default: 
        return otherUser;
    } 
    

}

export default otherUserReducer;
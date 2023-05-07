import { FETCH_ALL,FETCH_BY_SEARCH , CREATE, UPDATE, DELETE, START_LOADING, END_LOADING, FETCH_POST, LIKE_POST, LIKE_COMMENT, LIKE_REPLY} from "../constants/actionTypes";
const postsReducer = (state = {isLoading:true}, action) =>{
    const pL = action?.payload;
    switch(action.type){
        case START_LOADING:
        return {...state, isLoading:true};
        case END_LOADING:
        return {...state, isLoading:false};
        case FETCH_ALL:
        return {...state,post:null, posts:pL?.posts, currentPage: pL?.currentPage, numberOfPages: pL?.numberOfPages, isLoading:false};
        case FETCH_POST:
        return {...state, post: pL, isLoading:false, currentPage:null};
        case FETCH_BY_SEARCH:
        return {...state, posts: pL?.posts, currentPage: pL?.currentPage, numberOfPages: pL?.numberOfPages, isLoading:false};
        case CREATE:
        return {...state, posts:[...state.posts, pL]};
        case UPDATE:
        return {...state, post:pL?.creator?pL:state?.post ,posts:state.posts.map((post)=> post?._id === pL?._id? pL : post), isLoading:false};
        case LIKE_POST:
        return {...state,post:{...state.post, likes:pL.likes}, posts:state.posts.map((post)=> {
            if(post._id === pL?._id){
                return {
                    ...post,
                    likes: pL.likes
                  };
            }else{
                return post;
            }
        }), isLoading:false};
        case LIKE_COMMENT:
            return {...state,post:{...state.post, comments:state.post.comments.map(comment=>{
                if(comment._id===pL?.commentId){
                    return {...comment, likes:pL?.commentLikes};
                }else{
                    return comment;
                }
            })}, isLoading:false};
            case LIKE_REPLY:
            return {...state,post:{...state.post, comments:state.post.comments.map(comment=>{
                if(comment._id===pL?.commentId){
                  const updatedReplies = comment.replies.map(reply=>{
                    if(reply._id === pL?.replyId){
                        return{...reply, likes:pL?.replyLikes}
                        
                    }else{
                        return reply;
                    }
                   })
                   return {...comment, replies:updatedReplies}
                }else{
                    return comment;
                }
            })}, isLoading:false};
        case DELETE:
        return {...state, posts:state.posts.filter((post)=> post?._id !== action.payload)};
        default: 
        return state;
    } 
}

export default postsReducer;
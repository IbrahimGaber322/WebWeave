import { Avatar, Grid, IconButton, Paper, Typography,Box, FormControl, InputLabel, OutlinedInput, CircularProgress, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import moment from "moment";
import { addReply, deleteComment, deleteReply, likeComment, likeReply } from "../../../actions/posts";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteAlert from "../../DeleteAlert";
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import LikePost from "../../Like";
import { Link, useNavigate } from "react-router-dom";



export default function Comment({post,comment}){
const {_id:postId} = post;
const {creator,avatar,createdAt,message,name,replies,_id:commentId} = comment;
const navigate = useNavigate();
const user = useSelector(state=> state.user);
const {isLoading} = useSelector(state=> state.posts);
const dispatch = useDispatch();
const [replySection, setReplySection] = useState(false);
const [replyMessage, setReplyMessage] = useState("");
const [emojiPicker, setEmojiPicker] = useState(false);
const handleSubmit = (e) =>{
     e.preventDefault();
     if(replyMessage?.length>0){
     dispatch(addReply(postId,commentId,{message:replyMessage, name:user?.name, avatar:user?.picture, creator:user?.email}));
     setReplyMessage("");
     setEmojiPicker(false);
     }
 }
 const handleKeyDown = (e) => {
   if (e.keyCode === 13 && replyMessage?.length>0) {
     dispatch(addReply(postId,commentId,{message:replyMessage, name:user?.name, avatar:user?.picture, creator:user?.email}));
     setReplyMessage("");
     setEmojiPicker(false);
   }
  }; 
const deleteCommandComment = "comment";
const deleteCommandReply = "reply";
const handleDeleteComment = () =>{
    dispatch(deleteComment(postId,commentId))
}
const handleDeleteReply = (replyId) =>{
  dispatch(deleteReply(postId,commentId,replyId))
}
const handleLikeComment = () =>{
  dispatch(likeComment(postId,commentId, navigate));

}
const handleLikeReply = (replyId) =>{
  dispatch(likeReply(postId,commentId,replyId, navigate));

}
    return (
        <Paper elevation={10} square sx={{ my:3, pl:1, mx:1 }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar component={Link} to={`/profile/${creator}`} alt={name} src={avatar} >{name.charAt(0)}</Avatar>
          </Grid>
          <Grid justifyContent="left" item xs>
            <Typography variant="h6" sx={{ margin: 0, textAlign: "left" }}>{name}</Typography>
            <Typography paragraph sx={{ textAlign: "left", wordBreak:"break-all", mb:0 }}>
              {message}
            </Typography>
            <Typography paragraph sx={{ textAlign: "left", color: "gray" }}>
              {moment(createdAt).fromNow()}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs display={"flex"} justifyContent={"space-between"}>
        <Box>
        <LikePost type="comment" post={post} comment={comment} user={user} handleLike={handleLikeComment} />
        <IconButton onClick={()=>setReplySection(prev=>!prev)}>
          <ReplyIcon color="secondary" />
        </IconButton>
        </Box>
        {(user?.email ===creator)&&
        <DeleteAlert handleDelete={handleDeleteComment} deleteCommand={deleteCommandComment} >
        <IconButton>
          <DeleteIcon />
        </IconButton>
         </DeleteAlert>
        }
        </Grid>
        {(replySection&&user)&&
        <Grid item position={"relative"} maxWidth={"sm"} ml={2}>
        <Box component={"form"} onSubmit={handleSubmit} mt={1} >
        <FormControl fullWidth variant="outlined">
          <InputLabel>Reply</InputLabel>
          <OutlinedInput
          label="Reply"
          inputProps={{ maxLength: 100 }}
          name="replyMessage"
          value={replyMessage}
          onKeyDown={handleKeyDown}
          onChange={(e)=>setReplyMessage(e.target.value)}
            endAdornment={isLoading? <CircularProgress size={20} /> :
              <InputAdornment position="end">
                 {emojiPicker && (
          
          <Box  maxWidth={"100%"}  position={"absolute"} bottom={"100%"} right={0} display={"flex"} flexWrap={"wrap"} justifyContent={"center"} >
          
            <EmojiPicker
              searchDisabled="true"
              previewConfig={{ showPreview: false }}
              onEmojiClick={(e) => {setReplyMessage((input) => input + e.emoji)}}
              height={150}
             
            />
            
            </Box>
         
        )}
        <IconButton onClick={() => setEmojiPicker((prev) => !prev)}><AddReactionIcon /></IconButton>
                <IconButton
                  
                  type="submit"
                  edge="end"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        </Box>
        </Grid>
        }
        {replySection&&
        replies.map(reply=>
           <Grid key={reply._id} item mb={1} >
           <Paper sx={{maxWidth:"sm", ml:2, mt:1, borderRadius:3, pl:1,pt:1, pb:"5px",pr:1}}>
           <Grid container sx={{}}>
              <Grid item mr={1}>
            <Avatar component={Link} to={`/profile/${reply.creator}`} alt={reply.name} src={reply.avatar} >{reply.name.charAt(0)}</Avatar>
          </Grid>
          <Grid justifyContent="left" item xs>
            <Typography variant="h6" sx={{ margin: 0, textAlign: "left" }}>{reply.name}</Typography>
            <Typography paragraph sx={{ textAlign: "left", wordBreak:"break-all", mb:"1px"}}>
              {reply.message}
            </Typography>
            <Typography paragraph sx={{ textAlign: "left", color: "gray", mb:0 }}>
              {moment(reply.createdAt).fromNow()}
            </Typography>
          </Grid>
          </Grid>
        <Box display={"flex"} justifyContent={"space-between"}>
            <LikePost type="reply" reply={reply} post={post} user={user} handleLike={()=>handleLikeReply(reply._id)} />
            {(user?.email === reply.creator)&&
        <DeleteAlert handleDelete={()=>handleDeleteReply(reply._id)} deleteCommand={deleteCommandReply} >
        <IconButton>
          <DeleteIcon />
        </IconButton>
         </DeleteAlert>
        }
        </Box>
          </Paper>
           </Grid>
        )
        }
      </Paper>
    )
}
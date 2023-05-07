import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Avatar,
  Box,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from "@mui/material";
import moment from "moment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CommentIcon from '@mui/icons-material/Comment';
import { useDispatch, useSelector } from "react-redux";
import {  likePost, getPost, getPostsBySearch, commentPost } from "../../actions/posts.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import Form from "../home/Form";
import Comment from "./comments/Comment.jsx";
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Like from "../Like.jsx";

const PostDetails = () => {
  const page = null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [edit, setEdit] = useState(false);
  const [commentMessage,setCommentMessage] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [commentSection,setCommentSection] = useState(false);
  const {isLoading, post, posts} = useSelector((state) => state?.posts);
  const user = useSelector((state)=>state?.user);


  useEffect(() => {
    if (id) {
      dispatch(getPost(id));
    }
  }, [id,dispatch]);
  
  useEffect(() => {
    if (post?._id === id && !hasMounted) {
      const postTags = post?.tags?.length > 0 ? post?.tags.join() : null;
      dispatch(getPostsBySearch({ searchQuery: null, searchTags: postTags }, page));
      setHasMounted(true);
    }
  }, [post,dispatch,id,hasMounted]);

  
  const recommendedPosts = posts?.filter((p)=>p?._id !== id).sort((a,b)=>{
    const aTags = [...a.tags];
    const bTags = [...b.tags];
    const sharedTagsA = aTags.filter(tag => post?.tags?.includes(tag));
    const sharedTagsB = bTags.filter(tag => post?.tags?.includes(tag));
    return sharedTagsB.length - sharedTagsA.length;
  }).slice(0,5);
  
  const openPost = (id) =>{
    if(!isLoading){
    navigate(`/posts/post/${id}`);
    }
  }
  const handleLikePost = () =>{
    dispatch(likePost(post?._id, navigate));
  
  }
  const handleSubmit = (e) =>{
      e.preventDefault();
      if(commentMessage?.length>0){
      dispatch(commentPost({message:commentMessage, name:user?.name, avatar:user?.picture, creator:user?.email}, id));
      setCommentMessage("");
      setEmojiPicker(false);
      }
  }
  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && commentMessage?.length) {
      dispatch(commentPost({message:commentMessage, name:user?.name, avatar:user?.picture, creator:user?.email}, id));
      setCommentMessage("");
      setEmojiPicker(false);
    }
   }; 
  return (
    (!post?._id===id ||!id)? <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"50vh"}><CircularProgress color="primary" /></Box>:
    <Grid mb={3} container mt={2} p={1} spacing={2} display={"flex"} justifyContent={"center"} >
    <Grid item display={"flex"} justifyContent={"center"} xs={12} md={edit? 6: 12}>
    <Card
      elevation={24}
      sx={{
        borderRadius: 3,
        width:"100%",
        maxWidth:"md"
      }}
    >
      <CardHeader
        avatar={<Avatar component={Link} to={`/profile/${post?.creator}`} src={post?.avatar}>{post?.name?.charAt(0)}</Avatar>}
        action={
          user?.email === post?.creator &&
          <Button onClick={()=>setEdit((prev)=>!prev)} >
            <MoreHorizIcon fontSize="large" />
          </Button>
        }
        title={post?.name}
        subheader={moment(post?.createdAt).fromNow()}
      />
      <CardMedia
        component={"img"}
        
        src={post?.selectedFile }
        
        sx={{maxHeight: 1350, objectFit:"contain" }}
        title={post?.tags?.map((tag) => ` #${tag}`)}
      />
      <CardContent>
        <Typography textAlign={"center"} sx={{wordWrap:"break-word"}} variant="h6" gutterBottom>
          {post?.title}
        </Typography>
        <Typography textAlign={"center"} sx={{wordWrap:"break-word"}} variant="body1" color="textSecondary">
          {post?.message}
        </Typography>
        
        {commentSection&& 
          <Typography my={1} textAlign={"center"} variant="h6"> Comments </Typography>
        }
        <Box maxHeight={"600px"} sx={{overflowY:"scroll"}}>
        {commentSection&& 
         post?.comments?.map((comment,i)=><Comment key={i} comment={comment} post={post} />)}
         </Box>
         {(commentSection&&user) &&
        <Box component={"form"} onSubmit={handleSubmit} mt={1} >
        <FormControl fullWidth variant="outlined">
          <InputLabel>Comment</InputLabel>
          <OutlinedInput
          label="Comment"
          inputProps={{ maxLength: 100 }}
          name="commentMessage"
          value={commentMessage}
          onKeyDown={handleKeyDown}
          onChange={(e)=>setCommentMessage(e.target.value)}
            endAdornment={isLoading? <CircularProgress size={20} /> :
              <InputAdornment position="end">
                 {emojiPicker && (
          
          <Box  maxWidth={"100%"}  position={"absolute"} bottom={"100%"} right={-16} display={"flex"} flexWrap={"wrap"} justifyContent={"center"} >
          
            <EmojiPicker
              searchDisabled="true"
              previewConfig={{ showPreview: false }}
              onEmojiClick={(e) => {setCommentMessage((input) => input + e.emoji)}}
              height={400}
             
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
        </Box>}
      </CardContent>
      <CardActions>
     
      <Like type="post" user={user} post={post} handleLike={handleLikePost} />
      
     
      <IconButton color="secondary" onClick={()=>setCommentSection(!commentSection)}><CommentIcon sx={{m:"auto"}} /></IconButton>
      
      </CardActions>
    </Card>
    </Grid>
    {edit &&(
    <Grid item display={"flex"} justifyContent={"center"} xs={12} md={6}>
    <Form currentId={id} setEdit={setEdit} edit={edit} />
    </Grid>)
    }
    {(post?._id === id)&& 
    <Grid item xs={12} mt={2} display={"flex"} flexWrap={"wrap"} justifyContent={"center"}>
    {(recommendedPosts?.length >0) &&<Typography mb={2} variant="h5" textAlign={"center"} width={"100%"}>Recommended Posts</Typography>}
      {(recommendedPosts?.length >0)&& recommendedPosts?.map((p)=><Button variant="outlined" onClick={()=>openPost(p._id)} key={p?._id} sx={{display:"inline-block", m:2}}>{p?.title?.slice(0,15)}{p?.title?.length>15&&"..."}</Button>)}
        
    </Grid>
    }
    </Grid>
    
  );
};

export default PostDetails;




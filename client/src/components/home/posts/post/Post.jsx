import React from "react";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  CardActionArea,
} from "@mui/material";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { likePost } from "../../../../actions/posts";
import { useNavigate } from "react-router-dom";
import Like from "../../../Like";





const Post = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.user);
  const openPost = () =>{
       navigate(`/posts/post/${post._id}`);
  }
  
  const handleLikePost = () =>{
  
    dispatch(likePost(post?._id, navigate));
  }
  return (
    <Card
      elevation={24}
      sx={{
        borderRadius: 3,
        m: 1
      }}
    >
    <CardActionArea onClick={openPost}>
      <CardHeader
        avatar={<Avatar src={post?.avatar}>{post?.name?.charAt(0)}</Avatar>}
       
        title={post?.name}
        subheader={moment(post?.createdAt).fromNow()}
      />
      <CardMedia
        component="img"
        loading="lazy"
        image={post?.selectedFile}
        sx={{maxHeight: 600}}
        title={post?.tags.map((tag) => ` #${tag}`)}
      />
      <CardContent>
        <Typography className="card-title" variant="h6" gutterBottom>
          {post?.title}
        </Typography>
        <Typography textAlign={"center"} className="card-message" variant="body1" color="textSecondary">
          {post?.message}
        </Typography>
      </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: "space-between" }}>
      <Like type="post" user={user} post={post} handleLike={handleLikePost} />
      </CardActions>
    </Card>
  );
};

export default Post;




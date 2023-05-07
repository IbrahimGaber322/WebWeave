import React from "react";
import {CircularProgress, Box, Typography} from "@mui/material";
import { XMasonry, XBlock } from "react-xmasonry";
import { useSelector } from "react-redux";
import Post from "./post/Post";



const Posts = () => {
   
    const {posts, isLoading, currentPage} = useSelector((state) => state?.posts);

   
   if(!posts?.length&& !isLoading){
      return(
         <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}><Typography  color={(theme)=>theme.palette.secondary.main} variant="h3">No posts</Typography></Box>
         );
   }else{
  return (
   (!currentPage)? <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"50vh"}><CircularProgress color="primary" /></Box>: (
      <Box>
        <XMasonry targetBlockWidth={400}  >
           {posts.map((post,index)=>(
            <XBlock key={index}>
               <Post key={post._id} post={post}/>
               </XBlock>
           ))}
           
        </XMasonry>
        </Box>
   )
  );
           }
};

export default Posts;




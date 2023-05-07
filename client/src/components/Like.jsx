import { Button, Typography } from "@mui/material"
import React from "react"
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';


const Like = ({post, handleLike, user,type,comment,reply}) =>{
   
if(type === "post"){
    if(post?.likes?.length>0) {
      if(post?.likes?.find((like) => like === (user?.email))){
        return (
          <Button
          color="primary"
          onClick={() => handleLike()}
          
        >
          <Typography fontSize={20}>{post?.likes?.length}</Typography> &nbsp;
          <ThumbUpAltIcon />
        </Button>
        )}else{
        return (
          <Button
          color="primary"
          onClick={() => handleLike()}
          
        >
          <Typography fontSize={20}>{post?.likes?.length}</Typography> &nbsp;
          <ThumbUpOffAltIcon />
        </Button>
        )
        }
      }else {
        return (
          <Button
          color="primary"
          onClick={() => handleLike()}
        >
          <ThumbUpOffAltIcon />
        </Button>
        )
      }
    }else if(type === "comment"){
      if(comment?.likes?.length>0) {
        if(comment?.likes?.find((like) => like === (user?.email))){
          return (
            <Button
            color="primary"
            onClick={() => handleLike()}
            
          >
            <Typography fontSize={20}>{comment?.likes?.length}</Typography> &nbsp;
            <ThumbUpAltIcon />
          </Button>
          )}else{
          return (
            <Button
            color="primary"
            onClick={() => handleLike()}
            
          >
            <Typography fontSize={20}>{comment?.likes?.length}</Typography> &nbsp;
            <ThumbUpOffAltIcon />
          </Button>
          )
          }
        }else {
          return (
            <Button
            color="primary"
            onClick={() => handleLike()}
          >
            <ThumbUpOffAltIcon />
          </Button>
          )
        }
    }else if(type === "reply"){
      if(reply?.likes?.length>0) {
        if(reply?.likes?.find((like) => like === (user?.email))){
          return (
            <Button
            color="primary"
            onClick={() => handleLike()}
            
          >
            <Typography fontSize={20}>{reply?.likes?.length}</Typography> &nbsp;
            <ThumbUpAltIcon />
          </Button>
          )}else{
          return (
            <Button
            color="primary"
            onClick={() => handleLike()}
            
          >
            <Typography fontSize={20}>{reply?.likes?.length}</Typography> &nbsp;
            <ThumbUpOffAltIcon />
          </Button>
          )
          }
        }else {
          return (
            <Button
            color="primary"
            onClick={() => handleLike()}
          >
            <ThumbUpOffAltIcon />
          </Button>
          )
        }
    }
      
  }

  export default Like;
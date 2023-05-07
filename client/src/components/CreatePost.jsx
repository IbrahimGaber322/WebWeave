import React, { useState } from "react";
import Form from "./home/Form";
import { Avatar, Card, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";


export default function CreatePost(){
    const user = useSelector((state)=>state?.user);
    const [preview, setPreview] = useState({name:user?.name, avatar:user?.picture,title:"",message:"",tags:[] });
    return(
           <Grid container mt={2} mb={3} p={1} spacing={3}>
              <Grid item xs={12} md={user? 6 : 12} display={"flex"} justifyContent={"center"} >
                    <Form setPreview={setPreview} preview={preview} />
              </Grid>
              {user&&
              <Grid item xs={12} md={6}  display={"flex"} flexDirection={"column"} justifyContent={"center"} >
              <Typography mb={2} textAlign={"center"} variant="h5">Preview</Typography>
              <Card
      elevation={24}
      sx={{
        borderRadius: 3,
        maxWidth:"sm",
        mx:"auto",
        minWidth:350
      }}
    >
      <CardHeader
        avatar={<Avatar src={preview?.avatar}>{preview?.name?.charAt(0)}</Avatar>}
       
        title={preview?.name}

      />
      <CardMedia
        component="img"
        
        image={preview?.selectedFile}
        
        title={preview?.tags?.map((tag) => ` #${tag}`)}
      />
      <CardContent>
        <Typography className="card-title" variant="h6" gutterBottom>
          {preview?.title}
        </Typography>
        <Typography sx={{wordBreak:"break-word"}} textAlign={"center"} variant="body1" color="textSecondary">
          {preview?.message}
        </Typography>
        </CardContent>
      </Card>
              </Grid>}
           </Grid>
    );
}
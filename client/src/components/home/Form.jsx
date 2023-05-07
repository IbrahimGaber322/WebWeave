import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Input,
  Box,
  Paper,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../actions/posts";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useLocation, useNavigate} from "react-router-dom";
import DeleteAlert from "../DeleteAlert";
import { deletePost } from "../../actions/posts";

const Form = ({ currentId, setPreview , setEdit, preview, edit}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.user);
  const post = useSelector((state) =>
    state?.posts?.post
  );
  const [postData, setPostData] = useState({title:"",message:"",tags:[]});
  useEffect(() => {
    if (post&&edit) setPostData(post);
  }, [post,location,edit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentId) {
      dispatch(updatePost(currentId, {...postData}));
      setEdit(false);
    } else {
      dispatch(createPost({...postData, name:user?.name, avatar:user.picture, creator:user.email}));
      clear();
    }
  };
  const clear = () => {
    setPostData({title:"",message:"",tags:[]});
    !edit&&setPreview({title:"",message:"",tags:[],avatar:user?.picture, name:user?.name,selectedFile:null});
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const addImage = async (e) => {
    const file = e.target.files[0];
    
     if(file) {
      const base64 = await convertBase64(file)
    setPostData({ ...postData, selectedFile: base64 });
    setPreview({ ...preview, selectedFile: base64 });
    }
  };

  const handleDelete = () =>{
    dispatch(deletePost(post?._id));
    navigate("/");
  }

  if(!user?.name){
    return(
      <Paper elevation={10} sx={{ borderRadius:3, p:3, height:"fit-content"}} >
          <Typography textAlign={"center"} variant="h5" >You need to sign in to create a post.</Typography>
          </Paper>
    )
  }else{

  return (
    <Paper elevation={10} sx={{borderRadius:3, maxWidth:"sm", height:"fit-content", m:"auto", position:"relative"}}  component="form" autoComplete="off" onSubmit={handleSubmit}>
      <Grid p={3} container>
        <Grid item  xs={12}>
          <Typography textAlign="center" variant="h4">
            {currentId ? "Edit" : "Create"} Post
          </Typography>
        </Grid>

        <Grid item pt={2} xs={12}>
          <TextField
            className="text-field"
            name="title"
            variant="outlined"
            label="Title"
            fullWidth
            required
            inputProps={{ maxLength: 60 }}
            value={postData.title}
            onChange={(e) =>{
              setPostData({ ...postData, title: e.target.value });
              !edit&&setPreview({ ...preview, title: e.target.value });}
            }
          />
        </Grid>

        <Grid item pt={2} xs={12}>
          <TextField
            name="message"
            variant="outlined"
            label="Message"
            fullWidth
            required
            inputProps={{ maxLength: 5000 }}
            value={postData.message}
            onChange={(e) =>{
              setPostData({ ...postData, message: e.target.value });
              !edit&&setPreview({ ...preview, message: e.target.value });}
            }
          />
        </Grid>

        <Grid item pt={2} xs={12}>
          
          <TextField
            name="tags"
            variant="outlined"
            label="Tags"
            fullWidth
            value={postData.tags}
            onChange={(e) =>{
              setPostData({ ...postData, tags: e?.target?.value?.split(',')?.map((tag)=>tag.trim())});
              !edit&&setPreview({ ...preview, tags: e?.target?.value?.split(',')?.map((tag)=>tag.trim())}); } 
            }
          />
        </Grid>
        <Grid item pt={2} xs={12} display="flex" justifyContent="center">
          <FormControlLabel
          labelPlacement="top"
            control={
              <Input
                sx={{ display: "none" }}
                type="file"
                accept="image/*"
                onChange={(e) => addImage(e)}
              />
            }
            label={<FileUploadIcon sx={{'&:hover': {
                  color:"inherit"
        }}} color="secondary" fontSize="large"/>}
          />
           <Box component="img" maxHeight="100px" src={postData.selectedFile} />
            
        </Grid>
        <Grid item pt={2} xs={12}>
          
          <Button
            variant="contained"
            type="submit"
            fullWidth
          >
            <Typography fontWeight={600}>Submit</Typography>
          </Button>
        </Grid>
        {currentId && 
        <Grid item pt={2} xs={12}>
        <DeleteAlert handleDelete={handleDelete} deleteCommand={"post"}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
          >
            <Typography fontWeight={600} >Delete</Typography>
          </Button>
          </DeleteAlert>
        </Grid>
        }
  

{!currentId &&
        <Grid item pt={2} xs={12}>
          
          <Button
            variant="contained"
            color="secondary"
            onClick={clear}
            fullWidth
          >
            <Typography fontWeight={600} >Clear</Typography>
          </Button>
        </Grid>
}
      </Grid>
    </Paper>
  );
};
}

export default Form;

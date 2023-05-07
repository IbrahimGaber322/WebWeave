import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { editProfile, getOtherUser } from "../actions/user";


export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let user;
  const currentUser = useSelector((state) => state.user);
  const otherUser = useSelector((state) => state.otherUser);
  const { otherUserEmail } = useParams();
  useEffect(() => {
    if (otherUserEmail) {
      dispatch(getOtherUser(otherUserEmail));
    }
  }, [dispatch, otherUserEmail]);
  if (otherUserEmail) {
    user = otherUser;
  } else {
    user = currentUser;
  }
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    picture: "",
    name: "",
    email: "",
    cover: "",
    about: "",
  });
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user?.firstName,
        lastName: user?.lastName,
        picture: user?.picture,
        name: user?.name,
        email: user?.email,
        cover: user?.cover,
        about: user?.about,
      });
    }
  }, [user]);
 
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
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      name: formData.firstName + " " + formData.lastName,
    });
  };
  const addProfilePic = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setFormData({ ...formData, picture: base64 });
  };
  const addCover = async (e) => {
    
    const file = e.target.files[0];

    const base64 = await convertBase64(file);
    setFormData({ ...formData, cover: base64 });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editProfile(formData, navigate));
  };
  if (user?.email === currentUser?.email) {
    return (
      <Box
        p={2}
        component={"form"}
        mt={3}
        display={"flex"}
        justifyContent={"center"}
        onSubmit={handleSubmit}
      >
        <Paper
          elevation={10}
          sx={{ borderRadius: 3, maxWidth: "md", width: "100%" }}
        >
          <Grid container>
            <Grid
              item
              m={"auto"}
              xs={12}
              display={"flex"}
              justifyContent={"center"}
              height={300}
              position={"relative"}
            >
              <Box
                position={"relative"}
                height={200}
                overflow={"hidden"}
                width={"100%"}
                sx={{
                  backgroundColor: (theme) => `${theme.palette.primary.light}`,
                  borderRadius: "12px 12px 0 0",
                }}
              >
                {formData.cover && (
                  <Box
                    component={"img"}
                    height={"100%"}
                    width={"100%"}
                    sx={{ objectFit: "cover" }}
                    src={formData.cover}
                  />
                )}
                <IconButton
                  sx={{ position: "absolute", bottom: 0, right: 0 }}
                  component="label"
                >
                  <PhotoCamera />
                  <input
                    hidden
                    onChange={(e) => addCover(e)}
                    accept="image/*"
                    multiple
                    type="file"
                  />
                </IconButton>
              </Box>
              <Box
                component={"img"}
                className="gelatine glow-box-blue"
                height={"200px"}
                width={"200px"}
                sx={{
                  borderRadius: "100%",
                  objectFit: "cover",
                  boxShadow: (theme) => `0 0 1vh ${theme.palette.primary.main}`,
                }}
                src={formData.picture}
                position={"absolute"}
                bottom={1}
              />
            </Grid>

            <Grid item p={2} xs={12}>
              <Typography textAlign={"center"}>{user?.email}</Typography>
              <Typography textAlign={"center"} variant="h5">
                Edit your profile
              </Typography>
            </Grid>
            <Grid item p={2} xs={12} md={6}>
              <Paper sx={{ p: 1 }} square elevation={7}>
                <TextField
                  fullWidth
                  color="primary"
                  variant="standard"
                  name="firstName"
                  value={formData.firstName}
                  inputProps={{ maxLength: 20 }}
                  onChange={handleChange}
                  label="First Name"
                />
              </Paper>
            </Grid>
            <Grid item p={2} xs={12} md={6}>
              <Paper sx={{ p: 1 }} square elevation={7}>
                <TextField
                  fullWidth
                  color="primary"
                  variant="standard"
                  name="lastName"
                  value={formData.lastName}
                  inputProps={{ maxLength: 20 }}
                  onChange={handleChange}
                  label="Last Name"
                />
              </Paper>
            </Grid>
            <Grid item p={2} xs={12}>
              <Typography color={"primary"} textAlign={"center"}>
                About
              </Typography>
            </Grid>
            <Grid item p={2} xs={12}>
              <Paper sx={{ p: 1 }} square elevation={7}>
                <TextField
                  fullWidth
                  color="primary"
                  variant="standard"
                  name="about"
                  multiline
                  inputProps={{ maxLength: 1000 }}
                  value={formData.about}
                  onChange={handleChange}
                  label="About"
                />
              </Paper>
            </Grid>
            <Grid item p={2} m={"auto"} xs={12} md={8} textAlign={"center"}>
              <Button fullWidth variant="outlined" component="label">
                Upload Profile Picture
                <PhotoCamera sx={{ ml: 1 }} />
                <input
                  hidden
                  onChange={(e) => addProfilePic(e)}
                  accept="image/*"
                  multiple
                  type="file"
                />
              </Button>
            </Grid>
            <Grid item p={2} m={"auto"} xs={12} md={8} textAlign={"center"}>
              <Button fullWidth variant="contained" type="submit">
                <Typography fontWeight={600}>Submit</Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  } else {
    return (
      <Box p={2} mt={3} display={"flex"} justifyContent={"center"}>
        <Paper
          elevation={10}
          sx={{ borderRadius: 3, width: "100%", maxWidth: "md" }}
        >
          <Grid width={"100%"} container>
            <Grid
              item
              m={"auto"}
              xs={12}
              display={"flex"}
              justifyContent={"center"}
              height={300}
              position={"relative"}
            >
              <Box
                height={200}
                width={"100%"}
                overflow={"hidden"}
                sx={{
                  backgroundColor: (theme) => `${theme.palette.primary.light}`,
                  borderRadius: "12px 12px 0 0",
                }}
              >
                {user?.cover && (
                  <Box
                    component={"img"}
                    height={"100%"}
                    width={"100%"}
                    sx={{ objectFit: "cover" }}
                    src={user?.cover}
                  />
                )}
              </Box>
              <Box
                component={"img"}
                className="gelatine glow-box-blue"
                height={"200px"}
                width={"200px"}
                sx={{
                  borderRadius: "100%",
                  objectFit: "cover",
                  boxShadow: (theme) => `0 0 1vh ${theme.palette.primary.main}`,
                }}
                src={user?.picture}
                position={"absolute"}
                bottom={1}
              />
            </Grid>

            <Grid item p={2} xs={12}>
              <Typography color={"primary"} textAlign={"center"}>
                {user?.email}
              </Typography>
            </Grid>

            <Grid item p={2} xs={12}>
              <Typography textAlign={"center"} fontSize={20}>
                {user?.name}
              </Typography>
            </Grid>
            <Grid item p={2} xs={12}>
              <Typography color={"primary"} textAlign={"center"}>
                About
              </Typography>
            </Grid>
            <Grid item p={2} xs={12}>
              <Paper sx={{ p: 1 }} square elevation={7}>
                <Typography textAlign={"center"}>{user?.about}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }
}

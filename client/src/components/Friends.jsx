import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addFriend, removeFriend } from "../actions/user";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import DeleteAlert from "./DeleteAlert";
import Astro from "../images/_Pngtree_astronaut_spaceflight_5420858-removebg.png";
export default function Friends() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const handleDelete = (friendEmail) => {
    dispatch(removeFriend({ friendEmail: friendEmail }));
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== user.email) {
      dispatch(addFriend({ friendEmail: email }));
    }
    setEmail("");
  };

  const openProfile = (otherUserEmail) => {
    navigate(`/profile/${otherUserEmail}`);
  };

  return (
    <Container width={"100%"} mx={1}>
    <Paper
      sx={{ borderRadius: 3, maxWidth: "lg", mx: "auto", my:3 }}
      elevation={10}
    >
      <Grid container>
        <Grid item xs={12} md={6}>
          <Grid container justifyContent={"center"}>
            <Grid item xs={12}>
              <Typography textAlign={"center"} my={3} variant="h4">
                Friends
              </Typography>
              <Typography textAlign={"center"} mb={1} variant="h5">
                You have {user?.friends?.length} Friends
              </Typography>
              <Box
                height={300}
                sx={{ overflowY: "auto" }}
                display={"flex"}
                flexWrap={"wrap"}
                justifyContent={"center"}
              >
                {user?.friends?.map((friend) => (
                  <Card
                    key={friend?.email}
                    sx={{ width: 200, my: 1, mx: 1, position: "relative" }}
                  >
                    <CardActionArea onClick={() => openProfile(friend.email)}>
                      <CardMedia
                        component="img"
                        alt={user?.name.charAt(0)}
                        height="140"
                        image={friend?.picture || Astro}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography
                          textAlign={"center"}
                          gutterBottom
                          variant="h5"
                          component="div"
                        >
                          {friend.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        ></Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%"     
                      }}
                    >
                      <DeleteAlert
                        handleDelete={() => handleDelete(friend.email)}
                        deleteCommand={"unfriend"}
                        friendName={friend.name}
                      >
                        <Button sx={{":hover":{bgcolor:"red", color:"white"}}} color="error" size="small">
                          Unfriend
                        </Button>
                      </DeleteAlert>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Grid>

            <Grid
              item
              xs={6}
              component={"form"}
              onSubmit={handleSubmit}
              display={"flex"}
              flexWrap={"wrap"}
              alignItems={"center"}
              justifyContent={"center"}
              my={3}
            >
              <FormControl fullWidth variant="outlined">
                <InputLabel>Add a new friend</InputLabel>
                <OutlinedInput
                  label="Add a new friend"
                  inputProps={{ maxLength: 100 }}
                  name="email"
                  value={email}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton type="submit" edge="end">
                        <AddCircleIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography textAlign={"center"} my={3} variant="h4">
            Friend Requests
          </Typography>
          <Typography textAlign={"center"} mb={1} variant="h5">
            You have {user?.requests?.length} Friend Requests
          </Typography>
          <Box
            height={300}
            sx={{ overflowY: "auto" }}
            display={"flex"}
            flexWrap={"wrap"}
            justifyContent={"center"}
          >
            {user?.requests?.map((request) => (
              <Card
                key={request?.email}
                sx={{ width: 200, my: 1, mx: 1, position: "relative" }}
              >
                <CardActionArea onClick={() => openProfile(request.email)}>
                  <CardMedia
                    component="img"
                    alt={request.name.charAt(0)}
                    height="140"
                    image={request?.picture}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography
                      textAlign={"center"}
                      gutterBottom
                      variant="h5"
                      component="div"
                    >
                      {request.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    ></Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    position: "absolute",
                    width: "100%",
                    bottom: 0,
                  }}
                >
                  <Button
                    onClick={() =>
                      dispatch(addFriend({ friendEmail: request.email }))
                    }
                    size="small"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDelete(request?.email)}
                    size="small"
                  >
                    Decline
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
    </Container>
  );
}

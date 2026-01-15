import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { GoogleLogin } from "@react-oauth/google";
import TextField from "@mui/material/TextField";
import LinkM from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { signIn } from "../actions/user";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import coverImage from "../images/Web-Weave.svg";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <LinkM component={Link} color="inherit" to="/about">
        Ibrahim Gaber
      </LinkM>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const initialState = { email: "", password: "", google: false };

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const googleSuccess = (res) => {
    const googleData = jwtDecode(res.credential);
    const googleUser = { email: googleData.email, google: true };
    dispatch(signIn(googleUser, navigate));
  };
  const googleFailure = (err) => {
    console.log(err);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signIn(formData, navigate));
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
    
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        sx={{
          backgroundImage: `url(${coverImage})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "100vh 100%",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={6} md={5} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent:"center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
              onChange={handleChange}
            />
            <FormControl fullWidth sx={{mt:1}} variant="outlined">
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                name="password"
                required
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <Grid pt={2} display="flex" justifyContent="center" item xs={12}>
        <Box width={40} height={40} borderRadius={100} overflow={"hidden"}>
        <GoogleLogin type="icon" shape="circle"  context="signin" onSuccess={googleSuccess} onError={googleFailure} />
        </Box>
        </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <LinkM component={Link} to="/forgotpassword" variant="body2">
                  Forgot password?
                </LinkM>
              </Grid>
              <Grid item>
                <LinkM component={Link} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </LinkM>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

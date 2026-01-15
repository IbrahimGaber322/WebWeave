import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import Home from "./components/home/Home";
import SignUp from "./components/signup/SignUp";
import NavBar from "./components/NavBar";
import PostDetails from "./components/postdetails/PostDetails";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import ConfirmEmail from "./components/ConfirmEmail";
import Friends from "./components/Friends";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import About from "./components/About";
import SignIn from "./components/SignIn";
import MaterialUISwitch from "./components/DarkModeSwitch";
import ErrorBoundary from "./components/ErrorBoundary";
import { SnackbarProvider } from "./context/SnackbarContext";

import darkTheme from "./theme/darkTheme";
import lightTheme from "./theme/lightTheme";
import "./styles.css";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const App = () => {
    const user = useSelector((state) => state.user);
    const [dark, setDark] = useState(JSON.parse(localStorage.getItem("dark")));

    useEffect(() => {
        localStorage.setItem("dark", JSON.stringify(dark));
    }, [dark]);

    return (
        <ErrorBoundary>
            <BrowserRouter>
                <GoogleOAuthProvider clientId={clientId}>
                    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
                        <CssBaseline enableColorScheme />
                        <SnackbarProvider>
                            <Container sx={{ minHeight: "100vh" }} maxWidth={false} disableGutters>
                                {user && <NavBar setDark={setDark} dark={dark} />}
                                <Routes>
                                    <Route path="/" element={user ? <Navigate to="/posts?page=1" /> : <Navigate to="/signin" />} />
                                    <Route path="/posts" element={user ? <Home /> : <Navigate to="/signin" />} />
                                    <Route path="/createpost" element={user ? <CreatePost /> : <Navigate to="/signin" />} />
                                    <Route path="/posts/search" element={user ? <Home /> : <Navigate to="/signin" />} />
                                    <Route path="/posts/post/:id" element={<PostDetails />} />
                                    <Route path="/signin" element={user ? <Navigate to="/posts?page=1" /> : <SignIn />} />
                                    <Route path="/signup" element={user ? <Navigate to="/posts?page=1" /> : <SignUp />} />
                                    <Route path="/profile/:otherUserEmail" element={user ? <Profile /> : <Navigate to="/posts?page=1" />} />
                                    <Route path="/profile" element={user ? <Profile /> : <Navigate to="/posts?page=1" />} />
                                    <Route path="/confirmEmail/:token" element={<ConfirmEmail />} />
                                    <Route path="/confirmEmail" element={<ConfirmEmail />} />
                                    <Route path="/friends" element={user ? <Friends /> : <Navigate to="/signin" />} />
                                    <Route path="/forgotpassword" element={!user && <ForgotPassword />} />
                                    <Route path="/resetpassword/:token" element={!user && <ResetPassword />} />
                                    <Route path="/resetpassword" element={!user && <ResetPassword />} />
                                    <Route path="/about" element={<About />} />
                                </Routes>
                                {!user && <MaterialUISwitch sx={{ position: "absolute", bottom: 0, right: 0, m: 1 }} checked={dark} onChange={(e) => { setDark(e.target.checked) }} />}
                            </Container>
                        </SnackbarProvider>
                    </ThemeProvider>
                </GoogleOAuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

export default App;





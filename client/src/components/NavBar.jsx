import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Avatar,
  Menu,
  Badge,
  useMediaQuery,
  Popover,
  ButtonBase,
  Container
} from "@mui/material";
import { refreshUser, signOut } from "../actions/user";
import { fetchUnreadCount, receiveMessage, fetchConversations, setOnlineStatus } from "../actions/chat";
import MenuIcon from "@mui/icons-material/Menu";
import MaterialUISwitch from "./DarkModeSwitch";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import ArticleIcon from '@mui/icons-material/Article';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { socket } from "../socket";
import ChatDrawer from "./chat/ChatDrawer";

const pages = ["Create Post", "Friends", "About"];
const settings = ["Profile","Sign Out"];

function NavBar({setDark, dark}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const medium = useMediaQuery('(max-width:900px)')
  const user = useSelector((state)=>state.user);
  const { totalUnreadCount } = useSelector((state) => state.chat);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNot, setAnchorElNot] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (user?.email) {
      socket.emit("signUser", user.email);
    }
  }, [user?.email]);

  // Fetch unread count on mount and when user changes
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUnreadCount());
    }
  }, [user?.email, dispatch]);

  // Socket listeners
  useEffect(() => {
    const handleUserData = (data) => {
      dispatch(refreshUser(data));
    };

    const handleNewMessage = (data) => {
      dispatch(receiveMessage(data.message));
      dispatch(fetchUnreadCount());
      dispatch(fetchConversations());
    };

    const handleOnline = ({ email }) => {
      dispatch(setOnlineStatus(email, true));
    };

    const handleOffline = ({ email }) => {
      dispatch(setOnlineStatus(email, false));
    };

    socket.on('user', handleUserData);
    socket.on('newMessage', handleNewMessage);
    socket.on('userOnline', handleOnline);
    socket.on('userOffline', handleOffline);

    return () => {
      socket.off('user', handleUserData);
      socket.off('newMessage', handleNewMessage);
      socket.off('userOnline', handleOnline);
      socket.off('userOffline', handleOffline);
    };
  }, [dispatch]);

  
  const handleOpenNot = (event) => {
    setAnchorElNot(event.currentTarget);
  };

  const handleCloseNot = () => {
    setAnchorElNot(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
   
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    
  };

  const handleCloseUserMenu = (e) => {
   setAnchorElUser(null);
  };

  return (
    <AppBar  elevation={10} position="static">
    <Container maxWidth="xl">
        <Toolbar disableGutters>
        <MenuItem sx={{display: { xs: "flex" }}} component={Link} to="/posts?page=1">
          <Typography
            variant="h5"
            noWrap
           
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
              color: "inherit",
              "@media (max-width: 900px)": {
              content: "'WW'",
              }
            }}
          >
           {medium? "WW":"WebWeave"}
          </Typography>
          </MenuItem>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
               {pages?.map((page) => (
              <MenuItem
                key={page}
                
                component={Link}
                
                to={`/${page.trim().toLowerCase().replace(" ","")}`}
                onClick={handleCloseNavMenu}
              
              >
              
               {page==="Friends"&&<Diversity3Icon fontSize="large" />}
               {page==="Create Post"&&<ArticleIcon fontSize="large"  />}
               {page==="About"&&<QuestionMarkIcon fontSize="large"  />}
              </MenuItem>
            ))}
              <Box display={"flex"} justifyContent={"center"} >
              <MaterialUISwitch sx={{ml:1}}  checked={dark} onChange={(e)=> {setDark(e.target.checked)}}/>
              </Box>
            </Menu>
          </Box>
 
          <Box ml={2} sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages?.map((page) => (
              <MenuItem
                key={page}
                
                component={Link}
                
                to={`/${page.trim().toLowerCase().replace(" ","")}`}
                onClick={handleCloseNavMenu}
              
              >
              
               {page==="Friends"&&<Diversity3Icon fontSize="large" />}
               {page==="Create Post"&&<ArticleIcon fontSize="large"  />}
               {page==="About"&&<QuestionMarkIcon fontSize="large"  />}
              </MenuItem>
            ))}
            <ButtonBase disableRipple disableTouchRipple sx={{cursor:"default"}}>
            <MaterialUISwitch sx={{ml:1}} checked={dark} onChange={(e)=> setDark(e.target.checked)}  />
            </ButtonBase>
          </Box>
          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              
              <Box sx={{ display: { xs: 'flex' } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={() => setChatOpen(true)}
            >
              <Badge badgeContent={totalUnreadCount} color="error">
                <ChatIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleOpenNot}
            >
              <Badge badgeContent={user?.requests?.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
             <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml:2 }}>
            
                  <Avatar sx={{ width: 50, height: 50 }} alt={user.name} src={user.picture}>
                    {user.name?.charAt(0)}
                  </Avatar>
                
                </IconButton>
          </Box>
          <Popover
            open={Boolean(anchorElNot)}
            anchorEl={anchorElNot}
            onClose={handleCloseNot}
            anchorOrigin={{
            vertical: 'bottom',
             horizontal: 'left',
             }}
            >
        <MenuItem component={Link}  to={`/friends`} ><Typography sx={{ p: 1 }}>{user?.requests?.length>0&&`You have ${user?.requests?.length} friend requests!`}</Typography></MenuItem>
      </Popover>
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  setting !== "Sign Out"? 
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                 
                    <Typography component={Link}  to={`/${setting}`} sx={{textDecoration:"none", color:"inherit"}} id={setting} textAlign="center">
                      {setting}
                    </Typography>
                   
                  </MenuItem>
                  :
                  <MenuItem key={setting} onClick={()=>{handleCloseUserMenu(); dispatch(signOut(navigate));}}>
                    <Typography id={setting} textAlign="center">
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
      
            <MenuItem  component={Link} to="/signin">
           
              <Typography variant="h6">Sign In</Typography>
           
            </MenuItem>
         
          )}
          

        </Toolbar>
     </Container>
     <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </AppBar>
  );
}
export default NavBar;

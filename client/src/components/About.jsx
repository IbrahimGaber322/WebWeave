import React, { useState } from 'react';
import { Container, Typography, Grid, TextField, Button, Box } from '@mui/material';
import LinkM from "@mui/material/Link";
import astronaut from "../images/_Pngtree_astronaut_spaceflight_5420858-removebg.png";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { feedback } from '../actions/user';

const About = () => {
  const dispatch = useDispatch();
  const user = useSelector(state=> state.user); 
  const [formData, setFormData] = useState({name:"",email:"",message:""});
  const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value});
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(feedback(formData));
  }

  return (
    <Grid container height={"80vh"} my={"auto"}  sx={{
        position:"relative",
        "&:before":{
            content:'""',
            position:"absolute",
            top:0,
            bottom:0,
            left:0,
            right:0,
            backgroundImage: `url(${astronaut})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "auto 100%",
            backgroundPosition: "right",
            opacity:0.5}
      }}  >
    <Grid item position={"relative"} p={3} height={"fit-content"} xs={12} md={6} sx={{':hover':{cursor:"default"}}}
          >
     <Typography gutterBottom  textAlign={'center'} mt={3}  variant='h2' >Hi there !</Typography>
     <Typography gutterBottom textAlign={'center'}  variant='h5'>I'm Ibrahim Gaber and...</Typography>
     <Typography gutterBottom  textAlign={'center'} m={"auto"} maxWidth={"sm"} variant="body1">
     ...I'm a junior web developer. I built this social media website using the MERN stack and MUI. I'm always looking for ways to improve my skills and knowledge in web development, and I enjoy taking on new challenges.
          </Typography>
          <Typography gutterBottom mt={2}  textAlign={'center'}   variant="body1">
        To know more about me you can visit my <LinkM>Portfolio</LinkM> or my <LinkM component={Link} to={'/profile/ibrahimseda322@gmail.com'}>Profile</LinkM>.
          </Typography>
     </Grid>
     <Grid item position={"relative"} p={3}  xs={12} display={'flex'} justifyContent={'center'}>
          
          <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>Give me your feedback</Typography>
      <Box component={"form"} onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Your Name"
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Your Email"
          type="email"
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Your Message"
          multiline
          rows={4}
          name='message'
          value={formData.message}
          onChange={handleChange}
          inputProps={{ maxLength: 100 }}
          required
        />
        <Button sx={{mt:1}} variant="outlined" color="primary" type="submit">Submit</Button>
      </Box>
    </Container>
     </Grid>
     {!user&&(
        <LinkM component={Link} to={'/signin'} sx={{postion:"absolute", bottom:0, left:0, m:1}}>
            Return to sign in
        </LinkM>
     )}
    </Grid>
    
  );
}

export default About;

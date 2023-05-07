import { Box, Button, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { confirmEmail } from "../actions/user";

const ConfirmEmail = () =>{
    const navigate = useNavigate();
    const { token } = useParams();
    const dispatch = useDispatch();
    const handleCLick = ()=>{
        dispatch(confirmEmail(token,navigate));
    }
    useEffect(()=>{
        if(token){
            dispatch(confirmEmail(token,navigate));
        }
    },[dispatch,token,navigate])

return(token?
    <Box height={600} display={"flex"} flexWrap={"wrap"} justifyContent={"center"} alignContent={"center"}>
    <Paper>
    <Typography>You will be redirected automatically, if not:</Typography>
    <Button onClick={handleCLick}>Click here to confirm email</Button>
    </Paper>
    </Box>
    :
    <Box height={600} display={"flex"} flexWrap={"wrap"} justifyContent={"center"} alignContent={"center"}>
    <Paper>
    <Typography >Please check the conformation email in your mailbox.</Typography>
    </Paper>
    </Box>
)

}

export default ConfirmEmail;
import React from "react";
import {
  Grid
} from "@mui/material";

import Posts from "./posts/Posts";
import Pag from "./pag/Pag";
import Search from "./search/Search";




const Home = () => {



 
  
  return (
   
      
        <Grid mt={1} container spacing={3}>
         
          <Grid  item xs={12} >
            <Posts />
          </Grid>
          <Grid
            mt={{sm:3}}
            
            item
            xs={12}
           
          >
         
               <Search />
         </Grid>
          <Grid
            pb={3}
            display="flex"
            justifyContent="center"
            item
            xs={12}
          >
            <Pag />
          </Grid>
        </Grid>
     

  );
};

export default Home;

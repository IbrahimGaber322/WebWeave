import jwt from "jsonwebtoken";

const user = (req, res, next) => {
 
       
      
    
   
    try {
        
        const token = req?.headers?.authorization?.split(" ")[1];
      
       if(token){
        jwt.verify(token, 'test', (err,decoded)=>{
           if(err){
            res.json("Unauthinticated");
           }else{
            req.userEmail = decoded?.email;
            req.token = token;
            next();
           }
        });
    
        }else{
            res.json("Unauthinticated");
        }
        
    
        
    } catch (error) {
        console.log(error);
    }
}

export default user ;
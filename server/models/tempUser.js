import mongoose from "mongoose";
import { userSchecma } from "./user.js";



const TempUser = mongoose.model("tempUser", userSchecma);


export default TempUser;

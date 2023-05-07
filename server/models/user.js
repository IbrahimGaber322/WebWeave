import mongoose from "mongoose";



export const userSchecma = mongoose.Schema({
  firstName: { type:String, require: true },
  lastName: { type:String, require: true },
  email: { type:String, require: true },
  googleCred: {type:String},
  picture: { type:String },
  password: { type:String, require: true },
  name:{type: String},
  confirmed: {type:Boolean,default:false},
  friends: {
    type:[{email:String, name:String, picture:String}],
    default : [],
   },
   requests: {
    type:[{email:String, name:String, picture:String}],
    default : [],
   },
   about:{type:String},
   cover:{type:String}
});



const User = mongoose.model("User", userSchecma);


export default User;

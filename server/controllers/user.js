import dotenv from 'dotenv';
dotenv.config();
import User from "../models/user.js";
import TempUser from "../models/tempUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { io} from '../index.js';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  }
});

export const signUp = async(req, res) => {
    
    const user = req.body ;
    try {  
        const existingUser = await User.findOne({email:user.email});
        if (existingUser) return res.status(400).json({message:"This email is already used."});
        const hashedPassword = await bcrypt.hash(user.password, 12);
        if(user.google){
            const newUser = new User({...user, password:hashedPassword, confirmed:true});
            await newUser.save();
            const {name,email,picture,firstName,lastName} = newUser;
            const token = jwt.sign({email:email}, 'test', {expiresIn: "24h"});
            res.status(200).json({token,name,picture,email, firstName, lastName});
        }else{
        const newTempUser = new TempUser({...user, password:hashedPassword});
        await newTempUser.save();
        const {name,email,_id} = newTempUser;
        const token = jwt.sign({_id:_id}, 'test', {expiresIn: "5min"});
        
        const mailOptions = {
          from: EMAIL_USER,
          to: email,
          subject: 'Confirm your account',
          html: `<p>Hi ${name},</p><p>Thank you for signing up to our service. Please click on the link below to confirm your account:</p><a href="http://localhost:3000/confirmEmail/${token}">Confirm your account</a>`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        
        res.status(200).json({message: "need confirm"});
    }
    } catch (error) {
        res.status(500).json("database error");
    }
}

export const confirmEmail = async(req, res) => {
    
  const {token} = req.params;
  try {
    const decodedToken = jwt.verify(token, 'test');
    const _id = decodedToken._id;
    const tempUser = await TempUser.findOneAndUpdate({_id:_id},{confirmed:true},{new:true});
    const newUser = new User({_id:tempUser._id, name:tempUser.name, firstName:tempUser.firstName, lastName:tempUser.lastName, password:tempUser.password, email:tempUser.email, picture:tempUser.picture, googleCred:tempUser.googleCred, confirmed:tempUser.confirmed});
    await newUser.save();
    if (newUser) {
      const {name,picture,email, firstName, lastName,friends,requests,cover,about} = newUser;
      const newToken = jwt.sign({email:email}, 'test', {expiresIn: "24h"});
      res.status(200).json({token:newToken,name,picture,email, firstName, lastName,friends,requests,cover,about});
    } else {
      res.status(404).json("no account");
    }
  } catch (error) {
    res.status(500).json("database error");
  }
}

export const signIn = async(req, res) => {
    
    const user = req.body ;

    try {
        const foundUser = await User.findOne({email:user.email});
        if(!foundUser){
            const tempUser = await TempUser.findOne({email:user.email});
            if(tempUser){
                const {name,email,_id} = tempUser;
            const token = jwt.sign({_id:_id}, 'test', {expiresIn: "5min"});
            const mailOptions = {
              from: EMAIL_USER,
              to: email,
              subject: 'Confirm your account',
              html: `<p>Hi ${name},</p><p>Thank you for signing up to our service. Please click on the link below to confirm your account:</p><a href="http://localhost:3000/confirmEmail/${token}">Confirm your account</a>`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
             res.status(200).json({confirmed:false});
        }else{
            res.status(404).json({message: "User doesn't exist."});
        }
        }else{
            const {name,picture,email, firstName, lastName,friends,requests,cover,about} = foundUser;
        if(!user.google){
        const passwordValidate = await bcrypt.compare(user.password, foundUser.password);  
        if(!passwordValidate) return res.status(400).json({message: "Password is incorrect."});
        }
        const token = jwt.sign({email:email}, 'test', {expiresIn: "24h"});
         
        res.status(200).json({token,name,picture,email, firstName, lastName, confirmed:true,friends,requests,cover,about});
    }
    } catch (error) {
        console.log(error);
        res.status(500).json("database error");
    }

}





export const editProfile = async(req, res) => {
    
    const user = req.body ;
    const {token, userEmail} = req;
    
    try {
        if(user?.email === userEmail){
        const editedUser = await User.findOneAndUpdate({email:user.email}, user, {
            new: true
          });
        

        
        const {name,picture,email, firstName, lastName,friends,requests,cover,about} = editedUser;
        res.status(200).json({token,name,picture,email, firstName, lastName,friends,requests,cover,about});
        
       }else{
        res.json("Unauthinticated");
       }
    } catch (error) {
        res.status(500).json("database error");
    }
}

export const addFriend = async(req, res) => {
    
    const {friendEmail} = req.body ;
    const {userEmail,token} = req;
    
    try {
        
        const user = await User.findOne({email:userEmail});
        const friend = await User.findOne({email:friendEmail});
        
    if(user&&friend){
        if(user.friends.some(f => f.email ===friendEmail)){
            res.status(200).json("friend already exists");
            
        }else{
            
            if(user.requests.some(r=> r.email === friendEmail)){
              
            user.friends.push({name:friend.name, email:friend.email, picture:friend.picture});
            const index = user.requests.findIndex(r=>r.email===friendEmail);
            
            user.requests.splice(index, 1);
            const updatedUser = await User.findOneAndUpdate({email:userEmail}, {...user,friends:user.friends,requests:user.requests}, {
                new: true
              });
              const {name,picture,email, firstName, lastName,friends,requests,cover,about} = updatedUser;
              res.status(200).json({token,name,picture,email, firstName, lastName,friends,requests,cover,about});
              friend.friends.push({name:name, email:email, picture:picture});
              const updatedFriend = await User.findOneAndUpdate({email:friendEmail}, {...friend,friends:friend.friends},{new:true});
              io.to(friendEmail).emit("user",{friends:updatedFriend.friends, requests:updatedFriend.requests});
            }else{
                if(friend.requests.some(r=> r.email=== userEmail)){
                   res.status(409).json("request already sent");
                }else{
                  
                     friend.requests.push({name:user.name, email:user.email, picture:user.picture});
                    const updatedFriend = await User.findOneAndUpdate({email:friendEmail}, {...friend,requests:friend.requests},{new:true});
                    io.to(friendEmail).emit("user",{friends:updatedFriend.friends, requests:updatedFriend.requests});
                }
            }
        }
    }
    else {
        res.status(404).json("database error");
    }
    } catch (error) {
        res.status(500).json("database error");
    }
}

export const removeFriend = async(req, res) => {
    
    const {friendEmail} = req.body ;
    const {userEmail, token} = req;
    try {
        const friend = await User.findOne({email:friendEmail});
        const user = await User.findOne({email:userEmail});
    if(user){
       
   
        if(!user.friends.some(friend=>friend.email === friendEmail)){
          if(!user.requests.some(r=>r.email === friendEmail)){
            res.status(200).json("friend already removed");
          }else{
            const index = user.requests.findIndex(r=> r.email === friendEmail);
            user.requests.splice(index, 1);
            const updatedUser = await User.findOneAndUpdate({email:user.email}, {...user, requests:user.requests}, {
                new: true
              });
              const {name,picture,email, firstName, lastName, requests,friends,cover,about} = updatedUser;
              res.status(200).json({token,name,picture,email, firstName, lastName,friends,requests,cover,about});
          }
        }else{
            const userIndex = user.friends.findIndex(f=>f.email===friendEmail);
            const friendIndex = friend.friends.findIndex(f=>f.email===userEmail);
            user.friends.splice(userIndex, 1);
            friend.friends.splice(friendIndex, 1);
            const updatedUser = await User.findOneAndUpdate({email:userEmail}, {...user, friends:user.friends}, {
                new: true
              });
              const {name,picture,email, firstName, lastName, requests,friends,cover,about} = updatedUser;
              res.status(200).json({token,name,picture,email, firstName, lastName,friends,requests,cover,about});
              const updatedFriend = await User.findOneAndUpdate({email:friendEmail}, {...friend,friends:friend.friends}, {
                new: true
              });
              io.to(friendEmail).emit("user",{friends:updatedFriend.friends, requests:updatedFriend.requests});
        }
    }
    else {
        res.status(404).json("database error");
    }
    } catch (error) {
        res.status(500).json("database error");
    }
}

export const getOtherUser = async(req,res) =>{
  
  const {otherUserEmail} = req.params;
  try {
    const otherUser = await User.findOne({email:otherUserEmail});
    if(otherUser){
      const {name,picture,email, firstName, lastName, requests,friends,cover,about} = otherUser;
    res.status(200).json({name,picture,email, firstName, lastName, requests,friends,cover,about});
    }else{
      res.status(404).json("no user");
    }
  } catch (error) {
    console.log(error);
  }
}

export const forgotPassword = async(req, res) => {
  
  const {userEmail} = req.body ;
  
  try {  
      const user = await User.findOne({email:userEmail});
      if (!user) return res.status(400).json({message:"no user with this email"});
      const {name,email,_id} = user;
      const token = jwt.sign({_id:_id}, 'test', {expiresIn: "5min"});
      
      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Reset your password',
        html: `<p>Hi ${name}, Please click on the link below to reset your password:</p><a href="http://localhost:3000/resetpassword/${token}">Reset your password</a>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      
      res.status(200).json({message: "success"});
  
  } catch (error) {
      res.status(500).json("database error");
  }
}

export const resetPassword = async(req, res) => {
  
const {password,token} = req.body;

try {
  const decodedToken = jwt.verify(token, 'test');
  const _id = decodedToken._id;
  const user = await User.findById(_id);
  
  const hashedPassword = await bcrypt.hash(password, 12);
  await User.findByIdAndUpdate(_id, {password:hashedPassword});
  res.status(200).json({message:"success"})
} catch (error) {
  res.status(500).json("database error");
}
}

export const feedback = async(req, res) => {
  
  const {name, email, message} = req.body ;
  try {  
      const mailOptions = {
        from: EMAIL_USER,
        to: EMAIL_USER,
        subject: 'Feed back',
        html: `<p>name: ${name}</p><p>email: ${email}</p><p>message: ${message}</p>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      
      res.status(200).json("success");

  } catch (error) {
      res.status(500).json("database error");
  }
}
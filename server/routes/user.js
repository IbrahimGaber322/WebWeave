import express from "express";
import { signUp, signIn, editProfile, confirmEmail, addFriend, removeFriend, getOtherUser, forgotPassword, resetPassword, feedback } from "../controllers/user.js";
import user from "../middleware/user.js";
const router = express.Router();


router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/editProfile',user, editProfile);
router.get('/confirmEmail/:token', confirmEmail);
router.post('/addFriend',user,addFriend);
router.post('/removeFriend',user,removeFriend);
router.get('/getOtherUser/:otherUserEmail',getOtherUser);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

router.post('/feedback', feedback);


export default router;


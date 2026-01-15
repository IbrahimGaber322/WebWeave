import express from "express";
import { signUp, signIn, editProfile, confirmEmail, addFriend, removeFriend, getOtherUser, forgotPassword, resetPassword, feedback } from "../controllers/user.js";
import user from "../middleware/user.js";
import {
    signUpValidation,
    signInValidation,
    editProfileValidation,
    confirmEmailValidation,
    addFriendValidation,
    removeFriendValidation,
    getOtherUserValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    feedbackValidation
} from "../middleware/validators/userValidators.js";

const router = express.Router();

router.post('/signUp', signUpValidation, signUp);
router.post('/signIn', signInValidation, signIn);
router.post('/editProfile', user, editProfileValidation, editProfile);
router.get('/confirmEmail/:token', confirmEmailValidation, confirmEmail);
router.post('/addFriend', user, addFriendValidation, addFriend);
router.post('/removeFriend', user, removeFriendValidation, removeFriend);
router.get('/getOtherUser/:otherUserEmail', getOtherUserValidation, getOtherUser);
router.post('/forgotPassword', forgotPasswordValidation, forgotPassword);
router.post('/resetPassword', resetPasswordValidation, resetPassword);
router.post('/feedback', feedbackValidation, feedback);

export default router;


import User from "../models/user.js";
import TempUser from "../models/tempUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { io } from '../index.js';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'test';
const CLIENT_URL = process.env.CLIENT_URL || 'https://webweave.onrender.com';

// Helper to get email user (lazy load to ensure env vars are available)
const getEmailUser = () => process.env.EMAIL_USER;

// Create transporter lazily to ensure env vars are loaded
let transporter = null;
let transporterVerified = false;

const getTransporter = () => {
    if (!transporter) {
        const EMAIL_USER = process.env.EMAIL_USER;
        const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

        logger.info('Initializing email transporter', {
            hasEmailUser: !!EMAIL_USER,
            hasEmailPassword: !!EMAIL_PASSWORD,
            emailUserValue: EMAIL_USER ? EMAIL_USER.substring(0, 5) + '***' : 'undefined'
        });

        if (!EMAIL_USER || !EMAIL_PASSWORD) {
            logger.error('Email credentials missing', { EMAIL_USER: !!EMAIL_USER, EMAIL_PASSWORD: !!EMAIL_PASSWORD });
        }

        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD,
            }
        });

        // Verify transporter on first creation
        if (!transporterVerified) {
            transporter.verify((error, success) => {
                if (error) {
                    logger.error('Email transporter verification failed', {
                        error: error.message,
                        code: error.code
                    });
                } else {
                    logger.info('Email transporter verified successfully');
                    transporterVerified = true;
                }
            });
        }
    }
    return transporter;
};

export const signUp = async (req, res) => {
    const user = req.body;

    try {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            logger.warn('Sign up attempt with existing email', { email: user.email });
            return res.status(400).json({
                success: false,
                message: "This email is already used."
            });
        }

        const hashedPassword = await bcrypt.hash(user.password, 12);

        if (user.google) {
            const newUser = new User({ ...user, password: hashedPassword, confirmed: true });
            await newUser.save();
            const { name, email, picture, firstName, lastName } = newUser;
            const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: "24h" });

            logger.info('User signed up with Google', { email });
            return res.status(200).json({
                success: true,
                token,
                name,
                picture,
                email,
                firstName,
                lastName
            });
        }

        const newTempUser = new TempUser({ ...user, password: hashedPassword });
        await newTempUser.save();
        const { name, email, _id } = newTempUser;
        const token = jwt.sign({ _id: _id }, JWT_SECRET, { expiresIn: "5min" });

        const mailOptions = {
            from: getEmailUser(),
            to: email,
            subject: 'Confirm your account',
            html: `<p>Hi ${name},</p><p>Thank you for signing up to our service. Please click on the link below to confirm your account:</p><a href="${CLIENT_URL}/confirmEmail/${token}">Confirm your account</a>`
        };

        logger.info('Attempting to send confirmation email (signup)', {
            to: email,
            from: getEmailUser(),
            subject: 'Confirm your account'
        });

        getTransporter().sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error('Failed to send confirmation email', {
                    email,
                    error: error.message,
                    code: error.code,
                    command: error.command,
                    responseCode: error.responseCode
                });
            } else {
                logger.info('Confirmation email sent successfully (signup)', {
                    email,
                    response: info.response,
                    messageId: info.messageId,
                    accepted: info.accepted,
                    rejected: info.rejected
                });
            }
        });

        logger.info('User signed up, awaiting email confirmation', { email });
        return res.status(200).json({
            success: true,
            message: "need confirm"
        });

    } catch (error) {
        logger.error('Sign up error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred during sign up. Please try again."
        });
    }
};

export const confirmEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const _id = decodedToken._id;

        const tempUser = await TempUser.findOneAndUpdate(
            { _id: _id },
            { confirmed: true },
            { new: true }
        );

        if (!tempUser) {
            logger.warn('Email confirmation failed - temp user not found', { tokenId: _id });
            return res.status(404).json({
                success: false,
                message: "Account not found or already confirmed"
            });
        }

        const newUser = new User({
            _id: tempUser._id,
            name: tempUser.name,
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            password: tempUser.password,
            email: tempUser.email,
            picture: tempUser.picture,
            googleCred: tempUser.googleCred,
            confirmed: tempUser.confirmed
        });

        await newUser.save();
        await TempUser.findByIdAndDelete(_id);

        const { name, picture, email, firstName, lastName, friends, requests, cover, about } = newUser;
        const newToken = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: "24h" });

        logger.info('Email confirmed successfully', { email });
        return res.status(200).json({
            success: true,
            token: newToken,
            name,
            picture,
            email,
            firstName,
            lastName,
            friends,
            requests,
            cover,
            about
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            logger.warn('Email confirmation token expired');
            return res.status(400).json({
                success: false,
                message: "Confirmation link has expired. Please sign up again."
            });
        }
        if (error.name === 'JsonWebTokenError') {
            logger.warn('Invalid email confirmation token');
            return res.status(400).json({
                success: false,
                message: "Invalid confirmation link."
            });
        }
        logger.error('Email confirmation error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred during email confirmation."
        });
    }
};

export const signIn = async (req, res) => {
    const user = req.body;

    try {
        const foundUser = await User.findOne({ email: user.email });

        if (!foundUser) {
            const tempUser = await TempUser.findOne({ email: user.email });

            if (tempUser) {
                const { name, email, _id } = tempUser;
                const token = jwt.sign({ _id: _id }, JWT_SECRET, { expiresIn: "5min" });

                const mailOptions = {
                    from: getEmailUser(),
                    to: email,
                    subject: 'Confirm your account',
                    html: `<p>Hi ${name},</p><p>Thank you for signing up to our service. Please click on the link below to confirm your account:</p><a href="${CLIENT_URL}/confirmEmail/${token}">Confirm your account</a>`
                };

                logger.info('Attempting to send confirmation email', {
                    to: email,
                    from: getEmailUser(),
                    subject: 'Confirm your account'
                });

                getTransporter().sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error('Email send error:', error);
                        logger.error('Failed to resend confirmation email', {
                            email,
                            error: error.message,
                            code: error.code,
                            command: error.command,
                            responseCode: error.responseCode
                        });
                    } else {
                        logger.info('Confirmation email sent successfully', {
                            email,
                            response: info.response,
                            messageId: info.messageId,
                            accepted: info.accepted,
                            rejected: info.rejected
                        });
                    }
                });

                return res.status(200).json({
                    success: true,
                    confirmed: false,
                    message: "Please check your email to confirm your account."
                });
            }

            logger.warn('Sign in attempt with non-existent email', { email: user.email });
            return res.status(404).json({
                success: false,
                message: "User doesn't exist."
            });
        }

        const { name, picture, email, firstName, lastName, friends, requests, cover, about } = foundUser;

        if (!user.google) {
            const passwordValidate = await bcrypt.compare(user.password, foundUser.password);
            if (!passwordValidate) {
                logger.warn('Sign in attempt with incorrect password', { email: user.email });
                return res.status(400).json({
                    success: false,
                    message: "Password is incorrect."
                });
            }
        }

        const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: "24h" });

        logger.info('User signed in successfully', { email });
        return res.status(200).json({
            success: true,
            token,
            name,
            picture,
            email,
            firstName,
            lastName,
            confirmed: true,
            friends,
            requests,
            cover,
            about
        });

    } catch (error) {
        logger.error('Sign in error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred during sign in. Please try again."
        });
    }
};

export const editProfile = async (req, res) => {
    const user = req.body;
    const { token, userEmail } = req;

    try {
        if (user?.email !== userEmail) {
            logger.warn('Unauthorized profile edit attempt', { userEmail, targetEmail: user?.email });
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this profile."
            });
        }

        const editedUser = await User.findOneAndUpdate(
            { email: user.email },
            user,
            { new: true }
        );

        if (!editedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const { name, picture, email, firstName, lastName, friends, requests, cover, about } = editedUser;

        logger.info('Profile updated successfully', { email });
        return res.status(200).json({
            success: true,
            token,
            name,
            picture,
            email,
            firstName,
            lastName,
            friends,
            requests,
            cover,
            about
        });

    } catch (error) {
        logger.error('Edit profile error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating profile."
        });
    }
};

export const addFriend = async (req, res) => {
    const { friendEmail } = req.body;
    const { userEmail, token } = req;

    try {
        const user = await User.findOne({ email: userEmail });
        const friend = await User.findOne({ email: friendEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (!friend) {
            logger.warn('Add friend attempt - friend not found', { userEmail, friendEmail });
            return res.status(404).json({
                success: false,
                message: "User with this email not found."
            });
        }

        if (userEmail === friendEmail) {
            return res.status(400).json({
                success: false,
                message: "You cannot add yourself as a friend."
            });
        }

        if (user.friends.some(f => f.email === friendEmail)) {
            return res.status(200).json({
                success: true,
                message: "Already friends."
            });
        }

        if (user.requests.some(r => r.email === friendEmail)) {
            user.friends.push({ name: friend.name, email: friend.email, picture: friend.picture });
            const index = user.requests.findIndex(r => r.email === friendEmail);
            user.requests.splice(index, 1);

            const updatedUser = await User.findOneAndUpdate(
                { email: userEmail },
                { friends: user.friends, requests: user.requests },
                { new: true }
            );

            const { name, picture, email, firstName, lastName, friends, requests, cover, about } = updatedUser;

            friend.friends.push({ name: name, email: email, picture: picture });
            const updatedFriend = await User.findOneAndUpdate(
                { email: friendEmail },
                { friends: friend.friends },
                { new: true }
            );

            io.to(friendEmail).emit("user", { friends: updatedFriend.friends, requests: updatedFriend.requests });

            logger.info('Friend request accepted', { userEmail, friendEmail });
            return res.status(200).json({
                success: true,
                token,
                name,
                picture,
                email,
                firstName,
                lastName,
                friends,
                requests,
                cover,
                about
            });
        }

        if (friend.requests.some(r => r.email === userEmail)) {
            return res.status(409).json({
                success: false,
                message: "Friend request already sent."
            });
        }

        friend.requests.push({ name: user.name, email: user.email, picture: user.picture });
        const updatedFriend = await User.findOneAndUpdate(
            { email: friendEmail },
            { requests: friend.requests },
            { new: true }
        );

        // Debug: Check if friend is in a socket room
        const roomSockets = io.sockets.adapter.rooms.get(friendEmail);
        logger.info('Emitting friend request notification', {
            to: friendEmail,
            roomExists: !!roomSockets,
            socketsInRoom: roomSockets?.size || 0,
            requestsCount: updatedFriend.requests?.length
        });

        io.to(friendEmail).emit("user", { friends: updatedFriend.friends, requests: updatedFriend.requests });

        logger.info('Friend request sent', { userEmail, friendEmail });
        return res.status(200).json({
            success: true,
            message: "Friend request sent."
        });

    } catch (error) {
        logger.error('Add friend error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding friend."
        });
    }
};

export const removeFriend = async (req, res) => {
    const { friendEmail } = req.body;
    const { userEmail, token } = req;

    try {
        const friend = await User.findOne({ email: friendEmail });
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isFriend = user.friends.some(f => f.email === friendEmail);
        const hasRequest = user.requests.some(r => r.email === friendEmail);

        if (!isFriend && !hasRequest) {
            return res.status(200).json({
                success: true,
                message: "Already removed."
            });
        }

        if (hasRequest && !isFriend) {
            const index = user.requests.findIndex(r => r.email === friendEmail);
            user.requests.splice(index, 1);

            const updatedUser = await User.findOneAndUpdate(
                { email: userEmail },
                { requests: user.requests },
                { new: true }
            );

            const { name, picture, email, firstName, lastName, requests, friends, cover, about } = updatedUser;

            logger.info('Friend request declined', { userEmail, friendEmail });
            return res.status(200).json({
                success: true,
                token,
                name,
                picture,
                email,
                firstName,
                lastName,
                friends,
                requests,
                cover,
                about
            });
        }

        if (isFriend && friend) {
            const userIndex = user.friends.findIndex(f => f.email === friendEmail);
            const friendIndex = friend.friends.findIndex(f => f.email === userEmail);

            user.friends.splice(userIndex, 1);
            if (friendIndex !== -1) {
                friend.friends.splice(friendIndex, 1);
            }

            const updatedUser = await User.findOneAndUpdate(
                { email: userEmail },
                { friends: user.friends },
                { new: true }
            );

            const { name, picture, email, firstName, lastName, requests, friends, cover, about } = updatedUser;

            if (friend) {
                const updatedFriend = await User.findOneAndUpdate(
                    { email: friendEmail },
                    { friends: friend.friends },
                    { new: true }
                );
                io.to(friendEmail).emit("user", { friends: updatedFriend.friends, requests: updatedFriend.requests });
            }

            logger.info('Friend removed', { userEmail, friendEmail });
            return res.status(200).json({
                success: true,
                token,
                name,
                picture,
                email,
                firstName,
                lastName,
                friends,
                requests,
                cover,
                about
            });
        }

    } catch (error) {
        logger.error('Remove friend error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred while removing friend."
        });
    }
};

export const getOtherUser = async (req, res) => {
    const { otherUserEmail } = req.params;

    try {
        const otherUser = await User.findOne({ email: otherUserEmail });

        if (!otherUser) {
            logger.warn('Get other user - user not found', { email: otherUserEmail });
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const { name, picture, email, firstName, lastName, requests, friends, cover, about } = otherUser;

        return res.status(200).json({
            success: true,
            name,
            picture,
            email,
            firstName,
            lastName,
            requests,
            friends,
            cover,
            about
        });

    } catch (error) {
        logger.error('Get other user error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching user data."
        });
    }
};

export const forgotPassword = async (req, res) => {
    const { email: userEmail } = req.body;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            logger.warn('Forgot password - user not found', { email: userEmail });
            return res.status(404).json({
                success: false,
                message: "No user found with this email."
            });
        }

        const { name, email, _id } = user;
        const token = jwt.sign({ _id: _id }, JWT_SECRET, { expiresIn: "5min" });

        const mailOptions = {
            from: getEmailUser(),
            to: email,
            subject: 'Reset your password',
            html: `<p>Hi ${name}, Please click on the link below to reset your password:</p><a href="${CLIENT_URL}/resetpassword/${token}">Reset your password</a>`
        };

        getTransporter().sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error('Failed to send password reset email', { email, error: error.message });
            } else {
                logger.info('Password reset email sent', { email });
            }
        });

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email."
        });

    } catch (error) {
        logger.error('Forgot password error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred. Please try again."
        });
    }
};

export const resetPassword = async (req, res) => {
    const { password, token } = req.body;

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const _id = decodedToken._id;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.findByIdAndUpdate(_id, { password: hashedPassword });

        logger.info('Password reset successfully', { userId: _id });
        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            logger.warn('Password reset token expired');
            return res.status(400).json({
                success: false,
                message: "Reset link has expired. Please request a new one."
            });
        }
        if (error.name === 'JsonWebTokenError') {
            logger.warn('Invalid password reset token');
            return res.status(400).json({
                success: false,
                message: "Invalid reset link."
            });
        }
        logger.error('Reset password error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred while resetting password."
        });
    }
};

export const feedback = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const mailOptions = {
            from: getEmailUser(),
            to: getEmailUser(),
            subject: 'Feedback from WebWeave',
            html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
        };

        getTransporter().sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error('Failed to send feedback email', { error: error.message });
                return res.status(500).json({
                    success: false,
                    message: "Failed to send feedback. Please try again."
                });
            } else {
                logger.info('Feedback email sent', { fromEmail: email });
                return res.status(200).json({
                    success: true,
                    message: "Feedback sent successfully."
                });
            }
        });

    } catch (error) {
        logger.error('Feedback error', { error: error.message, stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An error occurred while sending feedback."
        });
    }
};

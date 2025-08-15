import { User } from "../models/User.js"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
export const Register = async (req, res) => {
    try {
        
        const hashpassword = await bcrypt.hash(req.body.password, 10);
        
        const newuser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashpassword
        });
        
        await newuser.save();

        return res.status(201).json({
            message: "User Created Successfully!",
            user: newuser
        });

    } catch (error) {
        console.error("Registration Error:", error);

    
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later."
        });
    }
};

export const Login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check for required fields
        if (!username || !password) {
            return res.status(400).json("All Field Required To filled");
        }

        // Find the user by username
        const user = await User.findOne({ username: username });
        
        // Handle case where user is not found
        if (!user) {
            return res.status(404).json({ status: 404, message: "User Not Found" });
        }

        // Compare the provided password with the stored hashed password
        const ismatch = await bcrypt.compare(password, user.password);

        // Handle case where password does not match
        if (!ismatch) {
            return res.status(404).json({
                status: 404,
                message: "Incorrect password"
            });
        }
        
        // If login is successful, create the token
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.Secrat);
        
        // Send the token in a cookie and return a success JSON response
        return res
            .cookie("access_token", token, {
                httpOnly: true,
                // Add secure: true if you are using HTTPS
                // secure: process.env.NODE_ENV === "production" ? true : false,
            })
            .status(200)
            .json({
                status: 200,
                message: "Login Successfully",
                user: user,
            });

    } catch (error) {
        // Log the error for debugging purposes
        console.error("Login Error:", error);

        // Send a generic 500 server error response without trying to set a cookie
        return res.status(500).json({
            message: "An internal server error occurred.",
            error: error.message // It's better to send the error message than the whole object
        });
    }
};
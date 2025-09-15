import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const Register = async (req, res) => {
  try {
    console.log("👤 Creating new user with data:", {
      username: req.body.username,
      email: req.body.email,
      isAdmin: req.body.isAdmin || false
    });

    const hashpassword = await bcrypt.hash(req.body.password, 10);

    const newuser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashpassword,
      isAdmin: req.body.isAdmin || false,
    });

    await newuser.save();

    // Create JWT token for the new user
    const token = jwt.sign(
      { id: newuser._id, isAdmin: newuser.isAdmin },
      process.env.JWT_SECRET
    );

    console.log("✅ User registered successfully:", newuser._id);
    console.log("👤 Username:", newuser.username);
    console.log("📧 Email:", newuser.email);
    console.log("🔑 Admin status:", newuser.isAdmin);
    console.log("🎫 JWT token generated");

    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(201)
      .json({
        message: "User Created Successfully!",
        user: newuser,
        token: token,
      });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt for email:", email);
    console.log("📝 Request body:", req.body);

    // Check for required fields
    if (!email || !password) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find the user by email
    const user = await User.findOne({ email: email });

    // Handle case where user is not found
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ 
        success: false,
        status: 404, 
        message: "User with this email does not exist" 
      });
    }

    // Compare the provided password with the stored hashed password
    const ismatch = await bcrypt.compare(password, user.password);

    // Handle case where password does not match
    if (!ismatch) {
      console.log("❌ Incorrect password for user:", email);
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Incorrect password",
      });
    }

    // Check if user should be admin based on specific email
    let isAdmin = user.isAdmin;
    const adminEmails = [
      'santoshpatelvns5@gmail.com',
      'admin@easystay.com',
      'admin@booking.com'
    ];
    
    if (adminEmails.includes(email.toLowerCase())) {
      isAdmin = true;
      console.log("🔑 Admin access granted for:", email);
      
      // Update user admin status if not already set
      if (!user.isAdmin) {
        await User.findByIdAndUpdate(user._id, { isAdmin: true });
        console.log("✅ Updated user admin status in database");
      }
    }

    // If login is successful, create the token
    const token = jwt.sign(
      { id: user._id, isAdmin: isAdmin },
      process.env.JWT_SECRET
    );

    console.log("✅ Login successful for user:", email);
    console.log("👤 User ID:", user._id);
    console.log("🔑 Admin status:", isAdmin);
    console.log("🎫 JWT token generated");

    // Create user object with updated admin status
    const userResponse = {
      ...user.toObject(),
      isAdmin: isAdmin
    };

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
        user: userResponse,
        token: token,
      });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("❌ Login Error:", error.message);

    // Send a generic 500 server error response without trying to set a cookie
    return res.status(500).json({
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
};

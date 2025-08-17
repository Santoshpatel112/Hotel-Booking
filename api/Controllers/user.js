import User from "../models/User.js";

export const UpdateUser = async (req, res) => {
    try {
        console.log("👤 Updating user with ID:", req.params.id);
        console.log("📝 Update data:", req.body);

        const user = await User.findById(req.params.id);
        if (!user) {
            console.log("❌ User not found:", req.params.id);
            return res.status(404).json({ message: "User does not exist" });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        
        console.log("✅ User updated successfully:", updatedUser._id);
        console.log("👤 Updated username:", updatedUser.username);
        
        return res.status(200).json({ message: "User Updated Successfully", user: updatedUser });
    } catch (error) {
        console.error("❌ User update error:", error.message);
        return res.status(500).json({ message: "Unable to update user", error: error.message });
    }
};

export const DeleteUser = async (req, res) => {
    try {
        console.log("🗑️ Deleting user with ID:", req.params.id);

        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            console.log("❌ User not found for deletion:", req.params.id);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ User deleted successfully:", deletedUser._id);
        console.log("👤 Deleted username:", deletedUser.username);
        
        return res.status(200).json({ message: "User Deleted Successfully", user: deletedUser });
    } catch (error) {
        console.error("❌ User deletion error:", error.message);
        return res.status(500).json({
            message: "Unable to delete user, something went wrong",
            error: error.message
        });
    }
};

export const GetUserByID = async (req, res) => {
    try {
        console.log("🔍 Fetching user with ID:", req.params.id);

        const getUser = await User.findById(req.params.id);
        if (!getUser) {
            console.log("❌ User not found:", req.params.id);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ User found:", getUser.username);
        console.log("📧 Email:", getUser.email);
        console.log("🔑 Admin status:", getUser.isAdmin);

        return res.status(200).json({ user: getUser });
    } catch (error) {
        console.error("❌ Get user error:", error.message);
        return res.status(500).json({ message: "Unable to find user. Something went wrong.", error: error.message });
    }
};

export const getallUser = async (req, res) => {
    try {
        console.log("👥 Fetching all users...");

        const getall = await User.find();
        
        console.log(`📊 Found ${getall.length} users in database`);
        
        if (getall.length > 0) {
            console.log("👥 Users found:");
            getall.forEach((user, index) => {
                console.log(`  ${index + 1}. ${user.username} (${user.email}) - Admin: ${user.isAdmin}`);
            });
        } else {
            console.log("⚠️ No users found in database");
        }

        return res.status(200).json({ users: getall });
    } catch (err) {
        console.error("❌ Get all users error:", err.message);
        return res.status(500).json({ message: "Unable to find users. Something went wrong.", error: err.message });
    }
};

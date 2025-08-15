import User from "../models/User.js";

export const UpdateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        return res.status(200).json({ message: "User Updated Successfully", user: updatedUser });
    } catch (error) {
        console.error("error", error);
        return res.status(500).json({ message: "Unable to update user", error: error.message });
    }
};

export const DeleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "User Deleted Successfully", user: deletedUser });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete user, something went wrong",
            error: error.message
        });
    }
};

export const GetUserByID = async (req, res) => {
    try {
        const getUser = await User.findById(req.params.id);
        if (!getUser) {
             return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user: getUser });
    } catch (error) {
        return res.status(500).json({ message: "Unable to find user. Something went wrong.", error: error.message });
    }
};

export const getallUser = async (req, res) => {
    try {
        const getall = await User.find();
        return res.status(200).json({ users: getall });
    } catch (err) {
        return res.status(500).json({ message: "Unable to find users. Something went wrong.", error: err.message });
    }
};

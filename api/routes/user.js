import express from "express";
import { verifyAdmin, Verifytoken, verifyUser } from "../utils/Verifytoken.js";
import { UpdateUser, DeleteUser, GetUserByID, getallUser } from "../Controllers/user.js";

const router = express.Router();

// A simple test route to check if a user is authenticated
router.get('/checkAuthenticated', Verifytoken, (req, res) => {
    res.send("Hello User, you are Logged In");
});

router.get('/checkadmin/:id', verifyAdmin, (req, res) => {
    res.send("Hello admin, you are logged in now you can delete all accounts");
});

// A route to update a user, protected by a custom verification middleware
router.put('/:id', verifyUser, UpdateUser);

// A route to delete a user
router.delete('/:id', verifyUser, DeleteUser);

// A route to get a single user by ID
router.get('/:id',verifyUser, GetUserByID);

// A route to get all users
router.get('/', verifyAdmin,getallUser);

export default router;
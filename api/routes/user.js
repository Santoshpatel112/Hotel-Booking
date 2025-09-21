import express from "express";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/Verifytoken.js";
import {
  UpdateUser,
  DeleteUser,
  GetUserByID,
  getallUser,
} from "../Controllers/user.js";

const router = express.Router();

router.get("/checkAuthenticated", verifyToken, (req, res) => {
  res.send("Hello User, you are Logged In");
});

router.get("/checkadmin/:id", verifyAdmin, (req, res) => {
  res.send("Hello admin, you are logged in now you can delete all accounts");
});

router.put("/:id", verifyUser, UpdateUser);

router.delete("/:id", verifyUser, DeleteUser);

router.get("/", verifyAdmin, getallUser);

router.get("/:id", verifyUser, GetUserByID);

export default router;

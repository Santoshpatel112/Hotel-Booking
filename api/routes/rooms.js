import express from "express";
const router = express.Router();

import { CreateRoom, DeleteRoom, UpdateRoom, GetAllRooms, GetRoomByID } from "../Controllers/room.js";
import { verifyAdmin } from "../utils/Verifytoken.js";

router.post("/:hotelid", verifyAdmin, CreateRoom);
router.put("/:id", verifyAdmin, UpdateRoom);
router.delete("/:id/:hotelid", verifyAdmin, DeleteRoom);
router.get("/:id", GetRoomByID);
router.get("/", GetAllRooms);

export default router;
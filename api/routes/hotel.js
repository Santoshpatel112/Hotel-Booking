import express from "express";
const router = express.Router();
import hotelController from "../Controllers/hotel.js";
import { verifyAdmin } from "../utils/Verifytoken.js";
// create

router.post("/", verifyAdmin, hotelController.CreateHotel);
//update
router.put("/update/:id", verifyAdmin, hotelController.UpdateHotel);
//delete
router.delete("/delete/:id", verifyAdmin, hotelController.DeleteHotel);
//get
router.get("/get/:id", hotelController.GetHotelByID);
//get all
router.get("/getall", hotelController.getallHotel);
router.get("/countByCity", hotelController.countByCity);
router.get("/countByCityDetailed", hotelController.countByCityDetailed);
router.get("/test-db", hotelController.testDatabase);
// router.get('/countByType',getHotel);
export default router;

import express from "express";
const router = express.Router();
import hotelController from "../Controllers/hotel.js";
import { verifyAdmin } from "../utils/Verifytoken.js";
import { Hotel } from "../models/Hotel.js";
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
router.get("/featured", hotelController.getFeaturedHotels);
router.get("/countByCityDetailed", hotelController.countByCityDetailed);
router.get("/countByType", hotelController.CountByType);
router.get("/properties/:type", async (req, res) => {
    const type = req.params.type;
    try {
        const properties = await Hotel.find({ type: new RegExp(type, "i") });
        if (!properties.length) {
            return res.status(404).json({ message: `No properties found for type: ${type}` });
        }
        res.status(200).json(properties);
    } catch (err) {
        console.error("Error fetching properties:", err.message);
        res.status(500).json({ message: "Error fetching properties.", error: err.message });
    }
});
router.get("/test-db", hotelController.testDatabase);
// router.get('/countByType',getHotel);
export default router;

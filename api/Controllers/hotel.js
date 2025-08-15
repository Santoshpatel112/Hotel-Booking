import { Hotel } from "../models/Hotel.js";

const CreateHotel= async (req,res)=>{
    const newHotel=new Hotel(req.body);
    try {
     const saveHotel=await newHotel.save();
     return res.status(201).json({ message: "Hotel created successfully", hotel: saveHotel });
    } catch (error) {
     res.status(500).json({ error: error.message });
    }
}

const UpdateHotel= async (req,res)=>{
    try {
        const hotel=await req.params;
        if(!hotel){
           return res.status(401).json({message :"Hotel does't exit"});
        }
        const updateHotel= await Hotel.findByIdAndUpdate(req.params.id ,{$set:req.body});
        return res.status(200).json({message :"Hotel Updated Sucessfully ",Hotel:updateHotel ,hotel});
     } catch (error) {
        console.log("error" ,error);
        return res.status(500).json({message:"unalbe to update",error});
     }
}

const DeleteHotel= async (req ,res)=>{
    try {
        const deleteHotel=await Hotel.findByIdAndDelete(req.params.id);
        return res.status(200).json({message :"Hotel Deleted Successfully" ,deleteHotel});
     } catch (error) {
        return res.status(500).json({
           message :"Unable to delete it somthing error happpend",
           error
        })
     }
}

const GetHotelByID=async (req ,res)=>{
    try {
        const getHotel=await Hotel.findById(req.params.id);
        return res.status(200).json({hotel :getHotel});
     } catch (error) {
        return res.status(400).json({message :"Unable to find Somthing error "},error)
     }
}

const getallHotel = async (req ,res)=>{
    try {
        const getall=await Hotel.find();
        return res.status(200).json({hotel :getall});
     } catch (err) {
        return res.status(400).json({message :"Unable to find Somthing error "},error)
     }
}

export default{
    CreateHotel,
    DeleteHotel,
    UpdateHotel,
    GetHotelByID,
    getallHotel
};

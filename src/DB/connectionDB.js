import mongoose from "mongoose";
import {DB_URI_ONLINE} from "../../config/config.service.js";

const checkConnectionDB = async () => {
  try {
     await mongoose.connect(DB_URI_ONLINE, { 
      serverSelectionTimeoutMS: 3000 
    });
    
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB connection Failed ............", error);
  }
};

export default checkConnectionDB;
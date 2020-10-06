import dotenv from "dotenv";
dotenv.config();


export default {  
  MONGODB_URL: process.env.MONGO_URI_LOCAL || process.env.MONGO_URI ,
  PORT : process.env.PORT || 5000
};

  
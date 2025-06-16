import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB);
    console.log("Mongodb Connected");
  } catch (error) {
    console.log("error in connection mongoDb");
    process.exit(1);
  }
};

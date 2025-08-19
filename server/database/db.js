import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DATABASE CONNECTED');
    } catch (err) {
        console.log("CONNECTION FAILED: ", err.message);
    }
}

export default dbConnection;
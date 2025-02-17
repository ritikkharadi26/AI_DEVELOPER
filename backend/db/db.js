import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import mongoose from 'mongoose';

// Log to verify environment variables are loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS:45000// Avoid infinite waiting
        });
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Stop the server if DB fails
    }
}

export default connect;

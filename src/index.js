import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/order.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



app.use(cors({
  origin: "*",   // frontend url 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());


app.use("/api", authRoutes);
app.use("/api", menuRoutes);
app.use("/api", orderRoutes);



//error handler middleware
app.use(errorHandler);




// console.log(process.env.MONGODB_URI);

// daatabase connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

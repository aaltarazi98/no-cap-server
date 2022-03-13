import express, { Application } from "express";
import productRoutes from "./api/routes/productRoutes";
import orderRoutes from "./api/routes/orderRoutes";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDb } from "./db";
import userRoutes from "./api/routes/userRoutes";
import { errorHandler } from "./api/middleware/errorHandler";
import cors from "cors";

const options: cors.CorsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  methods: "GET, POST, PUT, DELETE",
  origin: process.env.CLIENT_URL,
};
dotenv.config();

connectDb();

const port: number = Number(process.env.PORT) || 4000;
const app: Application = express();

app.use(cors(options));
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes which should handle requests
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnection from "./database/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import courseProgressRoutes from "./routes/courseProgressRoutes.js";
import path from "path";

// dotenv configuration
dotenv.config({});

//call database connection
dbConnection();

const app = express();

const _dirname = path.resolve();

// middlewares
app.use(express.json());
app.use(cookieParser());
// "http://localhost:5173"
app.use(cors({
    origin: "https://learning-management-system-ufay.onrender.com",
    credentials: true,
}));

const SERVER = process.env.PORT;

// apis
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/purchase", purchaseRoutes);
app.use("/api/v1/progress", courseProgressRoutes);

// for production
// when we want deploy frontend it needs a build se do npm run build and it creates
// dist folder in vite and build in react
app.use(express.static(path.join(_dirname, "/client/dist")));
// serve when got the different routes 
app.get("/*splat", (_, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
})

// error handler middleware 
app.use(errorHandler);

app.listen(SERVER, () => {
    console.log(`SERVING ON LOCALHOST: ${SERVER}`);
});
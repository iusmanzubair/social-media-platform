import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRoutes } from "./src/routes/userRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { verifyToken } from "./src/middleware/authMiddleware.js";
import { initializeDatabase } from "./src/config/configure.js";
import { mediaRoutes } from "./src/routes/mediaRoutes.js";
import { postRoutes } from "./src/routes/postRoutes.js";
import { bookmarkRoutes } from "./src/routes/bookmarkRoutes.js";
import { likeRoutes } from "./src/routes/likeRoutes.js";
import { replyRoutes } from "./src/routes/replyRoutes.js";
import { followRoutes } from "./src/routes/followRoutes.js";
import { messageRoutes } from "./src/routes/messageRoutes.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);
app.use(verifyToken);

app.use("/user", userRoutes);
app.use("/media", mediaRoutes)
app.use("/post", postRoutes)
app.use("/bookmark", bookmarkRoutes)
app.use("/like", likeRoutes)
app.use("/reply", replyRoutes)
app.use("/follow", followRoutes)
app.use("/message", messageRoutes)

app.get('/', (req, res) => {
  res.send("welcome")
})

initializeDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to start server", error);
  });

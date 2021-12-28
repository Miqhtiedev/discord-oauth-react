if (process.env.NODE_ENV !== "production") require("dotenv").config();

import bodyParser from "body-parser";
import express from "express";
import loginWithDiscord from "./routes/loginWithDiscord";
import cors from "cors";
import mongoose from "mongoose";
import authenticateToken from "./util/authenticateAccessToken";
import profile from "./routes/profile";

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to database");
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.post("/login/discord", loginWithDiscord);
app.get("/profile", [authenticateToken, profile]);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
});

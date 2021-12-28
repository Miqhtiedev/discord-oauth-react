import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  id: string;
  discordToken: string;
  refreshToken: string;
  tokenExpires: number;
  tag: string;
  avatar: string;
  createdAt: number;
}

const userSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  discordToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  tokenExpires: { type: Number, required: true },
  tag: { type: String, required: true },
  avatar: { type: String, required: true },
  createdAt: { type: Number, required: true },
});

export default model<IUser>("User", userSchema);

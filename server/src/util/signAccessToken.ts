import { sign } from "jsonwebtoken";

export default function signAccessToken(token: string) {
  return sign({ token: token }, process.env.TOKEN_SECRET, { expiresIn: 604800 });
}

import axios from "axios";
import btoa from "btoa";
import { URLSearchParams } from "url";
import discordError, { IDiscordError } from "./discordError";

interface IDiscordTokens {
  accessToken: string;
  refreshToken: string;
  tokenExpires: number;
}

const auth = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);

export default (code: { code: string; refresh?: boolean }, callback: (error: IDiscordError | null, accessToken: IDiscordTokens | null) => void) => {
  const body = new URLSearchParams();
  body.append("grant_type", !code.refresh ? "authorization_code" : "refresh_token");
  body.append("code", code.code);
  if (!code.refresh) body.append("redirect_uri", "http://localhost:3000/auth");

  axios
    .post("https://discordapp.com/api/oauth2/token", body, { headers: { Authorization: `Basic ${auth}` } })
    .then((res) => {
      callback(null, { accessToken: res.data.access_token, refreshToken: res.data.refresh_token, tokenExpires: Date.now() + res.data.expires_in * 1000 });
    })
    .catch((err) => {
      callback(discordError(err), null);
    });
};

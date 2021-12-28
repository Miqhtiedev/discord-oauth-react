import axios from "axios";
import User, { IUser } from "../schemas/User";
import discordError, { IDiscordError } from "./discordError";
import getAccessToken from "./getAccessToken";

export interface IDiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  flags?: string;
  premium_type?: number;
  public_flags?: number;
}

const getDiscordUser = (auth: string | IUser, callback: (error: IDiscordError | null, user: IDiscordUser | null) => void) => {
  if (typeof auth === "string") {
    axios
      .get("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${auth}` } })
      .then((res) => {
        callback(null, res.data);
      })
      .catch((err) => {
        callback(discordError(err), null);
      });
  } else {
    if (Date.now() > auth.tokenExpires) {
      getAccessToken({ code: auth.refreshToken, refresh: true }, async (err, token) => {
        if (err) {
          callback(err, null);
          return;
        }

        auth.discordToken = token.accessToken;
        auth.refreshToken = token.refreshToken;
        auth.tokenExpires = token.tokenExpires;
        await auth.save();

        getDiscordUser(token.accessToken, callback);
      });
    } else getDiscordUser(auth.discordToken, callback);
  }
};

export default getDiscordUser;

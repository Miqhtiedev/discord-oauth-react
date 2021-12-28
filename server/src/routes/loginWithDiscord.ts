import { Request, Response } from "express";
import User from "../schemas/User";
import getAccessToken from "../util/getAccessToken";
import getDiscordUser from "../util/getDiscordUser";
import signAccessToken from "../util/signAccessToken";

export default (req: Request, res: Response) => {
  if (!req.body.code) {
    res.status(400).json({ error: "Bad Request", message: "No code provided" });
    return;
  }

  const code = req.body.code;

  getAccessToken({ code: code }, (err, token) => {
    if (err) {
      res.status(err.code).json({
        error: err.error,
        message: err.message,
      });
      return;
    }

    getDiscordUser(token.accessToken, async (err, discordUser) => {
      if (err) {
        res.status(err.code).json({
          error: err.error,
          message: err.message,
        });
        return;
      }

      let user = await User.findOne({ id: discordUser.id });

      const ts = Math.round(Date.now() / 1000);

      if (!user) {
        user = new User({
          id: discordUser.id,
          discordToken: token.accessToken,
          tag: discordUser.username + "#" + discordUser.discriminator,
          avatar: discordUser.avatar,
          createdAt: ts,
        });
      } else {
        user.tag = discordUser.username + "#" + discordUser.discriminator;
        user.avatar = discordUser.avatar;
      }

      user.discordToken = token.accessToken;
      user.refreshToken = token.refreshToken;
      user.tokenExpires = token.tokenExpires;

      await user.save();

      res.status(200).json({
        token: signAccessToken(user.id),
        user: {
          id: user.id,
          tag: user.tag,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      });
    });
  });
};

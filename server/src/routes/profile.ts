import { Request, Response } from "express";
import User from "../schemas/User";
import { IAuthenticatedRequest } from "../util/authenticateAccessToken";
import getDiscordUser from "../util/getDiscordUser";

export default async (req: IAuthenticatedRequest, res: Response) => {
  const user = await User.findOne({ id: req.userId });

  if (!user) {
    res.status(500).json({
      error: "Internal server error",
      message: "Error finding user",
    });
    return;
  }

  getDiscordUser(user, async (err, discordUser) => {
    if (err) {
      res.status(err.code).json({
        error: err.error,
        message: err.message,
      });
      return;
    }

    user.tag = discordUser.username + "#" + discordUser.discriminator;
    user.avatar = discordUser.avatar;

    await user.save();

    res.status(200).json({
      user: {
        id: discordUser.id,
        tag: user.tag,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  });
};

import { follow } from "../models/follow.js";
import { user } from "../models/user.js";

export const createFollow = async (req, res) => {
  try {
    const { followingId, type } = req.body;
    const { userId } = req.user

    if (!followingId || (type != "FOLLOW" && type != "UNFOLLOW")) {
      return res.status(400).json({
        success: false,
        message: "Unable to follow",
      });
    }

    const dbUser = await user.findOne({
      where: { userId: followingId }
    })

    if (!dbUser || dbUser.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to follow",
      });
    }

    if (type === "FOLLOW") {
      await follow.create(
        {
          followerId: userId,
          followingId
        },
      );
    } else {
      await follow.destroy(
        {
          where: {
            followerId: userId,
            followingId
          },
        },
      )

    }

    res.status(200).json({
      success: true,
      message: "Followed successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to follow",
    });
  }
}

export const fetchFollowing = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const { userId } = req.user

    const following = await follow.findAll({
      include: [
        {
          association: "following",
          attributes: ["userId", "username", "name", "bio", "profileImageUrl"]
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(page - 1) * parseInt(limit),
      where: { followerId: userId }
    });

    const parsedFollowing = JSON.parse(JSON.stringify(following))
    const users = parsedFollowing.map(following => following.following);
    console.log(users)

    res.status(200).json({
      success: true,
      nextPage: parseInt(page) + 1,
      hasMore: (following.length > 0),
      users
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch following"
    })

  }
}

export const fetchFollowers = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const { userId } = req.user

    const following = await follow.findAll({
      include: [
        {
          association: "followers",
          attributes: ["userId", "username", "name", "bio", "profileImageUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(page - 1) * parseInt(limit),
      where: { followingId: userId }
    });

    const parsedFollowers = JSON.parse(JSON.stringify(following))

    console.log(parsedFollowers)
    const users = parsedFollowers.map(following => following.followers);
    console.log(users)

    res.status(200).json({
      success: true,
      nextPage: parseInt(page) + 1,
      hasMore: (following.length > 0),
      users
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch followers"
    })

  }
}


export const fetchFollowingIdOnly = async (req, res) => {
  try {
    const { userId } = req.user;

    const _following = await follow.findAll({
      where: {
        followerId: userId
      },
      attributes: ["followingId"]
    })

    const following = _following.map(follow => follow.followingId)

    res.status(200).json({
      success: true,
      following
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch following",
    });
  }
}

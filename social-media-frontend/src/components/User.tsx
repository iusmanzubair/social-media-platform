import defaultProfilePic from "../assets/default-profile-pic.webp"
import { Logout } from "./auth/Logout";
import { UserType } from "../types/types";
import { Follow } from "./Follow";
import { Link } from "react-router";

interface UserProps {
  user: Pick<UserType, "userId" | "name" | "username" | "profileImageUrl">,
  following: string[],
  sessionUserId: string
}

export const User = ({ user, following, sessionUserId }: UserProps) => {
  if (!user)
    return null;

  return <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <Link to={`/profile/${user.username}`}><img src={user.profileImageUrl ?? defaultProfilePic} className="w-9 h-9 rounded-full" /></Link>
      <div>
        <Link to={`/profile/${user.username}`} className="hover:underline"><p className="text-base font-medium">{user.name}</p></Link>
        <Link to={`/profile/${user.username}`}><p className="text-gray-500">@{user.username}</p></Link>
      </div>
    </div>
    {sessionUserId === user.userId ? <Logout /> : <Follow initialFollowType={following.includes(user.userId) ? "FOLLOW" : "UNFOLLOW"} userId={user.userId} />}
  </div>
};

import { useQuery } from "@tanstack/react-query";
import { findAllUsers } from "../lib/findUser";
import { User } from "./User"
import { SearchBar } from "./SearchBar";
import { axiosInstance } from "../hooks/axiosInstance";
import { getSession } from "../hooks/getSession";

export const RightBar = () => {
  const { data: users } = useQuery({
    queryKey: ["findAllUsers"],
    queryFn: () => findAllUsers(3),
  });

  const { data: following } = useQuery({
    queryKey: ["fetchFollowingIdOnly"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/follow/fetch-following-id");
      return data.following
    },
  });

  const { data: session } = useQuery({
    queryKey: ["getSession"],
    queryFn: getSession,
  });

  if (!users || !following || !session)
    return null;

  return <div className="pl-0 lg:pl-10 space-y-4 border-l border-l-gray-300 mr-2">
    <SearchBar />
    <div className="hidden lg:block border border-gray-300 rounded-2xl p-4 space-y-6">
      <h2 className="text-xl font-bold">Who to follow</h2>
      <div className="space-y-5">
        {users && users.map((user) => (
          <User key={user.userId} sessionUserId={session.user.userId} user={user} following={following} />
        ))}
      </div>
    </div>
  </div>
}

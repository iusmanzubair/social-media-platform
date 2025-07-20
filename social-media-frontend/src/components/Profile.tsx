import { ArrowLeft, CalendarDays, Mail } from "lucide-react"
import defaultCoverImage from "../assets/default-cover-image.avif"
import defaultProfileImage from "../assets/default-profile-pic.webp"
import { Button } from "./ui/Button"
import { Feed } from "./Feed"
import { Link, useNavigate, useParams } from "react-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../hooks/axiosInstance"
import { format } from "date-fns"
import { getSession } from "../hooks/getSession"
import { toast } from "sonner"

export const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["getSession"],
    queryFn: getSession,
  });

  const { data: user } = useQuery({
    queryKey: ["findUserByUsername", username],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/get-user-by-username?username=${username}`);
      return data.user
    }
  })

  const { mutate: handleMessage } = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post("/message/create-conversation", { user2Id: user.details.userId })
      return data;
    },
    onSuccess: (data) => {
      console.log(data)
      navigate(`/messages/${data.conversationId}`)
    },
    onError: () => {
      toast.error("Something went wrong")
    }
  })

  if (!user || !session)
    return null;

  return <div className="mt-2 overflow-y-scroll scrollbar-hide">
    <div className="flex items-center gap-6 px-4 pb-2 border-b border-b-gray-300">
      <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => navigate(-1)} />
      <div>
        <h2 className="text-xl font-bold">{user.details.name}</h2>
        <p className="text-gray-500 text-xs">{user.postCount} posts</p>
      </div>
    </div>
    <div className="border-b border-b-gray-300">
      <img src={user.details.coverImageUrl ?? defaultCoverImage} className="w-full h-48" />
      <div className="flex items-center justify-between px-4 py-3 relative">
        <img src={user.details.profileImageUrl ?? defaultProfileImage} className="w-32 h-32 rounded-full absolute left-4 -top-16" />
        <div className="w-32" />
        {session.user.userId === user.details.userId ? <Button onClick={() => navigate('/settings')} className="w-24 bg-transparent text-black border border-gray-400">Edit Profile</Button> : <div className="flex items-center gap-3"><Mail strokeWidth={1.5} className="w-8 h-8 border border-gray-500 rounded-full p-1.5 mb-1 cursor-pointer" onClick={() => handleMessage()} /><Button className="w-24">Follow</Button></div>}
      </div>
      <div className="space-y-2.5 px-4 py-2">
        <div>
          <h2 className="font-bold text-xl">{user.details.name}</h2>
          <span className="text-gray-500">{"@"}{user.details.username}</span>
        </div>
        <p>{user.details.bio}</p>
        <span className="flex items-center gap-1 text-gray-500"><CalendarDays className="w-4 h-4" />Joined {format(user.details.createdAt.split('T')[0], "MMMM yyyy")}</span>
        <div className="space-x-2">
          <Link to={`${window.location.pathname}/following`} className="hover:underline"><span className="font-bold">{user.followingCount}</span> Following</Link>
          <Link to={`${window.location.pathname}/followers`} className="hover:underline"><span className="font-bold">{user.followerCount}</span> Followers</Link>
        </div>
      </div>
    </div>
    {user.postCount === 0 ? <div className="flex items-center justify-center mt-10 mb-6"><p>User does not have any post</p></div> : <Feed query="/post/fetch-posts" userId={user.details.userId} likeQuery="/like/fetch-likes" bookmarkQuery="/bookmark/fetch-bookmarks-id" primaryKey="postId" />}
  </div>
}

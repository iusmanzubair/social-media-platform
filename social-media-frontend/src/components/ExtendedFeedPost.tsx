import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { FeedPost } from "./FeedPost";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../hooks/axiosInstance";
import { Post } from "./Post";
import { Feed } from "./Feed";
import { getSession } from "../hooks/getSession";

export const ExtendedFeedPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const { data: post } = useQuery({
    queryKey: ["fetchPostById", postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/post/fetch-post?postId=${postId}`);
      return data.post
    }
  })

  const { data: likedPosts } = useQuery({
    queryKey: ["fetchLikedPosts"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/like/fetch-likes");
      return data.likedPosts;
    }
  })

  const { data: bookmarkedPosts } = useQuery({
    queryKey: ["fetchBookmarkedPosts"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/bookmark/fetch-bookmarks-id");
      return data.bookmarkedPosts;
    }
  })

  const { data: session } = useQuery({
    queryKey: ["getSession"],
    queryFn: getSession,
  });

  if (!post || !likedPosts || !bookmarkedPosts || !session)
    return null

  return <div className="mt-2 overflow-y-scroll scrollbar-hide">
    <div className="px-4 flex items-center gap-4 pb-6 border-b border-b-gray-300">
      <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => navigate(-1)} />
      <h2 className="text-xl font-bold">Post</h2>
    </div>
    <FeedPost sessionId={session.user.userId} post={post} likedPosts={likedPosts} bookmarkedPosts={bookmarkedPosts} primaryKey="postId" />
    <Post initialRowCount={1} buttonText="Reply" placeholder="Post your reply" query="/reply/create-reply" postId={postId} />
    <Feed query="/reply/fetch-replies" postId={postId} likeQuery="/like/fetch-reply-likes" bookmarkQuery="/bookmark/fetch-reply-bookmarks-id" primaryKey="replyId" />
  </div>
}

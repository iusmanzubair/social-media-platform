import { Post } from "../types/types"
import defaultProfilePic from "../assets/default-profile-pic.webp"
import { Kanban, MessageCircle } from "lucide-react"
import { cn } from "../lib/utils"
import { PostLikes } from "./PostLikes"
import { PostBookmarks } from "./PostBookmarks"
import { Link } from "react-router"
import { Delete } from "./Delete"

interface FeedPostProps {
  post: Post,
  likedPosts: string[],
  bookmarkedPosts: string[],
  primaryKey: "replyId" | "postId",
  sessionId: string
}

export const FeedPost = ({ post, likedPosts, bookmarkedPosts, primaryKey, sessionId }: FeedPostProps) => {
  if (!likedPosts || !bookmarkedPosts || !post)
    return null;

  console.log(post)

  return (
    <div className="p-3 border-b border-b-gray-300 relative">
      <Link to={`/${primaryKey.split("Id")[0]}/${post[primaryKey]}`} className="w-full inset-0 absolute z-10" />
      <div className="flex gap-2">
        <div className="flex-shrink-0 z-20 flex flex-col">
          <Link to={`/profile/${post.user.username}`} className="z-20 block"><img src={post.user.profileImageUrl ?? defaultProfilePic} className="z-0 w-9 h-9 rounded-full" /></Link>
          <div className="h-full">
            <Link to={`/${primaryKey.split("Id")[0]}/${post.postId}`} className="h-full w-full block" />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${post.user.username}`} className="hover:underline z-20"><h3 className="font-bold">{post.user.name}</h3></Link>
              <Link to={`/profile/${post.user.username}`} className="z-20"><p className="text-gray-500">{"@"}{post.user.username}</p></Link>
            </div>
            {sessionId === post.user.userId && <Delete query={`/${primaryKey.split("Id")[0]}/delete-${primaryKey.split("Id")[0]}?objectId=${post[primaryKey]}`} />}
          </div>
          <p>{post.content}</p>
          <div className={cn("mt-1 grid grid-cols-1", { "grid-cols-2": post.media.length >= 2 })}>
            {
              post.media.map((file, index) => (
                <img loading="lazy" key={index} src={file.url} className={cn("border border-gray-300", { "rounded-r-2xl": post.media.length >= 2 && (index + 1) % 2 === 0, "rounded-l-2xl": post.media.length >= 2 && (index + 1) % 2 !== 0, "rounded-2xl": post.media.length === 1 })} />
              ))
            }
          </div>
          <div className="flex justify-between items-center mt-3 px-2">
            <PostLikes initialLikeType={likedPosts.includes(post[primaryKey] as string) ? "LIKE" : "NOLIKE"} initialLikes={post.likeCount} objectId={post[primaryKey] as string} primaryKey={primaryKey} />
            <Link to={`/${primaryKey.split("Id")[0]}/${post[primaryKey]}`} className="z-20"><button className="flex items-center gap-2 text-gray-500 hover:text-primary"><MessageCircle strokeWidth={2.7} className="w-4 h-4" /><p>{post.replyCount}</p></button></Link>
            <button className="z-20 flex items-center gap-2 text-gray-500 hover:text-green-600"><Kanban strokeWidth={2.7} className="w-4 h-4" /><p>{post.viewCount}</p></button>
            <PostBookmarks initialBookmarkType={bookmarkedPosts.includes(post[primaryKey] as string) ? "ADD" : "REMOVE"} objectId={post[primaryKey] as string} primaryKey={primaryKey} />
          </div>
        </div>
      </div>
    </div>
  )
}

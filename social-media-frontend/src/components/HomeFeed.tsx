import { Feed } from "./Feed"
import { Post } from "./Post"

export const HomeFeed = () => {
  return <div className="overflow-y-scroll scrollbar-hide">
    <Post initialRowCount={2} buttonText="Post" placeholder="Share your thoughts..." query="/post/create-post" />
    <Feed query="/post/fetch-posts" likeQuery="/like/fetch-likes" bookmarkQuery="/bookmark/fetch-bookmarks-id" primaryKey="postId"/>
  </div>
}

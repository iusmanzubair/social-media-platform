import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router";
import { Feed } from "./Feed";

export const Bookmarks = () => {
  const navigate = useNavigate();

  return <div className="mt-2 overflow-y-scroll scrollbar-hide">
    <div className="px-4 flex items-center gap-4 pb-6 border-b border-b-gray-300">
      <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => navigate(-1)} />
      <h2 className="text-xl font-bold">Bookmarks</h2>
    </div>
    <Feed query="/bookmark/fetch-bookmarks" likeQuery="/like/fetch-likes" bookmarkQuery="/bookmark/fetch-bookmarks-id" primaryKey="postId"/>
  </div>
}

import { Bookmark } from "lucide-react"
import { useState } from "react"
import { cn } from "../lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../hooks/axiosInstance"
import { toast } from "sonner"
import { usePrevious } from "@mantine/hooks"

const Queries = {
  "replyId": "/bookmark/create-reply-bookmark",
  "postId": "/bookmark/create-bookmark"
}

interface PostBookmarkProps {
  initialBookmarkType: "ADD" | "REMOVE",
  objectId: string,
  primaryKey: "postId" | "replyId"
}

export const PostBookmarks = ({ initialBookmarkType, objectId, primaryKey }: PostBookmarkProps) => {
  const [currentBookmarkType, setCurrentBookmarkType] = useState(initialBookmarkType);
  const prevBookmarkType = usePrevious(currentBookmarkType);
  const queryClient = useQueryClient();

  const { mutate: handleBookmark } = useMutation({
    mutationFn: async (type) => {
      await axiosInstance.post(Queries[primaryKey], { objectId, type })
    },
    onMutate: (type: "ADD" | "REMOVE") => {
      setCurrentBookmarkType(type)
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["fetchBookmarkedPosts"] })
    },
    onError: () => {
      setCurrentBookmarkType(prevBookmarkType ?? initialBookmarkType);
      toast.error("Unable to bookmark a post")
    }
  })

  return (
    <button className={cn("z-20 flex items-center gap-2 text-gray-500 hover:text-primary", { "text-primary": currentBookmarkType === "ADD" })} onClick={() => handleBookmark(currentBookmarkType === "ADD" ? "REMOVE" : "ADD")}><Bookmark strokeWidth={2.7} className={cn("w-4 h-4", { "fill-primary": currentBookmarkType === "ADD" })} /></button>
  )
}

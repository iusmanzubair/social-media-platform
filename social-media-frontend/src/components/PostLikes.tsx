import { Heart } from "lucide-react"
import { useState } from "react"
import { cn } from "../lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../hooks/axiosInstance"
import { toast } from "sonner"
import { usePrevious } from "@mantine/hooks"

const Queries = {
  "replyId": "/like/create-reply-like",
  "postId": "/like/create-like"
}

interface PostLikesProps {
  initialLikes: number,
  initialLikeType: "LIKE" | "NOLIKE"
  objectId: string,
  primaryKey: "replyId" | "postId"
}

export const PostLikes = ({ initialLikes, initialLikeType, objectId, primaryKey }: PostLikesProps) => {
  const [likeUpdates, setLikeUpdates] = useState(initialLikes);
  const [currentLikeType, setCurrentLikeType] = useState(initialLikeType);
  const prevLikeType = usePrevious(currentLikeType);
  const queryClient = useQueryClient();

  const { mutate: handleLike } = useMutation({
    mutationFn: async (type) => {
      await axiosInstance.post(Queries[primaryKey], { objectId, type })
    },
    onMutate: (type: "LIKE" | "NOLIKE") => {
      if (type === "LIKE")
        setLikeUpdates(prev => prev + 1);
      else
        setLikeUpdates(prev => prev - 1);

      setCurrentLikeType(type)
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["fetchLikedPosts"] })
    },
    onError: (_, type) => {
      if (type === "LIKE")
        setLikeUpdates(prev => prev - 1)
      else
        setLikeUpdates(prev => prev + 1)

      setCurrentLikeType(prevLikeType ?? initialLikeType);
      toast.error("Unable to like a post")
    }
  })

  return (
    <button className={cn("z-20 flex items-center gap-2 text-gray-500 hover:text-red-600", { "text-red-600": currentLikeType === "LIKE" })} onClick={() => handleLike(currentLikeType === "LIKE" ? "NOLIKE" : "LIKE")}><Heart strokeWidth={2.7} className={cn("w-4 h-4", { "fill-red-500": currentLikeType === "LIKE" })} /><p>{likeUpdates}</p></button>
  )
}

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../hooks/axiosInstance"
import { toast } from "sonner"
import { usePrevious } from "@mantine/hooks"
import { Button } from "./ui/Button"

interface FollowProps {
  initialFollowType: "FOLLOW" | "UNFOLLOW",
  userId: string,
}

export const Follow = ({ initialFollowType, userId }: FollowProps) => {
  const [currentFollowType, setCurrentFollowType] = useState(initialFollowType);
  const prevFollowType = usePrevious(currentFollowType);

  const { mutate: handleFollow } = useMutation({
    mutationFn: async (type) => {
      await axiosInstance.post("/follow/create-follow", { followingId: userId, type })
    },
    onMutate: (type: "FOLLOW" | "UNFOLLOW") => {
      setCurrentFollowType(type)
    },
    onError: () => {
      setCurrentFollowType(prevFollowType ?? initialFollowType);
      toast.error("Unable to follow")
    }
  })

  return (
    <>
      {currentFollowType === "UNFOLLOW" ? <Button className="w-24" onClick={() => handleFollow("FOLLOW")}>Follow</Button> : <Button className="w-24 bg-transparent border border-red-600 text-red-600" onClick={() => handleFollow("UNFOLLOW")}>Unfollow</Button>}
    </>
  )
}

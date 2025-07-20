import { format } from "date-fns"
import defaultProfilePic from "../assets/default-profile-pic.webp"
import { Link, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../hooks/axiosInstance"
import { Post } from "./Post"
import { cn } from "../lib/utils"
import { getSession } from "../hooks/getSession"
import { useEffect, useRef } from "react"
import { MessageType } from "../types/types"

export const Messages = () => {

  const { conversationId } = useParams();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useQuery({
    queryKey: ["fetchMessages", conversationId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/message/fetch-messages?conversationId=${conversationId}`)
      return data.messages as MessageType;
    }
  })

  useEffect(() => {
    messageEndRef.current?.scrollIntoView()
  }, [messages?.data])

  const { data: session } = useQuery({
    queryKey: ["getSession"],
    queryFn: getSession,
  });

  if (!messages || !session)
    return null;

  console.log(messages)

  return <div className="flex flex-col justify-between mb-2 border-x border-x-gray-300 overflow-y-hidden">
    <div className="flex flex-col items-center justify-center gap-3 border-b border-b-gray-300 h-[30%]">
      <div className="flex flex-col items-center gap-0.5">
        <Link to={`/profile/username`}><img src={messages.user.profileImageUrl ?? defaultProfilePic} className="w-14 h-14 rounded-full" /></Link>
        <Link to={`/profile/username`} className="hover:underline"><p className="text-base font-medium">{messages.user.name}</p></Link>
        <Link to={`/profile/username`}><p className="text-gray-500">@{messages.user.username}</p></Link>
      </div>
      <p>{messages.user.bio}</p>
      <span className="flex items-center gap-1 text-gray-500">Joined {format(messages.user.createdAt.split('T')[0], "MMMM yyyy")}</span>
    </div>
    <div className="border-b border-b-gray-300 h-full py-2 overflow-y-scroll scrollbar-hide">
      {messages.data.map((message) => (
        <div className={cn("w-full px-4 my-0.5 flex flex-col items-start", { "items-end": message.senderId === session.user.userId })}>
          <p className={cn("bg-gray-200 w-fit max-w-[50%] py-4 px-5 rounded-3xl ", { "bg-primary text-white": message.senderId === session.user.userId })}>{message.content}</p>
          <div className={cn("mt-0.5 max-w-[50%] grid grid-cols-1", { "grid-cols-2": message.media.length >= 2 })}>
            {
              message.media.map((file, index) => (
                <img key={index} src={file.url} className={cn("border border-gray-300", { "rounded-r-2xl": message.media.length >= 2 && (index + 1) % 2 === 0, "rounded-l-2xl": message.media.length >= 2 && (index + 1) % 2 !== 0, "rounded-2xl": message.media.length === 1 })} />
              ))
            }
          </div>
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
    <Post initialRowCount={1} buttonText="Send" placeholder="Start a new message" query="/message/create-message" conversationId={conversationId} />
  </div>
}

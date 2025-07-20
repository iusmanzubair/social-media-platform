import { ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router"
import defaultProfilePic from "../assets/default-profile-pic.webp"
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../hooks/axiosInstance";
import { ConversationType } from "../types/types";

export const Conversation = () => {
  const navigate = useNavigate();

  const { data: conversations } = useQuery({
    queryKey: ["getConversations"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/message/fetch-conversations");
      return data.conversations as ConversationType[]
    }
  })

  if (!conversations)
    return null;

  console.log(conversations)

  return <div className="mt-2 overflow-y-scroll scrollbar-hide">
    <div className="px-4 flex items-center gap-4 pb-6 border-b border-b-gray-300">
      <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => navigate(-1)} />
      <h2 className="text-xl font-bold">Messages</h2>
    </div>
    {conversations.map((conversation) => (
      <div key={conversation.conversationId} className="flex items-center gap-3 p-4 relative">
        <Link className="absolute inset-0" to={`/messages/${conversation.conversationId}`} />
        <img src={conversation.user.profileImageUrl ?? defaultProfilePic} className="w-9 h-9 rounded-full" />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-base font-medium">{conversation.user.name}</p>
            <p className="text-gray-500">@{conversation.user.username}</p>
          </div>
          <p></p>
        </div>
      </div>
    ))}

  </div>
}

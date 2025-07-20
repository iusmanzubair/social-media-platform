import { Outlet } from "react-router"
import { MaxWidthWrapper } from "./MaxWidthWrapper"
import { Sidebar } from "./Sidebar"
import { Conversation } from "./Conversation"

export const ConversationHome = () => {

  return <MaxWidthWrapper className="grid grid-cols-[270px_450px_1fr]">
    <Sidebar />
    <Conversation />
    <Outlet />
  </MaxWidthWrapper>
}

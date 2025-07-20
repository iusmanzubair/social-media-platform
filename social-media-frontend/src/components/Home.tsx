import { Outlet } from "react-router"
import { MaxWidthWrapper } from "./MaxWidthWrapper"
import { RightBar } from "./RightBar"
import { Sidebar } from "./Sidebar"

export const Home = () => {
  return <MaxWidthWrapper className="grid grid-cols-[50px_1fr_10px] md:grid-cols-[270px_1fr_10px] lg:grid-cols-[270px_1fr_400px]">
    <Sidebar />
    <Outlet />
    <RightBar />
  </MaxWidthWrapper>
}

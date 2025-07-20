import { sidebarItems } from "../static/sidebar"
import { CreatePost } from "./CreatePost"
import { User } from "./User"
import { findUserById } from "../lib/findUser"
import { useQuery } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { Link } from "react-router"

export const Sidebar = () => {
  const { data: user, isPending, isError, error } = useQuery({
    queryKey: ["findUserById"],
    queryFn: findUserById,
  });

  if (!user)
    return null;

  return (
    <div className="flex flex-col justify-between items-start md:items-end pr-0 pl-4 md:pl-0 md:pr-10 my-4 border-r border-r-gray-300">
      <div>
        <ul className="space-y-6">
          {sidebarItems.map((item) => {
            const { title, icon: Icon, href } = item
            return <li key={href}>
              {title === "Profile" ? <Link className="text-lg flex items-center gap-4" to={`${href}/${user.username}`}><Icon strokeWidth={1.5} className="w-6 h-6 text-primary" />
                <span className="hidden md:block">{title}</span></Link> : <Link className="text-lg flex items-center gap-4" to={href}><Icon strokeWidth={1.5} className="w-6 h-6 text-primary" />
                <span className="hidden md:block">{title}</span></Link>}
            </li>
          })}
        </ul>
      </div>
      <div className="space-y-4 mb-2 hidden md:block min-w-[170px]">
        <CreatePost />
        {isPending ? <LoaderCircle className="animate-spin" /> : isError ? <span>{error.message}</span> : <User sessionUserId={user.userId} following={[]} user={user} />}
      </div>
    </div>
  )
}

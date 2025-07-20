import { Search } from "lucide-react"

export const SearchBar = () => {
  return <div className="hidden lg:flex items-center gap-1 mt-2  px-3 w-full border border-gray-300 rounded-full focus-within:border-primary">
    <Search className="w-4 h-4 text-gray-500" />
    <input type="text" placeholder="Search" className="bg-transparent placeholder:text-gray-700 border-none outline-none w-full py-2" />
  </div>
}

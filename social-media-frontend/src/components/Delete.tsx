import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ellipsis, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { axiosInstance } from "../hooks/axiosInstance";
import { toast } from "sonner";

export const Delete = ({ query }: { query: string }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  console.log(query)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsVisible(false);
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [])

  const { mutate: handleDelete } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(query);
    },
    onSuccess: () => {
      setIsVisible(false);
      queryClient.refetchQueries({ queryKey: ["feed"] })
    },
    onError: () => {
      setIsVisible(false);
      toast.error("Unable to delete")
    }
  })

  return (
    <div className="z-20" ref={dropdownRef}>
      <button onClick={() => setIsVisible(prev => !prev)}><Ellipsis className="w-5 h-5" /></button>

      {isVisible && <button onClick={() => handleDelete()} className="text-red-600 absolute right-3 top-4 bg-grey shadow-md px-5 py-2.5 rounded-xl flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete</button>}
    </div>
  )
}

import { LogOut } from "lucide-react";
import { axiosInstance } from "../../hooks/axiosInstance";
import { toast } from "sonner";

export const Logout = () => {

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/user/logout');

      window.location.href = '/'
    } catch {
      toast.error("Something went wrong")
    }
  }

  return <button onClick={handleLogout}><LogOut className="w-5 h-5" strokeWidth={1.5} /></button>
}

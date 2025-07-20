import { LoaderCircle } from "lucide-react"
import { cn } from "../../lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode,
    isLoading?: boolean
}

export const Button = ({children, isLoading, className, ...props}: ButtonProps)=> {
    return <button className={cn("inline-flex items-center justify-center w-full bg-primary text-white py-2 rounded-lg mb-2 disabled:opacity-50", className)} disabled={isLoading} {...props}>
        {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : children}
    </button>
}
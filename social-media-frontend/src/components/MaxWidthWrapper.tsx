import { cn } from "../lib/utils"

interface MaxWidthWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export const MaxWidthWrapper = ({children, className, ...props}: MaxWidthWrapperProps)=> {
    return <main className={cn("max-w-screen-xl mx-auto h-screen", className)} {...props}>
        {children}
    </main>
}
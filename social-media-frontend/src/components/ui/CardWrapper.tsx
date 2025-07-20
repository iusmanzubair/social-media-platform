import { cn } from "../../lib/utils";
import { MaxWidthWrapper } from "../MaxWidthWrapper";

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
  children: React.ReactNode;
}

export const CardWrapper = ({ children, text, heading, className }: CardWrapperProps) => {
  return (
    <MaxWidthWrapper className="flex items-center justify-center">
      <div className={cn("w-[400px] bg-white rounded-xl p-10 text-center relative", className)}>
        <h1 className="text-xl font-semibold">{heading}</h1>
        <p className="my-2 text-gray-500 leading-[1.4rem]">{text}</p>
        {children}
      </div>
    </MaxWidthWrapper>
  );
};

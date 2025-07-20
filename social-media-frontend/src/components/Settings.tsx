import { cn } from "../lib/utils"
import { UserDetailsSchema, UserDetailsType } from "../schema/signup-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/Button";
import { ArrowLeft, ImagePlus } from "lucide-react";
import defaultProfileImage from "../assets/default-profile-pic.webp"
import defaultCoverImage from "../assets/default-cover-image.jpg"
import { useNavigate } from "react-router";

export const Settings = () => {

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { isValid, errors } } = useForm<UserDetailsType>({
    resolver: zodResolver(UserDetailsSchema),
    defaultValues: {
      name: "",
      bio: "",
      username: "",
    },
    mode: "onChange"
  })

  const onSubmit = (data: UserDetailsType) => {
    console.log(data)
  }
  return <div className="mt-2">
    <div className="px-4 flex items-center gap-4 pb-6 border-b border-b-gray-300">
      <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => navigate(-1)} />
      <h2 className="text-xl font-bold">Settings</h2>
    </div>
    <form className="flex flex-col mt-3 max-w-[500px] mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 relative">
        <img src={defaultCoverImage} className="h-48 w-full" />
        <label htmlFor="coverImage" className="z-20 absolute left-56 top-20 cursor-pointer bg-black bg-opacity-20 hover:bg-opacity-25 text-white p-2 rounded-full"><ImagePlus className="w-5 h-5" /></label>
        <input id="coverImage" type="file" accept="image/*" className="hidden" />
        <div className="flex items-center justify-between px-4 py-3 relative">
          <img src={defaultProfileImage} className="w-20 h-20 rounded-full absolute left-4 -top-12 z-0" />
          <label htmlFor="profileImage" className="z-20 absolute left-10 bg-black bg-opacity-15 hover:bg-opacity-25 text-white p-2 rounded-full -top-4 cursor-pointer"><ImagePlus className="w-4 h-4" /></label>
          <input id="profileImage" type="file" accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="space-y-1 relative">
        <input type="text" placeholder="Full name" className={cn("w-full border border-gray-300 focus:border-primary outline-0 px-4 py-2 mt-2 mb-2 bg-grey rounded-lg placeholder:text-gray-500 outline-primary", { "mb-1 focus:border-red-500": errors.name })} {...register('name')} />
        {errors.name && <p className="text-red-500 text-start text-xs block pb-1.5 px-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-1 relative">
        <input type="text" placeholder="Username" className={cn("w-full border border-gray-300 focus:border-primary outline-0 px-4 py-2 mt-2 mb-2 bg-grey rounded-lg placeholder:text-gray-500 outline-primary", { "mb-1 focus:border-red-500": errors.username })} {...register('username')} />
        {errors.username && <p className="text-red-500 text-start text-xs block pb-1.5 px-1">{errors.username.message}</p>}
      </div>

      <div className="mb-7 space-y-1 relative">
        <input type="text" placeholder="Bio" className={cn("w-full border border-gray-300 focus:border-primary outline-0 px-4 py-2 mt-2 mb-2 bg-grey rounded-lg placeholder:text-gray-500 outline-primary", { "mb-1 focus:border-red-500": errors.bio })} {...register('bio')} />
        {errors.bio && <p className="text-red-500 text-start text-xs block pb-1.5 px-1">{errors.bio.message}</p>}
      </div>


      <Button type="submit" disabled={!isValid}>Continue</Button>
    </form>
  </div>
}

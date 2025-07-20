import { useNavigate } from "react-router";
import { CardWrapper } from "../ui/CardWrapper"
import { useAppSelector } from "../../redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserDetailsSchema, UserDetailsType } from "../../schema/signup-schema";
import { cn } from "../../lib/utils";
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../hooks/axiosInstance";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

export const CreateUser = () => {
  const navigate = useNavigate();

  const email = useAppSelector(state => state.signupForm.email)
  const isEmailConfimed = useAppSelector(state => state.signupForm.isEmailConfirmed)
  const password = useAppSelector(state => state.signupForm.password)

  useEffect(() => {
    if (!email || !isEmailConfimed || !password) {
      navigate('/sign-up')
    }
  }, [navigate, email, isEmailConfimed, password])

  const { register, handleSubmit, setError, formState: { isValid, errors } } = useForm<UserDetailsType>({
    resolver: zodResolver(UserDetailsSchema),
    defaultValues: {
      name: "",
      bio: "",
      username: "",
    },
    mode: "onChange"
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UserDetailsType) => {
      const payload = {
        email,
        password,
        username: data.username,
        name: data.name,
        bio: data.bio,
      }

      await axiosInstance.post("/user/create", payload)
    },
    onSuccess: () => {
      window.location.href = "/home"
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return setError('username', {
          type: "validate",
          message: error.response?.data.message || "Something went wrong"
        })
      }

      toast.error("Something went wrong")
    }
  })

  const onSubmit = async (data: UserDetailsType) => {
    mutate(data);
  }

  return (
    <CardWrapper heading="Personal Information" text="Fill the details below to complete your account creation">
      <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>


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


        <Button type="submit" isLoading={isPending} disabled={!isValid}>Continue</Button>
      </form>

    </CardWrapper>
  )
}

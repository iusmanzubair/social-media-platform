import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAppSelector } from "../../redux/hooks";
import { PasswordSchema, PasswordType } from "../../schema/login-schema";
import { axiosInstance } from "../../hooks/axiosInstance";
import { CardWrapper } from "../ui/CardWrapper";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { QrCode } from "../QrCode";
import { toast } from "sonner";

export const PasswordLogin = () => {
  const navigate = useNavigate();

  const email = useAppSelector((state) => state.loginForm.email);
  // const saveUser = useAppSelector((state) => state.loginForm.saveUser);

  useEffect(() => {
    if (!email)
      navigate('/')
  }, [navigate, email])

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { register, handleSubmit, setError, formState: { isValid, errors } } = useForm<PasswordType>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: ""
    },
    mode: "onChange"
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PasswordType) => {
      return axiosInstance.post("/user/login", { email, password: data.password })
    },
    onSuccess: () => {
      window.location.href = "/home"
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return setError('password', {
          type: "validate",
          message: error.response?.data.message || "Something went wrong"
        })
      }

      toast.error("Something went wrong")
    }
  })

  const onSubmit = async (data: PasswordType) => {
    mutate(data);
  }

  return <CardWrapper heading="Enter your password" text={`Enter the current password linked to ${email}`}>
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-7 space-y-1 relative">
        <input type={showPassword ? "text" : "password"} placeholder="Enter password" className={cn("w-full border border-gray-300 focus:border-primary outline-0 px-4 py-2 mt-2 mb-2 bg-grey rounded-lg placeholder:text-gray-500 outline-primary", { "mb-1 focus:border-red-500": errors.password })} {...register('password')} />
        <button type="button" className="absolute top-3 right-2" onClick={() => setShowPassword(prev => !prev)}>{showPassword ? <EyeOff className=" w-5 h-5 text-gray-500" /> : <Eye className=" w-5 h-5 text-gray-500" />}</button>
        {errors.password && <p className="text-red-500 text-start text-xs block pb-1.5 px-1">{errors.password?.message}</p>}
        <p className="px-1 text-start text-primary hover:underline">Forgot password?</p>
      </div>
      <Button type="submit" isLoading={isPending} disabled={!isValid}>Continue</Button>
    </form>
    <span className="absolute left-10 border-b border-gray-300 border-solid min-w-[80%] h-4" />
    <QrCode />
  </CardWrapper>
}

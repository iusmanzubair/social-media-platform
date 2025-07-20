import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ConfirmPasswordSchema, ConfirmPasswordType } from "../../schema/signup-schema";
import { updatePassword } from "../../redux/SignupForm";
import { CardWrapper } from "../ui/CardWrapper";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { QrCode } from "../QrCode";

export const CreatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const email = useAppSelector(state => state.signupForm.email)
  const isEmailConfimed = useAppSelector(state => state.signupForm.isEmailConfirmed)

  useEffect(() => {
    if (!email || !isEmailConfimed) {
      navigate('/sign-up')
    }
  }, [navigate, email, isEmailConfimed])

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const { register, handleSubmit, formState: { isValid, errors } } = useForm<ConfirmPasswordType>({
    resolver: zodResolver(ConfirmPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
    mode: "onChange"
  })

  const onSubmit = async (data: ConfirmPasswordType) => {
    dispatch(updatePassword(data.password))
    navigate('/create-user')
  }
  return (
    <CardWrapper heading="Create a password" text="To protect your account, create a strong password">
      <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1 relative">
          <input type={showPassword ? "text" : "password"} placeholder="Enter password" className={cn("w-full border border-gray-300 focus:border-primary outline-0 px-4 py-2 mt-2 mb-2 bg-grey rounded-lg placeholder:text-gray-500 outline-primary", { "mb-1 focus:border-red-500": errors.password })} {...register('password')} />
          <button type="button" className="absolute top-3 right-2" onClick={() => setShowPassword(prev => !prev)}>{showPassword ? <EyeOff className=" w-5 h-5 text-gray-500" /> : <Eye className=" w-5 h-5 text-gray-500" />}</button>
          {errors.password && <p className="text-red-500 text-start text-xs block pb-1.5 px-1">{errors.password.message}</p>}
        </div>

        <div className="mb-7 space-y-1 relative">
          <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" className={cn("w-full border border-gray-300 focus:border-primary outline-0 px-4 py-2 mt-2 mb-2 bg-grey rounded-lg placeholder:text-gray-500 outline-primary", { "mb-1 focus:border-red-500": errors.confirmPassword })} {...register('confirmPassword')} />
          <button type="button" className="absolute top-3 right-2" onClick={() => setShowConfirmPassword(prev => !prev)}>{showConfirmPassword ? <EyeOff className=" w-5 h-5 text-gray-500" /> : <Eye className=" w-5 h-5 text-gray-500" />}</button>
          {errors.confirmPassword && <p className="text-red-500 text-start text-xs block pb-1.5 px-1">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" disabled={!isValid}>Continue</Button>
      </form>
      <span className="absolute left-10 border-b border-gray-300 border-solid min-w-[80%] h-4" />
      <QrCode />
    </CardWrapper>
  )
};

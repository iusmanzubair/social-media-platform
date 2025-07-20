import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../../redux/hooks";
import { EmailSchema, EmailType } from "../../schema/login-schema";
import { resetForm, updateSaveUser } from "../../redux/SignupForm";
import { axiosInstance } from "../../hooks/axiosInstance";
import { updateEmail } from "../../redux/SignupForm";
import { CardWrapper } from "../ui/CardWrapper";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { QrCode } from "../QrCode";
import { toast } from "sonner";

export const Signup = () => {
  const [checked, setChecked] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, setError, formState: { isValid, errors } } = useForm<EmailType>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: ""
    },
    mode: "onChange"
  })

  useEffect(() => {
    dispatch(resetForm());
  }, [dispatch])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: EmailType) => {
      return axiosInstance.post("/user/user-exists", { email: data.email })
    },
    onSuccess: (_, variables) => {
      dispatch(updateEmail(variables.email));
      dispatch(updateSaveUser(checked));
      navigate('/confirm-sign-up')
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return setError('email', {
          type: "validate",
          message: error.response?.data.message || "Something went wrong"
        })
      }

      toast.error("Something went wrong")
    }
  })

  const onSubmit = async (data: EmailType) => {
    mutate(data);
  }

  return <CardWrapper heading="Enter your email" text="You'll use your email to sign in to your account">
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-7 space-y-1">
        <input type="text" placeholder="example@domain.com" className={cn("w-full border border-gray-300 focus:border-primary outline-0 px-4 py-2 mt-2 mb-2 bg-grey rounded-lg placeholder:text-gray-500 outline-primary", { "mb-1 focus:border-red-500": errors.email })} {...register('email')} />
        {errors.email && <p className="text-red-500 text-start text-xs block pb-1.5 px-1">{errors.email.message}</p>}
        <div className="text-start space-x-2 flex items-center">
          <input type="checkbox" id="checkboxID" onClick={() => setChecked(prev => !prev)} className="cursor-pointer accent-primary w-[1.12rem] h-[1.12rem] border-2 appearance-none checked:appearance-auto rounded-md border-gray-300" />
          <label htmlFor="checkboxID" className="cursor-pointer text-gray-500 text-xs">Save user</label>
        </div>
      </div>
      <Button type="submit" isLoading={isPending} disabled={!isValid}>Continue</Button>
    </form>
    <span className="absolute left-10 border-b border-gray-300 border-solid min-w-[80%] h-4" />
    <QrCode />
    <p className="text-center text-gray-500 text-[0.7rem] mt-6">By pressing Continue, you agree to the Terms of Service and Privacy Policy</p>
  </CardWrapper>
}

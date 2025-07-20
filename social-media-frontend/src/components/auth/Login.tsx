import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../../redux/hooks";
import { resetForm, updateEmail, updateSaveUser } from "../../redux/LoginForm";
import { EmailSchema, EmailType } from "../../schema/login-schema";
import { axiosInstance } from "../../hooks/axiosInstance";
import { CardWrapper } from "../ui/CardWrapper";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { QrCode } from "../QrCode";
import { toast } from "sonner";

export const Login = () => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetForm());
  }, [dispatch])

  const [checked, setChecked] = useState<boolean>(false);
  const navigate = useNavigate();

  const { register, handleSubmit, setError, formState: { isValid, errors } } = useForm<EmailType>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: ""
    },
    mode: "onChange"
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: EmailType) => {
      return axiosInstance.post("/user/check-user", { email: data.email })
    },
    onSuccess: (_, variables) => {
      dispatch(updateEmail(variables.email));
      dispatch(updateSaveUser(checked));
      navigate('/log-in');
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

  return <CardWrapper heading="Sign in">
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-7 space-y-1">
        <input type="email" placeholder="Your email" className={cn("w-full border border-gray-300 focus:border-primary outline-0 px-4 py-2 mt-2 mb-2 bg-grey rounded-lg placeholder:text-gray-500 outline-primary", { "mb-1 focus:border-red-500": errors.email })} {...register('email')} />
        {errors.email && <p className="text-red-500 text-start text-xs block pb-1.5 px-1">{errors.email.message}</p>}
        <div className="text-start space-x-2 flex items-center">
          <input type="checkbox" id="checkboxID" onClick={() => setChecked(prev => !prev)} className="cursor-pointer accent-primary w-[1.12rem] h-[1.12rem] border-2 appearance-none checked:appearance-auto rounded-md border-gray-300" />
          <label htmlFor="checkboxID" className="cursor-pointer text-gray-500 text-xs">Save user</label>
        </div>
      </div>
      <Button type="submit" isLoading={isPending} disabled={!isValid}>Sign in</Button>
    </form>
    <span className="absolute left-10 border-b border-gray-300 border-solid min-w-[80%] h-4" />
    <QrCode />
    <p className="text-center text-xs mt-6">Don't have an account? <a href="/sign-up" className="text-primary hover:underline">Sign up</a></p>
  </CardWrapper>
}

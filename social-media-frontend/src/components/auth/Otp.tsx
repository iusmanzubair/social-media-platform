import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ConfirmationCodeSchema, ConfirmationCodeType } from "../../schema/signup-schema";
import { axiosInstance } from "../../hooks/axiosInstance";
import { updateIsEmailConfirmed } from "../../redux/SignupForm";
import { CardWrapper } from "../ui/CardWrapper";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { QrCode } from "../QrCode";
import { toast } from "sonner";

export const Otp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const email = useAppSelector((state) => state.signupForm.email)

  useEffect(() => {
    if (!email)
      navigate('/sign-up');
  }, [navigate, email])

  const { register, handleSubmit, setError, formState: { isValid, errors } } = useForm<ConfirmationCodeType>({
    resolver: zodResolver(ConfirmationCodeSchema),
    defaultValues: {
      code: ""
    },
    mode: "onChange"
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ConfirmationCodeType) => {
      return axiosInstance.post("/user/verify-otp", { email, _otp: data.code })
    },
    onSuccess: () => {
      dispatch(updateIsEmailConfirmed(true))
      navigate('/create-password')
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return setError('code', {
          type: "validate",
          message: error.response?.data.message || "Something went wrong"
        })
      }

      toast.error("Something went wrong")
    }
  })

  const onSubmit = async (data: ConfirmationCodeType) => {
    mutate(data);
  }

  return <CardWrapper heading="Enter 6-digits Code" text={`Enter the 6-digits confirmation code sent to ${email}`}>
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5 space-y-1">
        <input type="text" placeholder="Enter code" className={cn("w-full border border-gray-300 focus:border-primary outline-0 px-4 py-2 mt-2 mb-2 bg-grey rounded-lg placeholder:text-gray-500 outline-primary", { "mb-1 focus:border-red-500": errors.code })} {...register('code')} />
        {errors.code && <p className="text-red-500 text-start text-xs block pb-1.5 px-1">{errors.code.message}</p>}
      </div>
      <Button type="submit" isLoading={isPending} disabled={!isValid}>Continue</Button>
    </form>
    <span className="absolute left-10 border-b border-gray-300 border-solid min-w-[80%] h-4" />
    <QrCode />
  </CardWrapper>
}

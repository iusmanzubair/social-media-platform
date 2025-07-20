import { axiosInstance } from "../hooks/axiosInstance"
import { UserType } from "../types/types";

export const findUserById = async () => {
  try {
    const { data } = await axiosInstance.get("/user/get-user");
    return data.user;
  } catch (error) {
    console.log(error)
    throw error
  }
}

type PickedUserType = Pick<UserType, "userId" | "name" | "username" | "profileImageUrl">

export const findAllUsers = async (limit: number) => {
  try {
    const { data } = await axiosInstance.get(`/user/get-all-users?limit=${limit}`);
    return data.users as PickedUserType[]
  } catch (error) {
    console.log(error)
    throw error
  }
}


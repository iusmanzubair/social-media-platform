import { axiosInstance } from "./axiosInstance";

export const getSession = async () => {
  try {
    const { data } = await axiosInstance.get("/user/get-session")
    return data;
  } catch (error) {
    console.log(error)
  }
};

import { configureStore } from "@reduxjs/toolkit";
import LoginFormSlice from "./LoginForm";
import SignupFormSlice from "./SignupForm";

export const store = configureStore({
    reducer: {
        loginForm: LoginFormSlice,
        signupForm: SignupFormSlice
    }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']



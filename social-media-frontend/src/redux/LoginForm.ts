import { createSlice } from "@reduxjs/toolkit";

const LoginFormSlice = createSlice({
  name: 'loginForm',
  initialState: {
    email: '',
    saveUser: false,
  },
  reducers: {
    updateEmail: (state, action) => {
      state.email = action.payload
    },

    updateSaveUser: (state, action) => {
      state.saveUser = action.payload
    },

    resetForm: state => {
      state.email = '';
      state.saveUser = false;
    }
  }
})

export const { updateEmail, updateSaveUser, resetForm } = LoginFormSlice.actions

export default LoginFormSlice.reducer

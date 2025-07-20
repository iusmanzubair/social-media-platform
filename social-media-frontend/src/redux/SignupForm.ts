import { createSlice } from "@reduxjs/toolkit";

const SignupFormSlice = createSlice({
  name: 'signupForm',
  initialState: {
    email: '',
    isEmailConfirmed: false,
    saveUser: false,
    password: ''
  },
  reducers: {
    updateEmail: (state, action) => {
      state.email = action.payload
    },

    updateSaveUser: (state, action) => {
      state.saveUser = action.payload
    },

    updatePassword: (state, action) => {
      state.password = action.payload
    },

    updateIsEmailConfirmed: (state, action) => {
      state.isEmailConfirmed = action.payload
    },

    resetForm: state => {
      state.email = '';
      state.saveUser = false;
      state.password = ''
    }
  }
})

export const { updateEmail, updatePassword, updateIsEmailConfirmed, updateSaveUser, resetForm } = SignupFormSlice.actions

export default SignupFormSlice.reducer

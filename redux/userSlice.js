import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    otherUsers: null,
    profile: null,
  },
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    getMyProfile: (state, action) => {
      state.profile = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.otherUsers = null;
    },
  },
});

export const { getUser, getMyProfile, logout } = userSlice.actions;
export default userSlice.reducer;

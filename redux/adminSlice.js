import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    profile: null,
  },
  reducers: {
    getAdmin: (state, action) => {
      state.admin = action.payload;
    },
    getAdminProfile: (state, action) => {
      state.profile = action.payload;
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.profile = null;
    },
  },
});

export const { getAdmin, getAdminProfile, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;

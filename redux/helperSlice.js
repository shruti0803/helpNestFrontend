





import { createSlice } from "@reduxjs/toolkit";

const helperSlice = createSlice({
  name: "helper",
  initialState: {
    helper: null,
    profile: null,
  },
  reducers: {
    getHelper: (state, action) => {
      state.helper = null;
      state.profile = null;
      state.helper = action.payload;
    },
    getHelperProfile: (state, action) => {
      state.profile = action.payload;
    },
    logoutHelper: (state) => {
      state.helper = null;
      state.profile = null;
    },
  },
});

export const { getHelper, getHelperProfile, logoutHelper } = helperSlice.actions;
export default helperSlice.reducer;

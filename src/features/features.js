import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageNavigation: "",
  showSidebar: true,
  auth: false,
};

export const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    updatePageNavigation: (state, action) => {
      state.pageNavigation = action.payload;
    },
    updateSidebar: (state, action) => {
      state.showSidebar = action.payload
    },
    updateAuth: (state, action) => {
      state.auth = action.payload
    },
  },
});

export const { updatePageNavigation, updateSidebar, updateAuth } = featuresSlice.actions;
export const featuresReducer = featuresSlice.reducer;

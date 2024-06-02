import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageNavigation: "",
  showSidebar: true,
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
    }
  },
});

export const { updatePageNavigation, updateSidebar } = featuresSlice.actions;
export const featuresReducer = featuresSlice.reducer;

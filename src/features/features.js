import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageNavigation: "",
};

export const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    updatePageNavigation: (state, action) => {
      state.pageNavigation = action.payload;
    },
  },
});

export const { updatePageNavigation } = featuresSlice.actions;
export const featuresReducer = featuresSlice.reducer;

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { ProfileState } from "@/types/ProfileState";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProfileState = {
  enabled: {},
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    enableProfile(state, action: PayloadAction<number>) {
      state.enabled[action.payload] = true;
    },
    toggleProfile(state, action: PayloadAction<number>) {
      state.enabled[action.payload] = !state.enabled[action.payload];
    },
  },
});

export const selectProfileSlice = (state: RootState) => state.profile.enabled;
export const { enableProfile, toggleProfile } = profileSlice.actions;
export default profileSlice.reducer;

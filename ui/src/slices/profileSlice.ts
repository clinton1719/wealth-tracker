import type { ProfileState } from "@/types/ProfileState";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProfileState = {
    enabled: {}
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        enableProfile(state, action: PayloadAction<number>) {
            state.enabled[action.payload] = true;
        },
        disableProfile(state, action: PayloadAction<number>) {
            state.enabled[action.payload] = false;
        },
    },
});

export const { disableProfile, enableProfile } = profileSlice.actions;
export default profileSlice.reducer;

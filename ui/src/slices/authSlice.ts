import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  username: string | null
  token: string | null
}

const initialState: AuthState = {
  username: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<AuthState>,
    ) {
      state.username = action.payload.username
      state.token = action.payload.token
    },
    clearCredentials(state) {
      state.username = null
      state.token = null
    },
  },
})

export const selectAuthToken = (state: RootState) => state.auth.token
export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer

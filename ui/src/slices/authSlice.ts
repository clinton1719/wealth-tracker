import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  username: string | null
  token: string | null
}

const persistedUsername = localStorage.getItem('username')
const persistedToken = localStorage.getItem('token')

const initialState: AuthState = {
  username: persistedUsername || null,
  token: persistedToken || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthState>) {
      const { username, token } = action.payload
      state.username = username
      state.token = token

      if (token && username) {
        localStorage.setItem('username', username)
        localStorage.setItem('token', token)
      }
    },
    logout(state) {
      state.username = null
      state.token = null
      localStorage.removeItem('username')
      localStorage.removeItem('token')
    },
  },
})

export const selectAuthToken = (state: RootState) => state.auth.token
export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

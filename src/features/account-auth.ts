import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"

interface IStateAuth {
  isAuthenticated: boolean
  user: any
  error: boolean
  errorMessage: string
  isFetching: boolean
}
const initialState: IStateAuth = {
  isAuthenticated: false,
  user: null,
  error: false,
  errorMessage: "",
  isFetching: false,
}

export const loginUser = createAsyncThunk(
  "account-auth-login",
  async (args: IPayloadLogin) => {
    const response = await api.post("auth/login", args)
    return response
  }
)
export const accountAuthSlice = createSlice({
  name: "account-auth",
  initialState,
  reducers: {},
  extraReducers: (buildler) => {
    buildler.addCase(loginUser.fulfilled, (state, action) => {
      
    }), 
  },
})

export const selectUser = (state: RootState) => state.accountAuth

export default accountAuthSlice.reducer

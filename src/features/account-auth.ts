import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { helpers } from "helpers"
import jwt_decode from "jwt-decode"
import { TOKEN_NAME } from "settings"

interface IStateAuth {
  isAuthenticated: boolean
  user: any
  error: null | string
  isFetching: boolean
}
const initialState: IStateAuth = {
  isAuthenticated: false,
  user: null,
  error: null,
  isFetching: false,
}

interface IApiLogin {
  token: {
    "x-auth-token": string
  }
}

export const loginUser = createAsyncThunk(
  "account-auth-login",
  async (args: IPayloadLogin, thunkAPI) => {
    try {
      const response = await api.post<IApiLogin>("auth/login", args)
      return response.data
    } catch (error) {
      const value = helpers.handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)
export const accountAuthSlice = createSlice({
  name: "account-auth",
  initialState,
  reducers: {},
  extraReducers: (buildler) => {
    buildler
      .addCase(loginUser.pending, (state, action) => {
        state.error = null
        state.user = null
        state.isFetching = true
        state.isAuthenticated = false
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { payload } = action
        localStorage.setItem(TOKEN_NAME, payload.token["x-auth-token"])
        state.error = null
        state.user = jwt_decode(payload.token["x-auth-token"])
        state.isFetching = false
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string
        state.user = null
        state.isFetching = false
        state.isAuthenticated = false
      })
  },
})

export const selectUser = (state: RootState) => state.accountAuth

export default accountAuthSlice.reducer

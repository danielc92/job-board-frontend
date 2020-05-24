import {
  createSlice,
  createAsyncThunk,
  createAction,
  PayloadAction,
} from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { helpers } from "helpers"

interface IStateResetPassword {
  error: string | null
  isFetching: boolean
  modal_header: string
  modal_body: string
  modal_open: boolean
}
const initialState: IStateResetPassword = {
  error: null,
  isFetching: false,
  modal_header: "",
  modal_body: "",
  modal_open: false,
}

interface IPayloadResetPassword {
  email: string
}

export const resetPassword = createAsyncThunk(
  "account-reset-request-attempt",
  async (args: IPayloadResetPassword, thunkAPI) => {
    try {
      const response = await api.post("auth/send-reset-password", args)
      return response.data
    } catch (error) {
      const value = helpers.handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const resetRequestSlice = createSlice({
  name: "account-reset-request",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(resetPassword.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.modal_body = "Please wait while we process your request"
        state.modal_header = "Processing"
        state.modal_open = false
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.modal_body = action.payload.message
        state.modal_header = "Success"
        state.modal_open = true
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.modal_body = action.payload as string
        state.modal_header = "An error has occured"
        state.modal_open = true
      })
  },
})

export const { reset } = resetRequestSlice.actions
export const selectResetPassword = (state: RootState) => state.resetPassword

export default resetRequestSlice.reducer

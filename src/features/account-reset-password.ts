import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"

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
  token: string
  password: string
}

export const tryResetPassword = createAsyncThunk(
  "account-reset-password",
  async (args: IPayloadResetPassword, thunkAPI) => {
    try {
      const response = await api.post("auth/reset-password", args)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const resetPasswordSlice = createSlice({
  name: "account-reset-password",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(tryResetPassword.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.modal_body = "Please wait while we process your request"
        state.modal_header = "Processing"
        state.modal_open = false
      })
      .addCase(tryResetPassword.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.modal_body = action.payload.message
        state.modal_header = "Success"
        state.modal_open = true
      })
      .addCase(tryResetPassword.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.modal_body = action.payload as string
        state.modal_header = "An error has occurred"
        state.modal_open = true
      })
  },
})

export const { reset } = resetPasswordSlice.actions
export const selectResetPassword = (state: RootState) => state.resetPassword

export default resetPasswordSlice.reducer

// auth/activate?token=

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"

interface IStateAccountActivation {
  error: string | null
  isFetching: boolean
  modal_header: string
  modal_body: string
  modal_open: boolean
}
const initialState: IStateAccountActivation = {
  error: null,
  isFetching: false,
  modal_header: "",
  modal_body: "",
  modal_open: false,
}

export const activateAccount = createAsyncThunk(
  "account-activate",
  async (args: string, thunkAPI) => {
    try {
      const response = await api.post(`auth/activate?token=${args}`)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const accountActivationSlice = createSlice({
  name: "account-activate",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(activateAccount.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.modal_body = "Please wait while we process your request"
        state.modal_header = "Processing"
        state.modal_open = false
      })
      .addCase(activateAccount.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.modal_body = action.payload.message
        state.modal_header = "Success"
        state.modal_open = true
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.modal_body = action.payload as string
        state.modal_header = "An error has occurred"
        state.modal_open = true
      })
  },
})

export const { reset } = accountActivationSlice.actions
export const selectAccountActivation = (state: RootState) =>
  state.accountActivation

export default accountActivationSlice.reducer

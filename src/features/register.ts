import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"

interface IStateRegister {
  error: string | null
  isFetching: boolean
  modal_header: string
  modal_body: string
  modal_open: boolean
}
const initialState: IStateRegister = {
  error: null,
  isFetching: false,
  modal_header: "",
  modal_body: "",
  modal_open: false,
}

interface IPayloadResetPassword {
  email: string
  password: string
  first_name: string
  last_name: string
  is_employer: boolean
}

export const registerUser = createAsyncThunk(
  "register",
  async (args: IPayloadResetPassword, thunkAPI) => {
    try {
      const response = await api.post("auth/register", args)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(registerUser.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.modal_body = ""
        state.modal_header = ""
        state.modal_open = false
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.modal_body = action.payload.message
        state.modal_header = "Success"
        state.modal_open = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.modal_body = action.payload as string
        state.modal_header = "Error"
        state.modal_open = true
      })
  },
})

export const { reset } = registerSlice.actions
export const selectRegister = (state: RootState) => state.register

export default registerSlice.reducer

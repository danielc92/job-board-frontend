import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"
import { getMyDetails } from "./account-details"

interface IStateUpdateMyDetails {
  error: string | null
  isFetching: boolean
  modal_header: string
  modal_body: string
  modal_open: boolean
}
const initialState: IStateUpdateMyDetails = {
  error: null,
  isFetching: false,
  modal_header: "",
  modal_body: "",
  modal_open: false,
}

interface IPayloadUpdateMyDetails {
  saved_searches?: string[]
  saved_jobs?: string[]
}

export const updateMyDetails = createAsyncThunk(
  "my-details-update",
  async (args: IPayloadUpdateMyDetails, thunkAPI) => {
    try {
      const config = getConfig()
      const response = await api.patch("auth/my-details", args, config)
      thunkAPI.dispatch(getMyDetails())
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const updateDetailsSlice = createSlice({
  name: "my-details-update",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(updateMyDetails.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.modal_body = ""
        state.modal_header = ""
        state.modal_open = false
      })
      .addCase(updateMyDetails.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.modal_body = action.payload.message
        state.modal_header = "Success"
        state.modal_open = true
      })
      .addCase(updateMyDetails.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.modal_body = action.payload as string
        state.modal_header = "Error"
        state.modal_open = true
      })
  },
})

export const { reset } = updateDetailsSlice.actions
export const selectMyDetailsUpdate = (state: RootState) => state.myDetailsUpdate

export default updateDetailsSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"
import { getMyApplcations } from "./my-applications"

interface IStateUpdateApplication {
  error: string | null
  isFetching: boolean
  modal_header: string
  modal_body: string
  modal_open: boolean
}
const initialState: IStateUpdateApplication = {
  error: null,
  isFetching: false,
  modal_header: "",
  modal_body: "",
  modal_open: false,
}

type IStatus = "pending" | "withdrawn" | "interested" | "rejected"
interface IPayloadJobApplicationUpdate {
  job_id?: string
  status?: IStatus
  applicant_id?: string
}

export const updateApplication = createAsyncThunk(
  "job-application-update",
  async (args: IPayloadJobApplicationUpdate, thunkAPI) => {
    try {
      const config = getConfig()
      const response = await api.patch("application", args, config)
      thunkAPI.dispatch(getMyApplcations({ page: "1" }))
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const updateApplicationSlice = createSlice({
  name: "job-application-update",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(updateApplication.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.modal_body = ""
        state.modal_header = ""
        state.modal_open = false
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.modal_body = action.payload.message
        state.modal_header = "Success"
        state.modal_open = true
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.modal_body = action.payload as string
        state.modal_header = "Error"
        state.modal_open = true
      })
  },
})

export const { reset } = updateApplicationSlice.actions
export const selectApplicationUpdate = (state: RootState) =>
  state.applicationUpdate

export default updateApplicationSlice.reducer

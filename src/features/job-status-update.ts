import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"
import { getMyPostings } from "./my-postings"

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

interface IPayloadJobStatusUpdate {
  job_id: string
}

export const updateJobStatus = createAsyncThunk(
  "job-status-update",
  async (args: IPayloadJobStatusUpdate, thunkAPI) => {
    try {
      const config = getConfig()
      const response = await api.patch("job", args, config)
      thunkAPI.dispatch(getMyPostings({ page: "1" }))
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const jobUpdateStatusSlice = createSlice({
  name: "job-status-update",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(updateJobStatus.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.modal_body = ""
        state.modal_header = ""
        state.modal_open = false
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.modal_body = action.payload.message
        state.modal_header = "Success"
        state.modal_open = true
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.modal_body = action.payload as string
        state.modal_header = "Error"
        state.modal_open = true
      })
  },
})

export const { reset } = jobUpdateStatusSlice.actions
export const selectJobStatusUpdate = (state: RootState) => state.jobUpdateStatus

export default jobUpdateStatusSlice.reducer

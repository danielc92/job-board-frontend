import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"

interface IStateJobApplication {
  error: string | null
  isFetching: boolean
  modal_header: string
  modal_body: string
  modal_open: boolean
}
const initialState: IStateJobApplication = {
  error: null,
  isFetching: false,
  modal_header: "",
  modal_body: "",
  modal_open: false,
}

interface IPayloadJobApplication {
  user_message: string
  job_id: string
}

export const applyForJob = createAsyncThunk(
  "job-application",
  async (args: IPayloadJobApplication, thunkAPI) => {
    try {
      const config = getConfig()
      const response = await api.post("application", args, config)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const applyForJobSlice = createSlice({
  name: "job-application",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(applyForJob.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.modal_body = ""
        state.modal_header = ""
        state.modal_open = false
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.modal_body = action.payload.message
        state.modal_header = "Success"
        state.modal_open = true
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.modal_body = action.payload as string
        state.modal_header = "Error"
        state.modal_open = true
      })
  },
})

export const { reset } = applyForJobSlice.actions
export const selectApplyForJob = (state: RootState) => state.jobApply

export default applyForJobSlice.reducer

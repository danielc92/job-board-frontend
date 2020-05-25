import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"

export interface IPayloadJobPost {
  title: string
  category: string
  skills: string[]
  benefits: string[]
  company_summary: string
  job_summary: string
  company_name: string
  contact_summary: string
  salary_range_low: string
  salary_range_high: string
  employment_type: string
  location: {
    coordinates: number[]
    type: string
  }
  location_string: string
}
interface IStateJobPost {
  error: null | string
  isFetching: boolean
  modalHeader: string
  modalContent: string
}
const initialState: IStateJobPost = {
  error: null,
  isFetching: false,
  modalHeader: "",
  modalContent: "",
}

export const postJob = createAsyncThunk(
  "job-post",
  async (args: IPayloadJobPost, thunkAPI) => {
    try {
      const response = await api.post("job", args, getConfig())
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const jobPostSlice = createSlice({
  name: "job-post",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(postJob.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.modalContent = ""
        state.modalHeader = ""
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.modalContent = "Your job has been successfully posted."
        state.modalHeader = "Success"
      })
      .addCase(postJob.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.modalContent = action.payload as string
        state.modalHeader = "Error"
      })
  },
})

export const { reset } = jobPostSlice.actions
export const selectJobPost = (state: RootState) => state.jobPost

export default jobPostSlice.reducer

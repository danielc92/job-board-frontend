import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"
import qs, { ParsedUrlQueryInput } from "querystring"

interface IApiJob {
  _id: string
  title: string
  slug: string
  creator_id: string
  category: string
  company_name: string
  benefits: string[]
  skills: string[]
  job_summary: string
  contact_summary: string
  requirements: string[]
  salary_range_low: number
  salary_range_high: number
  open: boolean
  closes: boolean
  location: {
    type: string
    coordinates: number[]
  }
  location_string: string
  employment_type: string
  createdAt: string
  modifiedAt: string
}

type IPaginatedJobList = IPaginatedData<IApiJob>

interface IStateJobList {
  error: null | string
  isFetching: boolean
  jobList: IPaginatedJobList | null
}
const initialState: IStateJobList = {
  error: null,
  isFetching: false,
  jobList: null,
}

interface IPayloadJobList extends ParsedUrlQueryInput {
  title?: string
  location_string?: string
  category?: string
  page?: string
}

export const getJobList = createAsyncThunk(
  "jobs-list",
  async (args: IPayloadJobList, thunkAPI) => {
    try {
      const queryString = qs.stringify(args)
      const response = await api.get(`job/list?${queryString}`)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const jobListSlice = createSlice({
  name: "jobs-list",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getJobList.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.jobList = null
      })
      .addCase(getJobList.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.jobList = action.payload
      })
      .addCase(getJobList.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.jobList = null
      })
  },
})
export const { reset } = jobListSlice.actions
export const selectJobList = (state: RootState) => state.jobList

export default jobListSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"

interface IStateSavedJobs {
  error: null | string
  isFetching: boolean
  savedJobs: {
    results: Array<IApiJob>
  } | null
}
const initialState: IStateSavedJobs = {
  error: null,
  isFetching: false,
  savedJobs: null,
}

export const getSavedJobs = createAsyncThunk(
  "saved-jobs-list",
  async (args: void, thunkAPI) => {
    try {
      const config = getConfig()
      const response = await api.get(`job/list/saved`, config)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const savedJobsSlice = createSlice({
  name: "saved-jobs-list",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getSavedJobs.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.savedJobs = null
      })
      .addCase(getSavedJobs.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.savedJobs = action.payload
      })
      .addCase(getSavedJobs.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.savedJobs = null
      })
  },
})
export const { reset } = savedJobsSlice.actions
export const selectSavedJobs = (state: RootState) => state.savedJobs

export default savedJobsSlice.reducer

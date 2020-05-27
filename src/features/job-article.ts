import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"

interface IStateJobArticle {
  error: string | null
  isFetching: boolean
  job: {
    results: IApiJob
  } | null
}

const initialState: IStateJobArticle = {
  error: null,
  isFetching: false,
  job: null,
}

export const getJobBySlug = createAsyncThunk(
  "job-article",
  async (args: string, thunkAPI) => {
    try {
      const response = await api.get(`job?slug=${args}`)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const jobArticleSlice = createSlice({
  name: "job-article",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getJobBySlug.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.job = null
      })
      .addCase(getJobBySlug.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.job = action.payload
      })
      .addCase(getJobBySlug.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.job = null
      })
  },
})

export const selectJobArticle = (state: RootState) => state.jobArticle

export default jobArticleSlice.reducer

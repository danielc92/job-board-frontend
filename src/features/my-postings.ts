import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"

type IApiMyJobPosts = IPaginatedData<IMyPost>

interface IStateMyPostings {
  error: string | null
  isFetching: boolean
  myPostings: IApiMyJobPosts | null
}

const initialState: IStateMyPostings = {
  error: null,
  isFetching: false,
  myPostings: null,
}

export const getMyPostings = createAsyncThunk(
  "my-postings",
  async (args: { page?: string }, thunkAPI) => {
    const config = getConfig()
    try {
      const response = await api.get(
        `job/list/employer${args.page ? `?page=${args.page}` : ""}`,
        config
      )
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const myPostingsSlice = createSlice({
  name: "my-postings",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getMyPostings.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.myPostings = null
      })
      .addCase(getMyPostings.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.myPostings = action.payload
      })
      .addCase(getMyPostings.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.myPostings = null
      })
  },
})

export const selectMyPostings = (state: RootState) => state.myPostings

export default myPostingsSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"
import querystring, { ParsedUrlQuery } from "querystring"

type IPaginatedNews = IPaginatedData<{
  _id: string
  title: string
  slug: string
  category: string
  summary: string
  createdAt: string
  id: string
}>

interface IStateNewsList {
  error: string | null
  isFetching: boolean
  news: IPaginatedNews | null
}

const initialState: IStateNewsList = {
  error: null,
  isFetching: false,
  news: null,
}

export const getNewsList = createAsyncThunk(
  "news-list",
  async (args: ParsedUrlQuery, thunkAPI) => {
    try {
      const queryParams = querystring.stringify(args)
      const response = await api.get(`news/list?${queryParams}`)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const newsSlice = createSlice({
  name: "news-list",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getNewsList.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.news = null
      })
      .addCase(getNewsList.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.news = action.payload
      })
      .addCase(getNewsList.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.news = null
      })
  },
})

export const selectNewsList = (state: RootState) => state.news

export default newsSlice.reducer

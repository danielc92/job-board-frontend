import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"

interface INewsItem {
  results: {
    _id: string
    title: string
    slug: string
    category: string
    summary: string
    content: any[]
    createdAt: string
    id: string
  }
}

interface IStateNewsArticle {
  error: string | null
  isFetching: boolean
  news: INewsItem | null
}

const initialState: IStateNewsArticle = {
  error: null,
  isFetching: false,
  news: null,
}

export const getNewsArticle = createAsyncThunk(
  "news-article",
  async (args: string, thunkAPI) => {
    try {
      const response = await api.get(`news?slug=${args}`)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const newsArticleSlice = createSlice({
  name: "news-article",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getNewsArticle.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.news = null
      })
      .addCase(getNewsArticle.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.news = action.payload
      })
      .addCase(getNewsArticle.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.news = null
      })
  },
})

export const selectNewsArticle = (state: RootState) => state.newsArticle

export default newsArticleSlice.reducer

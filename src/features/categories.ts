import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"

interface IApiCategory {
  name: string
  _id: string
}

interface IStateCategory {
  error: null | string
  isFetching: boolean
  categories: IApiCategory[] | null
}
const initialState: IStateCategory = {
  error: null,
  isFetching: false,
  categories: null,
}

export const getCategories = createAsyncThunk(
  "category-list",
  async (args: void, thunkAPI) => {
    try {
      const response = await api.get(`category/list`)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const categoriesSlice = createSlice({
  name: "category-list",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getCategories.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.categories = null
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.categories = action.payload
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.categories = null
      })
  },
})

export const selectCategories = (state: RootState) => state.categories

export default categoriesSlice.reducer

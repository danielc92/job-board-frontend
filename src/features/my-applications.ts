import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"

type IApiMyApplications = IPaginatedData<IMyApplcation>

interface IStateMyApplications {
  error: string | null
  isFetching: boolean
  myApplications: IApiMyApplications | null
}

const initialState: IStateMyApplications = {
  error: null,
  isFetching: false,
  myApplications: null,
}

export const getMyApplcations = createAsyncThunk(
  "my-applications",
  async (args: { page?: string }, thunkAPI) => {
    const config = getConfig()
    try {
      const response = await api.get(
        `application/list${args.page ? `?page=${args.page}` : ""}`,
        config
      )
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const myApplicationsSlice = createSlice({
  name: "my-applications",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getMyApplcations.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.myApplications = null
      })
      .addCase(getMyApplcations.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.myApplications = action.payload
      })
      .addCase(getMyApplcations.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.myApplications = null
      })
  },
})

export const selectMyApplications = (state: RootState) => state.myApplications

export default myApplicationsSlice.reducer

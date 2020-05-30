import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"
import querystring, { ParsedUrlQueryInput } from "querystring"

type IApiMyApplications = IPaginatedData<IMyPostingDetail>

interface IStateMyPostingDetails {
  error: string | null
  isFetching: boolean
  myPostingDetails: IApiMyApplications | null
}

const initialState: IStateMyPostingDetails = {
  error: null,
  isFetching: false,
  myPostingDetails: null,
}

interface IPayloadPostingDetails extends ParsedUrlQueryInput {
  page?: string
  job_id: string
}

export const getPostingDetails = createAsyncThunk(
  "my-posting-details",
  async (args: IPayloadPostingDetails, thunkAPI) => {
    try {
      const config = getConfig()
      const string = querystring.stringify(args)
      const response = await api.get(
        `application/list/employer?${string}`,
        config
      )
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const myPostingDetailsSlice = createSlice({
  name: "my-posting-details",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getPostingDetails.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.myPostingDetails = null
      })
      .addCase(getPostingDetails.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.myPostingDetails = action.payload
      })
      .addCase(getPostingDetails.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.myPostingDetails = null
      })
  },
})

export const selectMyPostingDetails = (state: RootState) =>
  state.myPostingDetails

export default myPostingDetailsSlice.reducer

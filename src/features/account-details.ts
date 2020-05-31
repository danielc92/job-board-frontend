// "is_employer": false,
// "activated": true,
// "saved_searches": [
//     "?title=janitor"
// ],
// "saved_jobs": [
//     "5ed35592b2818140c052aadb"
// ],
// "_id": "5ed35592b2818140c052aae3",
// "email": "test-seeker-1@applymer-test.com",
// "first_name": "heath",
// "last_name": "carroll",
// "__v": 0,
// "createdAt": "2020-05-31T06:58:26.661Z",
// "updatedAt":

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"

interface IApiMyDetails {
  saved_searches: string[]
  saved_jobs: string[]
  _id: string
  email: string
  first_name: string
  last_name: string
  createdAt: string
  updatedAt: string
}

interface IStateMyDetails {
  error: string | null
  isFetching: boolean
  myDetails: {
    results: IApiMyDetails
  } | null
}

const initialState: IStateMyDetails = {
  error: null,
  isFetching: false,
  myDetails: null,
}

export const getMyDetails = createAsyncThunk(
  "my-details",
  async (args: void, thunkAPI) => {
    try {
      const config = getConfig()
      const response = await api.get("auth/my-details", config)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const myDetailsSlice = createSlice({
  name: "my-details",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getMyDetails.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.myDetails = null
      })
      .addCase(getMyDetails.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.myDetails = action.payload
      })
      .addCase(getMyDetails.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.myDetails = null
      })
  },
})

export const selectDetails = (state: RootState) => state.myDetails

export default myDetailsSlice.reducer

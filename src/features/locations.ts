import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"

interface IApiLocation {
  locality: string
  location: {
    coordinates: number[]
    type: string
  }
  location_string: string
  postcode: number
  state: string
}

interface IStateLocations {
  error: null | string
  isFetching: boolean
  locations: IApiLocation[] | null
}
const initialState: IStateLocations = {
  error: null,
  isFetching: false,
  locations: null,
}

export const getLocations = createAsyncThunk(
  "location-list",
  async (args: string, thunkAPI) => {
    try {
      const response = await api.get(`location/list?${args}`)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const locationSlice = createSlice({
  name: "location-list",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getLocations.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.locations = null
      })
      .addCase(getLocations.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.locations = action.payload
      })
      .addCase(getLocations.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.locations = null
      })
  },
})

export const selectLocations = (state: RootState) => state.locations

export default locationSlice.reducer

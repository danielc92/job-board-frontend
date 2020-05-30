import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"

interface IApiProfile {
  summary: string
  skills: string[]
  experience: IExperience[]
  education: IEducation[]
  available: boolean
  phone: string
  user_id: {
    is_employer: boolean
    _id: string
    email: string
    first_name: string
    last_name: string
    createdAt: string
    updatedAt: string
  }
  createdAt: string
  updatedAt: string
}

interface IStateProfile {
  error: string | null
  isFetching: boolean
  profile: {
    results: IApiProfile
  } | null
}

const initialState: IStateProfile = {
  error: null,
  isFetching: false,
  profile: null,
}

export const getProfile = createAsyncThunk(
  "profile",
  async (args: { user_id?: string }, thunkAPI) => {
    try {
      const config = getConfig()
      const { user_id } = args
      const response = await api.get(
        `career-profile${user_id ? `?user_id=${user_id}` : ""}`,
        config
      )
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getProfile.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.profile = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.profile = action.payload
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.profile = null
      })
  },
})

export const selectProfile = (state: RootState) => state.profile

export default profileSlice.reducer

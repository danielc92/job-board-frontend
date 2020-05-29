import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getConfig, handleAxiosError } from "utils/api"
import { api } from "api"
import { RootState } from "app/store"
import { getProfile } from "features/account-profile"

interface IApiProfilePatch {
  summary: string
  skills: string[]
  experience: any[]
  education: any[]
  achievements: any[]
  available: boolean
  phone: string
  user_id: string
  createdAt: string
  updatedAt: string
}

interface IStateProfileUpdate {
  error: string | null
  isFetching: boolean
  profileUpdate: {
    results: IApiProfilePatch
  } | null
}

const initialState: IStateProfileUpdate = {
  error: null,
  isFetching: false,
  profileUpdate: null,
}

interface IPayloadProfilePatch {
  summary?: string
  skills?: string[]
  experience?: any[]
  education?: any[]
  achievements?: any[]
  available?: boolean
  phone?: string
}
export const updateProfile = createAsyncThunk(
  "profile-update",
  async (args: IPayloadProfilePatch | void, thunkAPI) => {
    try {
      const config = getConfig()
      const response = await api.patch(`career-profile`, args, config)
      thunkAPI.dispatch(getProfile())
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const updateProfileSlice = createSlice({
  name: "profile-update",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(updateProfile.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.profileUpdate = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.profileUpdate = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.profileUpdate = null
      })
  },
})

export const selectProfileUpdate = (state: RootState) => state.profileUpdate

export default updateProfileSlice.reducer

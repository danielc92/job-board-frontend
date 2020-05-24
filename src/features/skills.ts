import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"

interface IApiSkill {
  name: string
  _id: string
}

interface IStateSkills {
  error: null | string
  isFetching: boolean
  skills: IApiSkill[] | null
}
const initialState: IStateSkills = {
  error: null,
  isFetching: false,
  skills: null,
}

export const getSkills = createAsyncThunk(
  "skills-list",
  async (args: void, thunkAPI) => {
    try {
      const response = await api.get(`skill/list`)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const skillSlice = createSlice({
  name: "skills-list",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getSkills.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.skills = null
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.skills = action.payload
      })
      .addCase(getSkills.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.skills = null
      })
  },
})

export const selectSkills = (state: RootState) => state.skills

export default skillSlice.reducer

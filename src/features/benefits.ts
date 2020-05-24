import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"

interface IApiBenefit {
  name: string
  _id: string
}

interface IStateBenefits {
  error: null | string
  isFetching: boolean
  benefits: {
    results: IApiBenefit[]
  } | null
}
const initialState: IStateBenefits = {
  error: null,
  isFetching: false,
  benefits: null,
}

export const getBenefits = createAsyncThunk(
  "benefit-list",
  async (args: void, thunkAPI) => {
    try {
      const response = await api.get(`benefit/list`)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const benefitSlice = createSlice({
  name: "benefit-list",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getBenefits.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.benefits = null
      })
      .addCase(getBenefits.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.benefits = action.payload
      })
      .addCase(getBenefits.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.benefits = null
      })
  },
})

export const selectBenefits = (state: RootState) => state.benefits

export default benefitSlice.reducer

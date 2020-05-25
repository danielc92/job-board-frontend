import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError, getConfig } from "utils/api"

export interface IPayloadFeedback {
  message: string
  category: string
}

interface IStateFeedback {
  error: null | string
  isFetching: boolean
  modalHeader: string
  modalContent: string
}
const initialState: IStateFeedback = {
  error: null,
  isFetching: false,
  modalHeader: "",
  modalContent: "",
}

export const postFeedback = createAsyncThunk(
  "feedback",
  async (args: IPayloadFeedback, thunkAPI) => {
    try {
      const config = getConfig()
      console.log(config)
      const response = await api.post("feedback", args, config)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(postFeedback.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.modalContent = ""
        state.modalHeader = ""
      })
      .addCase(postFeedback.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.modalContent = action.payload.message as string
        state.modalHeader = "Success"
      })
      .addCase(postFeedback.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.modalContent = action.payload as string
        state.modalHeader = "Error"
      })
  },
})

export const { reset } = feedbackSlice.actions
export const selectFeedback = (state: RootState) => state.feedback

export default feedbackSlice.reducer

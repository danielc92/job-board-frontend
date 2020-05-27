import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { api } from "api"
import { handleAxiosError } from "utils/api"

interface IApiDocumentation {
  _id: string
  title: string
  route: string
  content: any[]
  createdAt: number
  modifiedAt: number
}
interface IStateDocumentation {
  error: string | null
  isFetching: boolean
  documentation: { results: IApiDocumentation[] } | null
}

const initialState: IStateDocumentation = {
  error: null,
  isFetching: false,
  documentation: null,
}

export const getDocumentationList = createAsyncThunk(
  "documentation-list",
  async (args: void, thunkAPI) => {
    try {
      const response = await api.get(`documentation/list`)
      return response.data
    } catch (error) {
      const value = handleAxiosError(error)
      return thunkAPI.rejectWithValue(value)
    }
  }
)

export const documentationSlice = createSlice({
  name: "documentation-list",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (buildler) => {
    buildler
      .addCase(getDocumentationList.pending, (state, action) => {
        state.error = null
        state.isFetching = true
        state.documentation = null
      })
      .addCase(getDocumentationList.fulfilled, (state, action) => {
        state.error = null
        state.isFetching = false
        state.documentation = action.payload
      })
      .addCase(getDocumentationList.rejected, (state, action) => {
        state.error = action.payload as string
        state.isFetching = false
        state.documentation = null
      })
  },
})

export const selectDocumentation = (state: RootState) => state.documentation

export default documentationSlice.reducer

import { createSlice, Dispatch, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"

const initialState: {
  loading: boolean
  results: any[]
  error: string | null
} = {
  loading: false,
  results: [],
  error: null,
}

export const fetchTodos = createAsyncThunk(
  "todos/fetchAll",
  async (arg: void) => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos")
    const json = await res.json()
    return json
  }
)
export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (buildler) => {
    buildler.addCase(fetchTodos.fulfilled, (state, action) => {
      state.results = action.payload
    })
  },
})

export const selectTodos = (state: RootState) => state.todos

export default todosSlice.reducer

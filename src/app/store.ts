import {
  configureStore,
  getDefaultMiddleware,
  Middleware,
} from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"
import { createLogger } from "redux-logger"

const logger = createLogger({
  // ...options
})

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: [...getDefaultMiddleware(), logger as Middleware<any>],
})

export type RootState = ReturnType<typeof store.getState>

export default store

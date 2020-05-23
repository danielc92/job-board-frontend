import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"
import { createLogger } from "redux-logger"

const logger = createLogger({
  // ...options
})

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: [logger, ...getDefaultMiddleware()],
})

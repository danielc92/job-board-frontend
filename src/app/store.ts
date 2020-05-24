import {
  configureStore,
  getDefaultMiddleware,
  Middleware,
} from "@reduxjs/toolkit"
import { rootReducer } from "app/rootReducer"
import { createLogger } from "redux-logger"

const logger = createLogger({
  // ...options
  timestamp: true,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), logger as Middleware],
})

export type RootState = ReturnType<typeof store.getState>

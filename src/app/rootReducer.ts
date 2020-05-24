import todos from "features/example"
import accountAuth from "features/account-auth"
import resetPassword from "features/account-reset-request"
import register from "features/register"
import newsList from "features/news-list"
import { combineReducers, Action } from "@reduxjs/toolkit"
import { TOKEN_NAME } from "settings"

const appReducer = combineReducers({
  todos,
  accountAuth,
  register,
  resetPassword,
  newsList,
})
export const rootReducer = (state: any, action: Action) => {
  if (action.type === "LOGOUT_SUCCESS") {
    localStorage.removeItem(TOKEN_NAME)
    state = undefined
  }
  return appReducer(state, action)
}

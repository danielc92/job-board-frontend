import todos from "features/example"
import accountAuth from "features/account-auth"
import resetPassword from "features/account-reset-request"
import register from "features/register"
import news from "features/news-list"
import skills from "features/skills"
import categories from "features/categories"
import benefits from "features/benefits"
import jobPost from "features/job-post"
import jobList from "features/job-list"
import feedback from "features/feedback"
import jobApply from "features/job-application"
import locations from "features/locations"
import jobArticle from "features/job-article"
import newsArticle from "features/news-article"
import { combineReducers, Action } from "@reduxjs/toolkit"
import { TOKEN_NAME } from "settings"

const appReducer = combineReducers({
  accountAuth,
  benefits,
  categories,
  jobList,
  jobArticle,
  news,
  newsArticle,
  jobPost,
  jobApply,
  locations,
  register,
  resetPassword,
  skills,
  feedback,
  todos,
})

export const rootReducer = (state: any, action: Action) => {
  if (action.type === "LOGOUT_SUCCESS") {
    localStorage.removeItem(TOKEN_NAME)
    state = undefined
  }
  return appReducer(state, action)
}

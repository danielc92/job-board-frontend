import accountAuth from "features/account-auth"
import benefits from "features/benefits"
import categories from "features/categories"
import documentation from "features/documentation"
import feedback from "features/feedback"
import jobApply from "features/job-application"
import jobArticle from "features/job-article"
import jobList from "features/job-list"
import jobPost from "features/job-post"
import locations from "features/locations"
import news from "features/news-list"
import newsArticle from "features/news-article"
import register from "features/register"
import resetPassword from "features/account-reset-request"
import skills from "features/skills"
import { combineReducers, Action } from "@reduxjs/toolkit"
import { TOKEN_NAME } from "settings"

const appReducer = combineReducers({
  accountAuth,
  benefits,
  categories,
  documentation,
  feedback,
  jobApply,
  jobArticle,
  jobList,
  jobPost,
  locations,
  news,
  newsArticle,
  register,
  resetPassword,
  skills,
})

export const rootReducer = (state: any, action: Action) => {
  if (action.type === "LOGOUT_SUCCESS") {
    localStorage.removeItem(TOKEN_NAME)
    state = undefined
  }
  return appReducer(state, action)
}
